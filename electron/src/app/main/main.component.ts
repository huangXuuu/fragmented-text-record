import { Component } from '@angular/core';
import {e } from '../shared/event';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  isEditAreaOpen = true;

  clearRecode() {
    this.isEditAreaOpen = true;
    e.clearRecode.emit();
  }

}
