import { Component, OnInit, Inject, TemplateRef, ElementRef } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import { ActivatedRoute} from "@angular/router";
import { Http, Headers, RequestOptions } from '@angular/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ViewChild } from '@angular/core'

@Component({
  selector: 'app-mydocsdetail',
  templateUrl: './mydocsdetail.component.html',
  styleUrls: ['./mydocsdetail.component.css']
})
export class MydocsdetailComponent implements OnInit {

  modalRefAlert: BsModalRef;
  viewFileModal: BsModalRef;

  public pdfSrc: string = '/Cloud/2018/11/13/';
  public documents: Document[];
  public idns_documento: number;
  public sd_descripcion: string;
  public message: string = "Mensaje";
  public title: string = "Titulo";

  public baseUrl : string;
  public http: HttpClient;
  public headers: Headers;
  public options: RequestOptions;

  @ViewChild('alertwin') ventanaModal: TemplateRef<any>;
  @ViewChild('viewFile') ventanaFileModal: TemplateRef<any>;

  constructor(private route: ActivatedRoute, http: HttpClient, @Inject('BASE_URL') baseUrl: string, private modalService: BsModalService) {
    this.baseUrl = baseUrl;
    this.http = http;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });

    this.route.queryParams.subscribe(params => {
      this.idns_documento = params["idns_documento"];
      this.sd_descripcion = params["sd_descripcion"];
    });
  }

  ngOnInit() {
    this.loadDocuments(this.idns_documento)
  }

  loadDocuments(idns_documento: number)
  {

    //Aca se llama a la api para obtener los atributos de ese tipo de documento...
    this.http.get<Document[]>(this.baseUrl + 'api/Document/'+idns_documento).subscribe(result => {
      this.documents = result;
      console.log(this.documents);
    });

    // this.http.get<Document[]>(this.baseUrl + 'api/DocumentType/GetDocumentTypes').subscribe(result => {
    //   this.document = result;
    // }, error => {
    //     this.openModalAlert(this.ventanaModal,"Error!", JSON.stringify(error)); 
    //     console.log(error);
    //   }
    // ); 
  }

  openModalAlert(template: TemplateRef<any>,ttl: string, msg: string) {
    this.message = msg;
    this.title = (ttl=="") ? "Alerta" : ttl;
    this.modalRefAlert = this.modalService.show(template, { class: 'second' });
  }

  openFile(template: TemplateRef<any>, idns_documento : string, fecha : string)
  {
    var dt = new Date(fecha);

    var day = dt.getDate();
    var month = dt.getMonth() + 1; //months from 1-12
    var year = dt.getFullYear();

    this.pdfSrc = '/Cloud/' + year + "/" + month + "/" + day + '/' + idns_documento + ".pdf";
    console.log(this.pdfSrc);
    this.viewFileModal = this.modalService.show(template, { class: 'second' });
  }

}

class Document {
  idns_documento : number;
  h_fecha : string;
  ns_documento_tipo : number;
  ns_flow : number;
  ns_usuario_carga : string;
  sd_metadata : string;
  ns_documento_fs : number;
  ns_documento_subtipo : number;
  sd_nulo : string;
  atriutos : AtributeValue[];
}

class AtributeValue {
  idns_atributo_valor: number;
  ns_atributo: number;
  sd_valor: string;
  ns_documento : number;
  h_fecha_alta : Date;
  h_valor : Date;
  ns_valor : number;
}
