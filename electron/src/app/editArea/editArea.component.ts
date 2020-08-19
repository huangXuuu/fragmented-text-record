import { Component, OnInit } from '@angular/core';
import { RestApiService, RestType } from '../shared/rest-api.service';
import { ApiOption } from '../shared/rest.service';
import { e } from '../shared/event';
import { Tool } from '../shared/tool';

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
export class EditAreaComponent implements OnInit  {

  inputForm = {
    id: '',
    class: '',        // 分类
    title: '',        // 标题
    content: ''       // 内容
  };

  options = ['培训', '日常会议', '客户'];

  filteredOptions = [];

  editMole = EditMole;

  mole = EditMole.create;

  constructor(
    private restApiService: RestApiService
  ) {
  }

  ngOnInit() {
    this.filteredOptions = this.options;
    this.registeClearRecordListener();
  }

  onSave() {
    const apiOpt = this.getApiOption();
    this.restApiService.doRequest(RestType.POST, apiOpt).subscribe(val => {
      if (val) {
        this.mole = EditMole.edit;
        this.inputForm.id = val._id;
      }
    });
  }

  getApiOption() {
    let opt = <ApiOption>{};
    if (this.mole === EditMole.create) {
      opt = <ApiOption>{
        apiKey: 'insert',
        body: {
          title: this.inputForm.title,
          class: this.inputForm.class,
          content: this.inputForm.content,
          createDate: Tool.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          updateDate: Tool.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
        }
      };
    } else {
      const endpointParams = new Map<string, string>();
      endpointParams.set('id', this.inputForm.id);
      opt = <ApiOption>{
        apiKey: 'edit',
        urlEndpointParams: endpointParams,
        body: {
          doc: {
            title: this.inputForm.title,
            class: this.inputForm.class,
            content: this.inputForm.content,
            updateDate: Tool.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
          }
        }
      };
    }

    return opt;
  }

  onClassModelChange(value: string): void {
    this.filteredOptions = this.options.filter(option => option.toLowerCase().indexOf(value.toLowerCase()) !== -1);
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
