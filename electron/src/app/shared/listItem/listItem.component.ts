import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RestApiService, RestType } from '../rest-api.service';
import { ApiOption } from '../rest.service';
import { Tool } from '../tool';

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
    private restApiService: RestApiService
  ) {
  }

  ngOnInit() {
    this.filteredOptions = this.options;
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
          updateDate: Tool.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
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
}
