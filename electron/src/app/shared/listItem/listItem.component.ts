import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { RestApiService, RestType } from '../rest-api.service';
import { ApiOption } from '../rest.service';
import { Tool } from '../tool';
import { IpcRendererService, IpcType } from '../ipc-renderer.service';

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

  options = ['培训', '日常会议', '客户'];

  filteredOptions = [];

  constructor(
    private ipcRendererService: IpcRendererService,
    private ngZone: NgZone,
    private restApiService: RestApiService
  ) {
  }

  ngOnInit() {
    this.filteredOptions = this.options;
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

  onSave() {
    const endpointParams = new Map<string, string>();
    endpointParams.set('id', this.data.id);

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
      if (val) {}
    });
  }

  onDelete() {
    const endpointParams = new Map<string, string>();
    endpointParams.set('id', this.data.id);

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
    this.filteredOptions = this.options.filter(option => option.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  classClear() {
    this.data.class = '';
    this.onClassModelChange('');
  }
}
