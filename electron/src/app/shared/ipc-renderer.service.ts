// @ts-nocheck
import { Injectable } from '@angular/core';

export const IpcType = {
  exportStart: 'export',
  exportSuccess: 'export-file-reply',
  importStart: 'importStart',
  getClassList: 'get-class-list',
  getClassListSuccess: 'get-class-list-reply'
};

@Injectable({
  providedIn: 'root'
})
export class IpcRendererService {

  constructor() {
  }

  on(message: string, done) {
    // return window.ipcRenderer.on(message, done);
  }

  send(message: string, ...args) {
    // window.ipcRenderer.send(message, args);
  }
}
