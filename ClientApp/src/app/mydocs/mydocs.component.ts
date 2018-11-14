import { Component, OnInit, Inject, TemplateRef, ElementRef } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import { Http, Headers, RequestOptions } from '@angular/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ViewChild } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { Router, NavigationExtras} from "@angular/router";

@Component({
  selector: 'app-mydocs',
  templateUrl: './mydocs.component.html',
  styleUrls: ['./mydocs.component.css']
})
export class MydocsComponent implements OnInit {

  modalRefAlert: BsModalRef;

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

  // Referencias a los elementos HTML
  @ViewChild('alertwin') ventanaModal: TemplateRef<any>;

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

  public dropped(event: UploadEvent, idns_documento_tipo: string) 
  {  
    this.files = event.files;
    var respuesta;

    for (const droppedFile of event.files) {
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
              respuesta = event.body.toString();
            }
      
          });
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        alert("" + droppedFile.relativePath + fileEntry);
      }
    }
    
    setTimeout( () => { this.openModalAlert(this.ventanaModal, "Respuesta: ", respuesta); }, 1000 );
    
  }

  public fileOver(event){
    //console.log(event);
  }
 
  public fileLeave(event){
    //console.log(event);
  }

}
