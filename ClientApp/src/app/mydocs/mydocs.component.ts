import { Component, OnInit, Inject, TemplateRef, ElementRef } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import { Http, Headers, RequestOptions } from '@angular/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ViewChild } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { Router, NavigationExtras} from "@angular/router";
import { VariableAst } from '@angular/compiler';

@Component({
  selector: 'app-mydocs',
  templateUrl: './mydocs.component.html',
  styleUrls: ['./mydocs.component.css']
})
export class MydocsComponent implements OnInit {

  modalRefAlert: BsModalRef;
  modalRefAtribute: BsModalRef;

  // **** Variables globales ****
  public documentTypes: DocumentType[];
  public baseUrl : string;
  public http: HttpClient;
  public headers: Headers;
  public options: RequestOptions;
  public message: string = "Mensaje";
  public title: string = "Titulo";
  public progress: number =0;  
  public files: UploadFile[] = [];
  public htmlToAdd: string;
  public Atributes: Atribute[];

  // Referencias a los elementos HTML
  @ViewChild('alertwin') ventanaModal: TemplateRef<any>;
  @ViewChild('ventanaAtributes') ventanaAtributes: TemplateRef<any>;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string, private modalService: BsModalService, private router: Router) {
    this.baseUrl = baseUrl;
    this.http = http;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
  }

  ngOnInit() {
    this.loadFolders();
  }

  loadFolders()
  {
    this.http.get<DocumentType[]>(this.baseUrl + 'api/DocumentType/GetDocumentTypes').subscribe(result => {
      this.documentTypes = result;
    }, error => {
        this.openModalAlert(this.ventanaModal,"Error!", JSON.stringify(error)); 
        console.log(error);
      }
    ); 
  }

  openFolder(idns_documento:number, sd_descripcion: string)
  {
    //this.openModalAlert(this.ventanaModal,"Ok funciono", idns_documento.toString());

    let navigationExtras: NavigationExtras = {
      queryParams: {
          "idns_documento": idns_documento,
          "sd_descripcion": sd_descripcion
      }
    };

    this.router.navigate(["mydocsdetail"], navigationExtras);
  }

  openModalAlert(template: TemplateRef<any>,ttl: string, msg: string) {
    this.message = msg;
    this.title = (ttl=="") ? "Alerta" : ttl;
    this.modalRefAlert = this.modalService.show(template, { class: 'second' });
  }

  openModalAtributes(template: TemplateRef<any>,idns_documento: string, idns_documento_tipo: string) 
  {
    // Debo contruir el html para completar los atributos

    console.log("obteniendo atributos");

    this.http.get<Atribute[]>(this.baseUrl + 'api/Atributes/' + idns_documento_tipo).subscribe(result => {
      this.Atributes = result;
      console.log(result);
      console.log(this.Atributes);
    }, error => {
      this.openModalAlert(this.ventanaModal,"Error!",JSON.stringify(error)); 
      console.log(error);
    }, () => {
      
      this.htmlToAdd = '<div style="margin-top:1em" class="input-group">';

      this.Atributes.forEach(element => {
        //this.htmlToAdd = this.htmlToAdd + '<span class="input-group-addon">' + element.sd_atributo + '</span>';
        this.htmlToAdd = this.htmlToAdd + '<input id="'+ element.idns_atributo + '_atr" type="text" required="required" class="form-control">';
        //element.idns_atributo
      });
      
      this.htmlToAdd = this.htmlToAdd + '</div>';
      
      console.log(this.htmlToAdd);

      this.modalRefAtribute = this.modalService.show(template, { class: 'second' });

    }
    );     
  }


  loadAtributes(idns_documento_tipo :string)
  {
    let AtributesX: Atribute[];

    console.log("obteniendo atributos");
    this.http.get<Atribute[]>(this.baseUrl + 'api/Atributes/' + idns_documento_tipo).subscribe(result => {
      AtributesX = result;
      console.log(result);
      console.log(AtributesX);
    }, error => {
      this.openModalAlert(this.ventanaModal,"Error!",JSON.stringify(error)); 
      console.log(error);
    }, () => {
      constructHTML() 
    }
    ); 
  }

  public dropped(event: UploadEvent, idns_documento_tipo: string) 
  {  
    this.files = event.files;
    var idns_documento_resp;

    for (const droppedFile of event.files) 
    {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
 
          const formData = new FormData()
          formData.append('doc_', file, droppedFile.relativePath)
          formData.append('inds_', idns_documento_tipo)

          const uploadReq = new HttpRequest('POST', 'api/UploadFile', formData, {
            reportProgress: true,
          });
      
          this.http.request(uploadReq).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress)
              this.progress = Math.round(100 * event.loaded / event.total);
            else if (event.type === HttpEventType.Response)
            {
              console.log(this.message);
              console.log(event.body.toString());
              idns_documento_resp = event.body.toString();
            }
      
          });
        });
      } 
      else 
      {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        alert("" + droppedFile.relativePath + fileEntry);
      }
    }
    
    //setTimeout( () => { this.openModalAlert(this.ventanaModal, "Respuesta: ", respuesta); }, 1000 );
    // Una vez que me respondieron ok, espera 1 segundo y abri la modal
    setTimeout( () => { this.openModalAtributes(this.ventanaAtributes, idns_documento_resp, idns_documento_tipo); }, 1000 );
  }

  public fileOver(event){
    //console.log(event);
  }
 
  public fileLeave(event){
    //console.log(event);
  }

}

class Atribute {
  idns_atributo: number;
  sd_atributo: string;
  ns_documento_tipo: number;
  ns_atributo_tipo : number;
  h_alta : Date;
  sd_opciones : string;
}