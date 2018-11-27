import { Component, OnInit, Inject, TemplateRef, ElementRef } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import { ActivatedRoute} from "@angular/router";
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { Http, Headers, RequestOptions } from '@angular/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DataTablesModule } from 'angular-datatables';
import { ViewChild } from '@angular/core'
import { Alert } from 'selenium-webdriver';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent {

  public progress: number =0;  
  modalRefAlert: BsModalRef;
  public files: UploadFile[] = [];
  public baseUrl : string;
  public http: HttpClient;
  public headers: Headers;
  public options: RequestOptions;
  public message: string;
  public title: string;

  public dtOptions: DataTables.Settings = {};
  public Files: Filex[];
  public data: Object;
  public temp_var: Object=false;

  @ViewChild('alertwin') ventanaModal: TemplateRef<any>;
  table = $('#datatable').DataTable(); // creamos esta variable para la tabla de atributos.

  // // mensaje que se despliega al iniciar el componente
   alerts: any[] = [{
  //   type: 'info',
  //   msg: 'Selecciona el archivo que quieres cargar y luego haz click en "subir"',
  //   timeout: 5000
   }];
 
  constructor(private route: ActivatedRoute, http: HttpClient, @Inject('BASE_URL') baseUrl: string, private modalService: BsModalService) {
    this.baseUrl = baseUrl;
    this.http = http;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
  }
  

  ngOnInit() {
    // Estos dtOptions son las propiedades de la Datatable
    this.dtOptions = {
      "pagingType": "numbers",
      "search": {
        "smart": true
      },
      "lengthChange": false,
      "info": false,
      "searching": false,
      "pageLength": 10
    };

    Observable.interval(5000).takeWhile(() => true).subscribe(() => this.loadFiles());

    this.loadFiles()
  }

  public loadFiles()
  {
    this.table.destroy() // Trato de destruir la Datatable

    //Aca se llama a la api para obtener los atributos de ese tipo de documento...
    this.http.get(this.baseUrl + 'api/InputFile').subscribe((res: Response) => {
      this.data=res;
      this.temp_var=true;
    });
  }

  openModalAlert(template: TemplateRef<any>,ttl: string, msg: string) {
    this.message = msg;
    this.title = (ttl=="") ? "Alerta" : ttl;
    this.modalRefAlert = this.modalService.show(template, { class: 'second' });
  }


  public dropped(event: UploadEvent) {
    
    this.files = event.files;
    for (const droppedFile of event.files) 
    {
      if (droppedFile.fileEntry.isFile && droppedFile.fileEntry.name.includes(".pdf")) 
      {

        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
 
          const formData = new FormData()
          formData.append('logo', file, droppedFile.relativePath)

          const uploadReq = new HttpRequest('POST', 'api/UploadFile/UploadInputFile', formData, {
            reportProgress: true,
          });
      
          this.http.request(uploadReq).subscribe
          (
            event => 
              {
                if (event.type === HttpEventType.UploadProgress) {
                  this.progress = Math.round(100 * event.loaded / event.total);
                }
                else if (event instanceof HttpResponse) {
                  
                }
              }
          );

        });
      } 
      else 
      {
        // It was a directory (empty directories are added, otherwise only files)
        //const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        //alert("" + droppedFile.relativePath + fileEntry + droppedFile.fileEntry.name);
        this.openModalAlert(this.ventanaModal,"No no... :) ", droppedFile.fileEntry.name + ", no es un tipo de archivo admitido. Asegurate de subir solo archivos .PDF!")
      }
    }

    setTimeout( () => { this.loadFiles() , 2000 });

  }

  public mostrarMensaje(mensajex)
  {
    
  }

  public fileOver(event){
    //console.log(event);
  }
 
  public fileLeave(event){
    //console.log(event);
  }

}

/* ******************************* MODELOS ******************************* */


class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}


class Filex
{
    name : string;
    LastWriteTime : Date;
    Length : number;
}
