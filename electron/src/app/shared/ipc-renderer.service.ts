// @ts-nocheck
import { Injectable } from '@angular/core';

export const IpcType = {
  exportStart: 'export',                                    // 导出
  exportSuccess: 'export-file-reply',                       // 导出响应
  importStart: 'importStart',                               // 导入
  getManageInfo: 'manage-get',                              // 配置信息取得
  getManageInfoSuccess: 'manage-get-reply',                 // 配置信息取得响应
  setManage: 'manage-save',                                 // 配置信息保存
  elasticSearchSet: 'elasticSearch-set',                    // DB文件选择器呼出
  elasticSearchSetSuccess: 'elasticSearch-set-reply',       // DB文件选择器呼出响应
  elasticSearchUp: 'elasticSearch-up',                      // DB起动
};

@Injectable({
  providedIn: 'root'
})
export class IpcRendererService {

  constructor() {
  }

  on(message: string, done) {
    return window.ipcRenderer.on(message, done);
  }

  send(message: string, ...args) {
    window.ipcRenderer.send(message, args);
  }
}
