import { Injectable } from '@angular/core';

class IndexInfo {
  alias: string;
  index: string;
}

@Injectable({
  providedIn: 'root'
})
export class Globals {

  private _currentIndexInfo = new IndexInfo();

  private _classList = [];

  private _dbPath = '';

  public get dbPath(): string {
    return this._dbPath;
  }

  public set dbPath(value: string) {
    this._dbPath = value;
  }

  public get currentAlias(): string {
    return this._currentIndexInfo.alias;
  }

  public get currentIndex(): string {
    return this._currentIndexInfo.index;
  }

  public set currentIndexInfo(info: IndexInfo) {
    this._currentIndexInfo = info;
  }

  public get currentIndexInfo() {
    return this._currentIndexInfo;
  }

  public get classList(): Array<any> {
    return this._classList;
  }

  public set classList(list: Array<any>) {
    this._classList = list;
  }

  clear() {
    this._currentIndexInfo = new IndexInfo();
  }
}
