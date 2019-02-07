import {Component, OnInit, Inject, TemplateRef, ElementRef } from "@angular/core";
import {HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpResponse} from "@angular/common/http";
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, RequestOptions } from "@angular/http";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styles: []
})
export class AccessComponent implements OnInit {
  modalRef: BsModalRef;
  modalRefAlert: BsModalRef;
  modalDoctype: BsModalRef;

  public baseUrl: string;
  public http: HttpClient;
  public headers: Headers;
  public options: RequestOptions;
  public tipodocs: DocumentType[];
  public tipodoc: DocumentType;
  
  public message: string;
  public title: string;
  public dtOptions: DataTables.Settings = {};
  table = $('#datatable').DataTable(); // creamos esta variable para la tabla de atributos.
  public data: Object;
  public temp_var: Object=false;
  
  constructor(
    private route: ActivatedRoute, private router : Router ,http: HttpClient, @Inject("BASE_URL") baseUrl: string, private modalService: BsModalService) {
    this.baseUrl = baseUrl;
    this.http = http;
    let headers = new Headers({
      "Content-Type": "application/x-www-form-urlencoded"
    });
    let options = new RequestOptions({ headers: headers });
  }

  ngOnInit() {
    this.dtOptions = {
      "responsive":true,
     "pagingType": "numbers",
     "search": {
       "smart": true
     },
     "lengthChange": false,
     "info": false,
     "searching": true,
     "pageLength": 5,
     "language": {
       "search": "Buscar:",
       "zeroRecords": "No se encontraron resultados"
     },
   };
    this.loadTipoDocumentos();
    
  }

  loadTipoDocumentos() {
    this.table.destroy() // Trato de destruir la Datatable
    //Aca se llama a la api para obtener todos los usuarios...
    this.http
      .get<DocumentType[]>(this.baseUrl + "api/DocumentType/GetDocumentTypes")
      .subscribe(result => {
        this.tipodocs = result;
        this.temp_var=true;
        console.log(this.tipodocs);
      });
  }

  // Abre una ventana modal que muestra el error personalizado
  openModalAlert(template: TemplateRef<any>, ttl: string, msg: string) {
    this.message = msg;
    this.title = ttl == "" ? "Alerta" : ttl;
    this.modalRefAlert = this.modalService.show(template, { class: "second" });
  }

  // Elimina un usuario
  deleteDocumentType(tipoDocumento: DocumentType) {

    if (confirm("Está seguro que quiere eliminar al tipo de documento: " + tipoDocumento.sd_descripcion + "?")) {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
  
        this.http.post<DocumentType>(this.baseUrl + "api/DocumentType/DeleteDocumentType", tipoDocumento, httpOptions).subscribe
        (
          res => {
            console.log(res);
            this.loadTipoDocumentos(); 
            alert("Se ha eliminado correctamente al tipo de documento: " + tipoDocumento.sd_descripcion);
            //this.openModalAlert(this.ventanaModal,"Exito!","Se creo su nuevo atributo con exito!"); 
          }
          , 
          error => { 
            //this.openModalAlert(this.ventanaModal,"Error!",JSON.stringify(error)); 
            console.error(error)
            alert("Error: "+ error)  
          }
        );
       
    } else {
      // Do nothing!
    }
  }


  // Abre la ventana modal que muestra las propiedades de la carpeta
  newTipoDoc(template: TemplateRef<any>) {

    this.tipodoc = null;
    this.tipodoc = new DocumentType();
    this.modalDoctype = this.modalService.show(template);
  }

  saveTipoDoc(forma: NgForm) {

    console.log("Formulario posteado");
    console.log("ngForm" , forma);
    console.log("valor forma", forma.value);

    console.log("Tipo doc", this.tipodoc);
    this.tipodoc = forma.value;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let url;
    url = this.baseUrl +  'api/DocumentType/NewDocumentType';
    console.log(this.tipodoc);

    this.http.post<DocumentType>(url, this.tipodoc, httpOptions).subscribe
    (
      res => {
        console.log(res);
        this.loadTipoDocumentos(); 
        alert("Tipo documento creado con éxito")
        //this.openModalAlert(this.ventanaModal,"Exito!","Se creo su nuevo atributo con exito!"); 
      }
      , 
      error => { 
        //this.openModalAlert(this.ventanaModal,"Error!",JSON.stringify(error)); 
        console.error(error)
        alert("Error: "+ error)  
      }
    );
    this.modalService.hide(1);
   

  }

  
}

 class DocumentType {
  sd_descripcion:string;
  idns_documento_tipo:number;
  // familias : family[];
}
