import { Component, OnInit, NgZone } from '@angular/core';
import { e } from '../shared/event';
import { Globals } from '../shared/global';
import { IpcRendererService, IpcType } from '../shared/ipc-renderer.service';

const PageType = {
  manage: 'manage',         // 管理
  record: 'record'          // 记录
};

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  _pageType = PageType;

  isEditAreaOpen = true;

  pageType = PageType.manage;

  constructor(public globals: Globals,
    private ngZone: NgZone,
    private ipcRendererService: IpcRendererService) {
  }

  ngOnInit() {
    this.getManageInfo();
  }

  clearRecode() {
    this.isEditAreaOpen = true;
    e.clearRecode.emit();
  }

  toManage() {
    this.pageType = PageType.manage;
  }

  toRecord() {
    this.pageType = PageType.record;
    if (this.globals.currentIndexInfo.alias === 'undefined') {
      this.globals.currentIndexInfo.alias = '';
      this.globals.currentIndexInfo.index = '';
    }

    this.ipcRendererService.send(IpcType.setManage, {
      indexInfo: this.globals.currentIndexInfo,
      classList: this.globals.classList.map(x => x.name),
      dbPath: this.globals.dbPath
    });
  }

  getManageInfo() {
    this.ipcRendererService.on(IpcType.getManageInfoSuccess, (event, arg) => {
      this.ngZone.run(() => {
        if (arg) {
          this.globals.currentIndexInfo = arg.indexInfo;
          this.globals.classList = arg.classList.map(x => {
            return {
              name: x
            };
          });
          this.globals.dbPath = arg.dbPath;
        }
      });
    });

    this.ipcRendererService.on(IpcType.elasticSearchSetSuccess, (event, arg) => {
      this.ngZone.run(() => {
        if (arg) {
          this.globals.dbPath = arg.dbPath;
        }
      });
    });

    this.ipcRendererService.send(IpcType.getManageInfo);
  }

}
