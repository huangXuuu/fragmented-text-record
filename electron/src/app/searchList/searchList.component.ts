import { Component, OnInit, NgZone } from '@angular/core';
import { RestApiService, RestType } from '../shared/rest-api.service';
import { ApiOption } from '../shared/rest.service';
import { Tool } from '../shared/tool';
import * as _ from 'lodash';
import { IpcRendererService, IpcType } from '../shared/ipc-renderer.service';
import { NzMessageService } from 'ng-zorro-antd/message';

const QueryDateType = {
  create: 'createDate',
  update: 'updateDate'
};

@Component({
  selector: 'app-search-list',
  templateUrl: './searchList.component.html',
  styleUrls: ['./searchList.component.css'],
})
export class SearchListComponent implements OnInit {

  // 空结果表示flag
  searched = false;

  // 搜索内容
  searchForm = {
    class: '',                            // 分类
    title: '',                            // 标题
    date: undefined,                      // 日期
    dateType: QueryDateType.create,       // 日期检索模式
    content: '',                          // 内容
  };

  // 分类list
  options = ['培训', '日常会议', '客户'];

  // 日期检索类型
  dateQueryList = [
    {
      value: QueryDateType.create,
      label: '创建日'
    },
    {
      value: QueryDateType.update,
      label: '更新日'
    }
  ];

  // 分类list-自动完成表示项
  filteredOptions = [];

  // 搜索结果list
  responseData = {};

  // 绑定结果list
  data = [];

  loading = false;

  searchFormKeyList = ['class', 'title', 'content', 'updateDate', 'createDate'];

  // =========================================== 导出用checkbox =========================================
  // 全选flag
  isAllDataChecked = false;

  // 部分选择标记flag
  isIndeterminate = false;

  // checkList
  mapOfCheckedId: { [key: string]: boolean } = {};

  constructor(
    private restApiService: RestApiService,
    private ipcRendererService: IpcRendererService,
    private ngZone: NgZone,
    private message: NzMessageService
  ) {
  }

  ngOnInit() {
    this.filteredOptions = this.options;
    this.initSearchForm();
    this.ipcRendererService.on(IpcType.exportSuccess, (event, arg) => {
      this.ngZone.run(() => {
        if (arg) {
          this.message.info('文件导出成功！');
        }
      });
    });

    // 分类list取得
    this.ipcRendererService.on(IpcType.getClassListSuccess, (event, arg) => {
      this.ngZone.run(() => {
        if (arg) {
          this.options = arg;
          this.filteredOptions = this.options;
        }
      });
    });

    this.ipcRendererService.send(IpcType.getClassList);
  }

  // 清空
  onClear() {
    this.initSearchForm();
  }

  // 搜索
  onSearch() {
    const apiOpt = <ApiOption>{
      apiKey: 'getSearchList',
      body: this.setQuery()
    };
    this.restApiService.doRequest(RestType.POST, apiOpt).subscribe(val => {
      this.data = [];
      this.responseData = {};
      this.searched = true;
      this.tableCheckBoxReset();
      if (val) {
        this.responseData = val;
        this.handleTabList();
      }
    }, err => {
      this.data = [];
      this.responseData = {};
      this.searched = true;
    });
  }

  setQuery() {
    const query = {
      highlight: {
        pre_tags: ['<highLightTag>'],
        post_tags: ['</highLightTag>'],
        number_of_fragments: 3,
        fragment_size: 150,
        fields: {
          class: { number_of_fragments: 0 },
          title: { number_of_fragments: 0 },
          content: { number_of_fragments: 0 },
        }
      },
      query: {
        bool: {
          filter: []
        },
      },
    };

    this.setMatchTerms(query);
    this.setMatch(query);
    this.setKeyWord(query);
    this.setRange(query);
    return query;
  }

  setMatchTerms(query) {
    if (this.searchForm.class) {
      query.query.bool.filter.push({
        term: {
          class: this.searchForm.class
        }
      });
    }
  }

  setMatch(query) {
    if (this.searchForm.title) {
      query.query.bool.filter.push({
        match_phrase: {
          title: {
            query: this.searchForm.title
          }
        }
      });
    }
  }

  setKeyWord(query) {
    if (this.searchForm.content) {
      query.query.bool.filter.push({
        match: {
          content: {
            query: this.searchForm.content
          }
        }
      });
    }
  }

  setRange(query) {
    if (this.searchForm.date) {
      query.query.bool.filter.push({
        range: {
          [this.searchForm.dateType]: {
            from: Tool.formatDate(Tool.setRangDateFrom(this.searchForm.date[0])),
            to: Tool.formatDate(Tool.setRangDateTo(this.searchForm.date[1]))
          },
        }
      });
    }
  }

  handleTabList() {
    if (this.responseData['hits']) {
      if (this.responseData['hits'].hits) {
        this.responseData['hits'].hits.map(val => {
          const item = {};
          item['id'] = val._id;
          this.searchFormKeyList.map(key => {
            item[key] = this.setDataList(val, key);
          });

          this.data.push(item);
        });
      }
    }
  }

  setDataList(val, key) {
    if (val.highlight && val.highlight[key]) {
      return val.highlight[key][0];
    } else if (val._source) {
      return val._source[key];
    }
    return '';
  }

  onClassModelChange(value: string): void {
    this.filteredOptions = this.options.filter(option => option.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  onListItemChange($event) {
    if ($event.type === 'delete') {
      const cacheData = _.cloneDeep(this.data);
      cacheData.splice($event.index, 1);
      this.data = cacheData;
    }
  }

  classClear() {
    this.searchForm.class = '';
    this.onClassModelChange('');
  }

  initSearchForm() {
    this.searchForm = {
      class: '',                            // 分类
      title: '',                            // 标题
      date: undefined,                      // 日期
      dateType: QueryDateType.create,       // 日期检索模式
      content: '',                          // 内容
    };
  }

  // =========================================== 导出用checkbox =========================================
  refreshStatus(): void {
    this.isAllDataChecked = this.data.every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate =
      this.data.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDataChecked;
  }

  checkAll(value: boolean): void {
    this.data.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }

  tableCheckBoxReset() {
    this.isIndeterminate = false;
    this.isAllDataChecked = false;
    this.mapOfCheckedId = {};
  }

  // 导出
  onExport() {
    const exportData = [];
    for (const key in this.mapOfCheckedId) {
      if (key && this.mapOfCheckedId[key]) {
        exportData.push(_.cloneDeep(this.data[_.findIndex(this.data, ['id', key])]));
      }
    }

    this.ipcRendererService.send(IpcType.exportStart, exportData);
  }
}
