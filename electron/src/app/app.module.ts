import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NzConfig, NZ_CONFIG } from 'ng-zorro-antd';


import { AppRoutingModule } from './app-routing.module';
import { EscapeHtmlModule } from './shared/keep-html/keep-html.module';
import { AppComponent } from './app.component';
import { SearchListComponent } from './searchList/searchList.component';
import { EditAreaComponent } from './editArea/editArea.component';
import { MainComponent } from './main/main.component';
import { ListItemComponent } from './shared/listItem/listItem.component';


import zh from '@angular/common/locales/zh';
registerLocaleData(zh);

const ngZorroConfig: NzConfig = {
  modal: { nzMaskClosable: false } // ダイアログの幅
};

@NgModule({
  declarations: [
    AppComponent,
    SearchListComponent,
    ListItemComponent,
    MainComponent,
    EditAreaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    EscapeHtmlModule
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: NZ_CONFIG, useValue: ngZorroConfig }
  ]
})
export class AppModule { }