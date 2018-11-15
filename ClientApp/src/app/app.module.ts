import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { FileDropModule } from 'ngx-file-drop';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { InboxComponent } from './inbox/inbox.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { DataTablesModule } from 'angular-datatables';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MydocsComponent } from './mydocs/mydocs.component';
import { MydocsdetailComponent } from './mydocsdetail/mydocsdetail.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    InboxComponent,
    UserSettingsComponent,
    MydocsComponent,
    MydocsdetailComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    FileDropModule,
    PdfViewerModule,
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    DataTablesModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'mydocs', component: MydocsComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'inbox', component: InboxComponent },
      { path: 'user-settings', component: UserSettingsComponent },
      { path: 'mydocsdetail', component: MydocsdetailComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
