import { Component, OnInit } from '@angular/core';
import { RestApiService, RestType } from '../shared/rest-api.service';
import { ApiOption } from '../shared/rest.service';

@Component({
  selector: 'app-search-list',
  templateUrl: './searchList.component.html',
  styleUrls: ['./searchList.component.less']
})
export class SearchListComponent implements OnInit {

  // 空结果表示flag
  searched = false;

  // 搜索内容
  searchForm = {
    class: '',              // 分类
    title: '',              // 标题
    date: undefined,        // 日期
    content: '',            // 内容
  };

  // 分类list
  options = ['培训', '日常会议', '客户'];

  // 分类list-自动完成表示项
  filteredOptions = [];

  // 搜索结果list
  data = [];

  loading = false;

  responseData = {};

  searchFormKeyList = ['class', 'title', 'content', 'updateDate', 'createDate'];

  constructor(
    private restApiService: RestApiService
  ) {
  }

  ngOnInit() {
    this.filteredOptions = this.options;
    this.initSearchForm();
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

  onListItemChange($event) {
    if ($event.type === 'delete') {
      this.data.splice($event.index, 1);
    }
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
        }
      }
    };

    this.setMatchTerms(query);
    this.setMatch(query);
    this.setKeyWord(query);
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

  classClear() {
    this.searchForm.class = '';
    this.onClassModelChange('');
  }

  initSearchForm() {
    this.searchForm = {
      class: '',              // 分类
      title: '',              // 标题
      date: undefined,        // 日期
      content: '',            // 内容
    };

  }
}
