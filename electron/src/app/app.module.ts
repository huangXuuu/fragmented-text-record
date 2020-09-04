import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NzConfig, NZ_CONFIG, NZ_ICONS } from 'ng-zorro-antd';


import { AppRoutingModule } from './app-routing.module';
import { EscapeHtmlModule } from './shared/keep-html/keep-html.module';
import { AppComponent } from './app.component';
import { SearchListComponent } from './searchList/searchList.component';
import { EditAreaComponent } from './editArea/editArea.component';
import { MainComponent } from './main/main.component';
import { ManageComponent } from './manage/manage.component';
import { ListItemComponent } from './shared/listItem/listItem.component';
import { ICONS_AUTO } from '../style-icons-auto';
import { Globals } from './shared/global';


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
    EditAreaComponent,
    ManageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    EscapeHtmlModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    Globals,
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    { provide: NZ_ICONS, useValue: ICONS_AUTO }
  ]
})
export class AppModule { }
