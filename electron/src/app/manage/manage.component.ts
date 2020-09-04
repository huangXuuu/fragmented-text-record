import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RestApiService, RestType } from '../shared/rest-api.service';
import { ApiOption } from '../shared/rest.service';
import { Tool } from '../shared/tool';
import * as _ from 'lodash';
import { IpcRendererService, IpcType } from '../shared/ipc-renderer.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Globals } from '../shared/global';
// @ts-ignore
const mapping = require('../resources/analyzer_mapping.json');

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  indexList = [];

  createIndexName = '';

  constructor(
    private message: NzMessageService,
    private restApiService: RestApiService,
    public globals: Globals,
    private ipcRendererService: IpcRendererService
  ) {
  }

  ngOnInit() {
    this.getIndicesFromDB();
  }

  // 创建索引
  create() {
    if (!this.createIndexName) {
      this.message.error('请输入文集名');

      return;
    }

    const urlEndpointParams = new Map();
    urlEndpointParams.set('index', Tool.guid());

    const apiOpt = <ApiOption>{
      apiKey: 'createIndex',
      urlEndpointParams: urlEndpointParams,
      body: mapping
    };
    this.restApiService.doRequest(RestType.PUT, apiOpt).subscribe(val => {
      if (val) {
        this.setNameToIndex(val.index);
      }
    }, err => {
    });
  }

  // 给新建的索引加别名
  setNameToIndex(index: string) {
    const apiOpt = <ApiOption>{
      apiKey: 'addAliasToIndex',
      body: {
        actions: [{
          add: {
            index: index,
            alias: this.createIndexName
          }
        }]
      }
    };
    this.restApiService.doRequest(RestType.POST, apiOpt).subscribe(val => {
      if (val) {
        this.message.info('创建成功');
        this.getIndicesFromDB();
      }
    }, err => {
    });
  }

  // 获取全部索引
  getIndicesFromDB() {
    const apiOpt = <ApiOption>{
      apiKey: 'catIndex',
    };
    this.restApiService.doRequest(RestType.GET, apiOpt).subscribe(val => {
      if (val) {
        this.indexList = val.map(x => {
          return {
            index: x.index,
            alias: x.alias
          };
        });

        if (!this.globals.currentAlias && this.indexList[0]) {
          this.globals.currentIndexInfo = this.indexList[0];
        }
      }
    }, err => {
    });
  }

  // 删除指定索引
  onDelete(indexInfo) {
    const urlEndpointParams = new Map();
    urlEndpointParams.set('index', indexInfo.index);

    const apiOpt = <ApiOption>{
      apiKey: 'deleteIndex',
      urlEndpointParams: urlEndpointParams
    };
    this.restApiService.doRequest(RestType.DELETE, apiOpt).subscribe(val => {
      if (val) {
        this.message.info('删除成功');
        if (indexInfo.alias === this.globals.currentAlias) {
          this.globals.clear();
        }
        this.getIndicesFromDB();
      }
    }, err => {
    });
  }

  // DB文件指定
  setDBPath() {
    this.ipcRendererService.send(IpcType.elasticSearchSet);
  }

  // DB起动
  DBStartUp() {
    this.ipcRendererService.send(IpcType.elasticSearchUp);
  }

  selectedAliasChange(item) {
    this.globals.currentIndexInfo = item;
  }

  createClass() {
    this.globals.classList = [
      ...this.globals.classList,
      {
        name: ''
      }
    ];
  }

  deleteClass(index) {
    this.globals.classList = this.globals.classList.filter((v, i) => i !== index);
  }
}

