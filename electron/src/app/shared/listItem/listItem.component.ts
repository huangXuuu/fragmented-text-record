import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { RestApiService, RestType } from '../rest-api.service';
import { ApiOption } from '../rest.service';
import { Tool } from '../tool';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Globals } from '../global';

const EditType = {
  preview: 'preview',    // 浏览
  edit: 'edit'           // 修改
};

@Component({
  selector: 'app-list-item',
  templateUrl: './listItem.component.html',
  styleUrls: ['./listItem.component.css']
})
export class ListItemComponent implements OnInit {

  @Input()
  data: any;

  @Input() index = 0;

  @Output() itemChage = new EventEmitter<any>();

  editType = EditType.preview;

  filteredOptions = [];

  constructor(
    private restApiService: RestApiService,
    private message: NzMessageService,
    private globals: Globals
  ) {
  }

  ngOnInit() {
    this.filteredOptions = this.globals.classList;
  }

  onSave() {
    const endpointParams = new Map<string, string>();
    endpointParams.set('id', this.data.id);
    endpointParams.set('index', this.globals.currentIndex);

    const apiOpt = <ApiOption>{
      apiKey: 'edit',
      urlEndpointParams: endpointParams,
      body: {
        doc: {
          title: this.data.title,
          class: this.data.class,
          content: this.data.content,
          updateDate: Tool.formatDate(new Date())
        }
      }
    };
    this.restApiService.doRequest(RestType.POST, apiOpt).subscribe(val => {
      if (val) {
        this.message.info('保存成功！');
      }
    });
  }

  onDelete() {
    const endpointParams = new Map<string, string>();
    endpointParams.set('id', this.data.id);
    endpointParams.set('index', this.globals.currentIndex);

    const apiOpt = <ApiOption>{
      apiKey: 'delete',
      urlEndpointParams: endpointParams,
    };
    this.restApiService.doRequest(RestType.DELETE, apiOpt).subscribe(val => {
      if (val) {
        this.itemChage.emit({
          type: 'delete',
          index: this.index
        });
        this.message.info('删除成功！');
      }
    });
  }

  toEdit() {
    this.editType = EditType.edit;
  }

  toPreview() {
    this.editType = EditType.preview;
  }

  onClassModelChange(value: string): void {
    this.filteredOptions = this.globals.classList.filter(option => {
      if (option) {
        return option.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      }
    });
  }

  classClear() {
    this.data.class = '';
    this.onClassModelChange('');
  }
}
