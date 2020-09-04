import { Component, OnInit, NgZone } from '@angular/core';
import { RestApiService, RestType } from '../shared/rest-api.service';
import { ApiOption } from '../shared/rest.service';
import { e } from '../shared/event';
import { Tool } from '../shared/tool';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Globals } from '../shared/global';

// 编辑模式
const EditMole = {
  create: 'create',
  edit: 'edit'
};

@Component({
  selector: 'app-edit-area',
  templateUrl: './editArea.component.html',
  styleUrls: ['./editArea.component.css']
})
export class EditAreaComponent implements OnInit {

  inputForm = {
    id: '',
    class: '',        // 分类
    title: '',        // 标题
    content: ''       // 内容
  };

  filteredOptions = [];

  editMole = EditMole;

  mole = EditMole.create;

  constructor(
    private message: NzMessageService,
    private restApiService: RestApiService,
    private globals: Globals
  ) {
  }

  ngOnInit() {
    this.filteredOptions = this.globals.classList;
    this.registeClearRecordListener();
  }

  onSave() {
    const apiOpt = this.getApiOption();
    this.restApiService.doRequest(RestType.POST, apiOpt).subscribe(val => {
      if (val) {
        this.mole = EditMole.edit;
        this.inputForm.id = val._id;
        this.message.info('保存成功');
      }
    });
  }

  getApiOption() {
    let opt = <ApiOption>{};
    if (this.mole === EditMole.create) {
      const urlEndpointParams = new Map();
      urlEndpointParams.set('index', this.globals.currentIndex);

      opt = <ApiOption>{
        apiKey: 'insert',
        urlEndpointParams: urlEndpointParams,
        body: {
          title: this.inputForm.title,
          class: this.inputForm.class,
          content: this.inputForm.content,
          createDate: Tool.formatDate(new Date()),
          updateDate: Tool.formatDate(new Date())
        }
      };
    } else {
      const endpointParams = new Map<string, string>();
      endpointParams.set('id', this.inputForm.id);
      endpointParams.set('index', this.globals.currentIndex);

      opt = <ApiOption>{
        apiKey: 'edit',
        urlEndpointParams: endpointParams,
        body: {
          doc: {
            title: this.inputForm.title,
            class: this.inputForm.class,
            content: this.inputForm.content,
            updateDate: Tool.formatDate(new Date())
          }
        }
      };
    }

    return opt;
  }

  onClassModelChange(value: string): void {
    this.filteredOptions = this.globals.classList.filter(option => {
      if (option) {
        return option.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      }
    });
  }

  classClear() {
    this.inputForm.class = '';
    this.onClassModelChange('');
  }

  registeClearRecordListener() {
    e.clearRecode.subscribe(val => {
      this.initInputForm();
      this.mole = EditMole.create;
    });
  }

  initInputForm() {
    this.inputForm = {
      id: '',
      class: '',        // 分类
      title: '',        // 标题
      content: ''       // 内容
    };
  }
}
