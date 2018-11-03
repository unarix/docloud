import { Component, Inject, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ViewChild } from '@angular/core'
import { withLatestFrom } from 'rxjs/operator/withLatestFrom';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public documentTypes: DocumentType[];
  
  modalRef: BsModalRef;
  modalRefAlert: BsModalRef;

  baseUrl : string;
  http: HttpClient;
  headers: Headers;
  options: RequestOptions;
  message: string;
  title: string;

  @ViewChild('alertwin') ventanaModal: TemplateRef<any>;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string, private modalService: BsModalService) {
    this.baseUrl = baseUrl;
    this.http = http;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });

    // http.get<DocumentType[]>(baseUrl + 'api/DocumentType/GetDocumentTypes').subscribe(result => {
    //   this.documentTypes = result;
    // }, error => alert(error)); //console.error(error));

    this.loadFolders();
  }

  loadFolders()
  {
    this.http.get<DocumentType[]>(this.baseUrl + 'api/DocumentType/GetDocumentTypes').subscribe(result => {
      this.documentTypes = result;
    }, error => alert(error)); //console.error(error));
  }


  openModal(new_folder: TemplateRef<any>) {
    this.modalRef = this.modalService.show(new_folder);
  }
 
  openModalAlert(template: TemplateRef<any>,ttl: string, msg: string) {
    this.message = msg;
    this.title = (ttl=="") ? "Alerta" : ttl;
    this.modalRefAlert = this.modalService.show(template, { class: 'second' });
  }

  newFolder(foldername: string)
  {
    console.log(foldername)

    var date = new Date();

    let doc: DocumentType = {
      idns_documento_tipo: 0,
      sd_descripcion: foldername,
      h_alta: date,
      n_responsable : 0,
      n_aeropuertos : 0,
      n_clientes : 0,
      n_destinatarios : 0
    };
    
    console.log(doc);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    let url = this.baseUrl +  'api/DocumentType/PostNewDocumentType';
    console.log(url);
    this.http.post<DocumentType>(url, doc, httpOptions).subscribe
    (
      res => {console.log(res); this.modalRef.hide(); this.loadFolders();}
      , 
      error => { 
        this.openModalAlert(this.ventanaModal,"Error!",error); 
        this.loadFolders(); 
        console.error(error) 
      }
    );
    
  }



}

interface DocumentType {
  idns_documento_tipo: number;
  sd_descripcion: string;
  h_alta: Date;
  n_responsable : number;
  n_aeropuertos : number;
  n_clientes : number;
  n_destinatarios : number;
}