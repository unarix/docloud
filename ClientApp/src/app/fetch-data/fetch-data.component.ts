import { Component, Inject, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public documentTypes: DocumentType[];
  modalRef: BsModalRef;
  baseUrl : string;
  http: HttpClient;
  headers: Headers;
  options: RequestOptions;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string, private modalService: BsModalService) {
    this.baseUrl = baseUrl;
    this.http = http;
    let headers = new Headers({ 'Content-Type': 'application/json' });
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
 
  newFolder(foldername: string)
  {
    alert(foldername);
    
    let url = this.baseUrl +  'api/DocumentType/PostNewDocumentType';
    this.http.post(url, {sd_descripcion:foldername}).subscribe
    (
      res => {console.log(res); this.modalRef.hide();}
      , 
      error => { this.modalRef.hide(); this.loadFolders(); console.error(error) }
    );
    
  }

}

interface DocumentType {
  idns_documento_tipo: string;
  sd_descripcion: string;
  h_alta: string;
  n_responsable : string;
  n_aeropuertos : string;
  n_clientes : string;
  n_destinatarios : string;
}