import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EscapeHtmlPipe } from './keep-html.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    EscapeHtmlPipe
  ],
  exports: [
    EscapeHtmlPipe
  ]
})
export class EscapeHtmlModule { }
