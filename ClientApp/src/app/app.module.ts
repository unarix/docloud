import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { FileDropModule } from 'ngx-file-drop';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DynamicFormModule } from 'ngx-dynamic-form';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { InboxComponent } from './inbox/inbox.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { DataTablesModule } from 'angular-datatables';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MydocsComponent } from './mydocs/mydocs.component';
import { MydocsAddComponent } from './mydocs-add/mydocs-add.component';
import { MydocsdetailComponent } from './mydocsdetail/mydocsdetail.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { UsersComponent } from './users/users.component';
import { FamiliesComponent } from './families/families.component';
import { AccessComponent } from './access/access.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    FetchDataComponent,
    InboxComponent,
    UserSettingsComponent,
    MydocsComponent,
    MydocsdetailComponent,
    MydocsAddComponent,
    UsersComponent,
    FamiliesComponent,
    AccessComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    FileDropModule,
    PdfViewerModule,
    ReactiveFormsModule,
    CommonModule,
    DynamicFormModule,
    NgMultiSelectDropDownModule.forRoot(),
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
  bootstrap: [AppComponent],
  // Recordar agregar aca todos los componentes que son modales:
  entryComponents: [MydocsAddComponent]
})
export class AppModule { }
