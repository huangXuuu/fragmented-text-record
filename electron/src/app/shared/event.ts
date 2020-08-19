import { EventEmitter } from '@angular/core';

export class CommonEvent {
  clearRecode: EventEmitter<any> = new EventEmitter();
}

export const e = new CommonEvent();
