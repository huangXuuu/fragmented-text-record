import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public loaderStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private spinnerStatus: Array<boolean> = new Array<boolean>();

  private autoHideHandler: any;

  constructor() {
  }

  showSpinner() {
    if (this.spinnerStatus.length === 0) {
      setTimeout(() => {
        this.loaderStatus.next(true);
      });
    }
    this.spinnerStatus.push(true);

    if (this.autoHideHandler) {
      clearTimeout(this.autoHideHandler);
    }
    this.autoHideHandler = null;

  }

  hideSpinner() {
    if (this.spinnerStatus.length > 0) {
      this.spinnerStatus.shift();
    }
    if (this.spinnerStatus.length === 0) {
      if (this.autoHideHandler) {
        clearTimeout(this.autoHideHandler);
      }
      this.autoHideHandler = null;

      setTimeout(() => {
        this.loaderStatus.next(false);
      });
    }
  }

  clearSpinner() {
    if (this.spinnerStatus.length > 0) {
      this.spinnerStatus = [];
    }

    if (this.autoHideHandler) {
      clearTimeout(this.autoHideHandler);
    }
    this.autoHideHandler = null;

    setTimeout(() => {
      this.loaderStatus.next(false);
    });
  }
}
