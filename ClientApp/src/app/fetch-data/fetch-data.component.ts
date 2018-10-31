import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public documentTypes: DocumentType[];

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<DocumentType[]>(baseUrl + 'api/DocumentType/GetDocumentTypes').subscribe(result => {
      this.documentTypes = result;
    }, error => alert(error)); //console.error(error));
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