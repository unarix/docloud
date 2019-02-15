import {Component, OnInit, Inject, TemplateRef, ElementRef } from "@angular/core";
import {HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpResponse} from "@angular/common/http";
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, RequestOptions } from "@angular/http";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-families',
  templateUrl: './families.component.html',
  styles: []
})
export class FamiliesComponent implements OnInit {
  // **** Ventanas Modales ****
  modalRef: BsModalRef;
  modalRefAlert: BsModalRef;
  modalFamily: BsModalRef;
  modalAsoc: BsModalRef;

  public baseUrl: string;
  public http: HttpClient;
  public headers: Headers;
  public options: RequestOptions;
  public familias: Family[];
  public familia: Family;
  
  public message: string;
  public title: string;
  public nuevo:boolean = true; 
  public dtOptions: DataTables.Settings = {};
  table = $('#datatable').DataTable(); // creamos esta variable para la tabla de atributos.
  public data: Object;
  public temp_var: Object=false;

  public TiposDocList: DocumentType[];
  public selectedTiposDoc: DocumentType[];
  public dropdownSettingsTiposDoc = {};
  
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
    this.loadFamilies();
     
    //cargo los tipos de documentos en el dropdownlist
     this.loadTipoDocumentos()

      //configuraciones de dropdownlist de tipos de documentos
      this.dropdownSettingsTiposDoc = {
        singleSelection: false,
        idField: 'idns_documento_tipo',
        textField: 'sd_descripcion',
        selectAllText: 'Seleccionar todos',
        unSelectAllText: 'Deseleccionar todos',
        itemsShowLimit: 10,
        allowSearchFilter: true,
        searchPlaceholderText: 'Buscar',
        noDataAvailablePlaceholderText:'No hay datos'
      };
    
  }

  loadFamilies() {
    this.table.clear(); // Trato de destruir la Datatable
    //Aca se llama a la api para obtener todos los usuarios...
    this.http
      .get<Family[]>(this.baseUrl + "api/Family/GetAllFamilies")
      .subscribe(result => {
        this.familias = result;
        this.temp_var=true;
        console.log(this.familias);
      });
  }

  loadTipoDocumentos() {
    //Aca se llama a la api para obtener todos los tipos de documento...
    this.http
      .get<DocumentType[]>(this.baseUrl + "api/DocumentType/GetDocumentTypes")
      .subscribe(result => {
        this.TiposDocList = result;
        this.temp_var=true;
        console.log(this.TiposDocList);
      });
  }

  // Abre una ventana modal que muestra el error personalizado
  openModalAlert(template: TemplateRef<any>, ttl: string, msg: string) {
    this.message = msg;
    this.title = ttl == "" ? "Alerta" : ttl;
    this.modalRefAlert = this.modalService.show(template, { class: "second" });
  }

  // Elimina un usuario
  deleteFamily(_idns_family: number) {
    
    if (confirm("Está seguro que quiere eliminar al perfil: " + _idns_family + "?")) {
      //Aca se llama a la api para obtener todos los usuarios...
      this.http
        .get<boolean>(
          this.baseUrl + "api/Family/DeleteFamily?id=" + _idns_family
        )
        .subscribe(result => {
          console.log(result);
          this.loadFamilies(); 
          alert("Se ha eliminado correctamente al perfil: " + _idns_family);
        });

       
    } else {
      // Do nothing!
    }
  }

  asocFamily(template: TemplateRef<any>, familia: Family) {
 
    this.familia = familia;
    console.log(this.familia.familia_id);
      //Aca se llama a la api para obtener todos los tipos de documento...
      this.http
        .get<Family>(this.baseUrl + "api/Family/GetAsocTipoDocs?idFamilia="+ this.familia.familia_id)
        .subscribe(result => {
          this.selectedTiposDoc = result.doc_types;
          this.temp_var=true;
          
          console.log(result);
        });
    
  
    console.log(this.familia);
    this.modalAsoc = this.modalService.show(template);
  }

  saveAsoc(forma2: NgForm, template: TemplateRef<any>) {
    console.log("Formulario posteado");    
    console.log("asoc1", this.selectedTiposDoc);  
    this.familia.doc_types =  this.selectedTiposDoc;
   
    console.log("asociaciones Objeto", this.familia);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

      this.http.post<Family>(this.baseUrl + "api/Family/AsocTipoDocs", this.familia, httpOptions).subscribe
      (
        res => {
          console.log(res);          
          alert("Asociación correcta");
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

  // Abre la ventana modal que muestra las propiedades de la carpeta
  editFamily(template: TemplateRef<any>, familia: Family) {
    //marca de edicion de usuario
    this.nuevo = false;
   
    this.familia = familia;
    console.log(this.familia);
    this.modalFamily = this.modalService.show(template);
  }

  // Abre la ventana modal que muestra las propiedades de la carpeta
  newFamily(template: TemplateRef<any>) {
    this.nuevo = true;
    this.familia = null;
    this.familia = new Family();
    this.modalFamily = this.modalService.show(template);
  }

  saveFamily(forma: NgForm) {

    console.log("Formulario posteado");
    console.log("ngForm" , forma);
    console.log("valor forma", forma.value);

    console.log("Familia", this.familia);
    this.familia = forma.value;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let url;
    console.log(this.nuevo)
    if (this.nuevo){
      url = this.baseUrl +  'api/Family/InsertFamily';
    }else{
     url = this.baseUrl +  'api/Family/UpdateFamily';
    }
    console.log(this.familia);

    this.http.post<Family>(url, this.familia, httpOptions).subscribe
    (
      res => {
        console.log(res);
        this.loadFamilies(); 
        alert("Familia creada/modificada con éxito")
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

 export class Family {
  descripcion:string;
  familia_id:number;
  doc_types : DocumentType[];
}
