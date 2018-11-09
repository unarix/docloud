import { Component, Inject, TemplateRef, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ViewChild } from '@angular/core'
import { DataTablesModule } from 'angular-datatables';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AlertModule } from 'ngx-bootstrap/alert';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {

  // **** Ventanas Modales ****
  modalRef: BsModalRef;
  modalRefAlert: BsModalRef;
  modalFolder_settings: BsModalRef;
  
  // **** Variables globales ****
  public documentTypes: DocumentType[];
  public Atributes: Atribute[];
  public AtributeTypes : AtributeType[];
  
  public data: Object;
  public temp_var: Object=false;
  public load_atrTypes: Object=false;
  public dtOptions: DataTables.Settings = {};

  public baseUrl : string;
  public http: HttpClient;
  public headers: Headers;
  public options: RequestOptions;
  public message: string;
  public title: string;
  public id_folder_selected: number;
  
  // Referencias a los elementos HTML
  @ViewChild('alertwin') ventanaModal: TemplateRef<any>;
  @ViewChild('atributeName') _atributeName: ElementRef;
  @ViewChild('atributeType') _atributeType: ElementRef;
  @ViewChild('regexType') _regexType: ElementRef;
  @ViewChild('myForm') formValues;

  table = $('#datatable').DataTable(); // creamos esta variable para la tabla de atributos.

  // Constructor del componente
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string, private modalService: BsModalService) {
    this.baseUrl = baseUrl;
    this.http = http;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
  }

  // Al inicio, equivale al onInit()
  ngOnInit(): void {
    
    // Estos dtOptions son las propiedades de la Datatable
    this.dtOptions = {
      "pagingType": "numbers",
      "search": {
        "smart": true
      },
      "lengthChange": false,
      "info": false,
      "searching": false,
      "pageLength": 5
    };

    // Al iniciar la pagina, cargo las carpteas...
    this.loadFolders();
  }

  // Carga las carpetas
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

  // Abre la ventana modal para crear una carpeta
  openModal(new_folder: TemplateRef<any>) {
    this.modalRef = this.modalService.show(new_folder);
    var inputFolder = document.getElementById('folderName');
    inputFolder.focus();
  }

  // Abre la ventana modal que muestra las propiedades de la carpeta
  openModalSettings(template: TemplateRef<any>, ns_documento_tipo) 
  {
    console.log("Cargando atributos del doc id:" + ns_documento_tipo)
    this.loadAtributes(ns_documento_tipo);
    this.loadAtributeTypes();
    this.modalFolder_settings = this.modalService.show(template);
  }
 
  // Abre una ventana modal que muestra el error personalizado
  openModalAlert(template: TemplateRef<any>,ttl: string, msg: string) {
    this.message = msg;
    this.title = (ttl=="") ? "Alerta" : ttl;
    this.modalRefAlert = this.modalService.show(template, { class: 'second' });
  }

  // Carga los atributos de la carpeta
  loadAtributes(ns_documento_tipo)
  {
    this.table.destroy() // Trato de destruir la Datatable
    this.id_folder_selected = ns_documento_tipo;

    //Aca se llama a la api para obtener los atributos de ese tipo de documento...
    this.http.get(this.baseUrl + 'api/Atributes/'+ns_documento_tipo).subscribe((res: Response) => {
      this.data=res;
      this.temp_var=true;
    });
  }

  // Carga los atributos de una carpeta
  loadAtributeTypes()
  {
    this.http.get<AtributeType[]>(this.baseUrl + 'api/AtributesType/').subscribe(result => {
      this.AtributeTypes = result;
      console.log(result);
      console.log(this.AtributeTypes);
      this.load_atrTypes=true;
    }, error => {
      this.openModalAlert(this.ventanaModal,"Error!",JSON.stringify(error)); 
      console.log(error);
    }
    ); 
  }

  // Crea un nuevo atributo
  newAtribute(nombre_atributo: string, tipo_atributo: number, regex: string)
  {
    var date = new Date();

    let atr: Atribute = {
      idns_atributo: 0,
      sd_atributo: nombre_atributo,
      ns_documento_tipo: this.id_folder_selected,
      ns_atributo_tipo : tipo_atributo,
      h_alta : date,
      sd_opciones : regex,
    };

    console.log(atr);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    let url = this.baseUrl +  'api/Atributes/InsertAtribute';

    this.http.post<Atribute>(url, atr, httpOptions).subscribe
    (
      res => {
        console.log(res); 
        this.loadAtributes(this.id_folder_selected);
        this.openModalAlert(this.ventanaModal,"Exito!","Se creo su nuevo atributo con exito!"); 
      }
      , 
      error => { 
        this.openModalAlert(this.ventanaModal,"Error!",JSON.stringify(error)); 
        console.error(error) 
      }
    );

    // Aca hay que borrar el contenido de los input, pero no consigo. 

    // this._atributeName.nativeElement.value = null;
    // this._atributeType.nativeElement.value = null;
    // this._regexType.nativeElement.value = null;
  }

  // Crea una nueva carpeta
  newFolder(foldername: string)
  {
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
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    let url = this.baseUrl +  'api/DocumentType/NewDocumentType';

    this.http.post<DocumentType>(url, doc, httpOptions).subscribe
    (
      res => {console.log(res); this.modalRef.hide(); this.loadFolders();}
      , 
      error => { 
        this.openModalAlert(this.ventanaModal,"Error!",JSON.stringify(error)); 
        this.loadFolders(); 
        console.error(error) 
      }
    );
    
  }

  // cada vez que aprieta una tecla me fijo si es un enter, si lo es llamo a crear carpeta
  onKeydown(event, name:string) {
    if (event.key === "Enter") {
      console.log(event);
      this.newFolder(name);
    }
  }

  // Elimina un carpeta
  deleteFolder(id:number)
  {
    var resp = confirm("Esta seguro de borrar esta carpeta?");

    if(resp)
    {
      var date = new Date();

      let doc: DocumentType = {
        idns_documento_tipo: id,
        sd_descripcion: "",
        h_alta: date,
        n_responsable : 0,
        n_aeropuertos : 0,
        n_clientes : 0,
        n_destinatarios : 0
      };
      
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      let url = this.baseUrl +  'api/DocumentType/DeleteDocumentType/';
      console.log(url);

      this.http.post<DocumentType>(url, doc, httpOptions).subscribe
      (
        res => {console.log(res); this.loadFolders();}
        , 
        error => { 
          this.openModalAlert(this.ventanaModal,"Error!",JSON.stringify(error)); 
          this.loadFolders(); 
          console.error(error) 
        }
      );
    }
  }

  // Elimina un atributo
  deleteAtribute(_idns_atributo:number)
  {
    alert(_idns_atributo);

    var date = new Date();

    let atr: Atribute = {
      idns_atributo: _idns_atributo,
      sd_atributo: "",
      ns_documento_tipo: this.id_folder_selected,
      ns_atributo_tipo : 0,
      h_alta : date,
      sd_opciones : "",
    };

    console.log(atr);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    let url = this.baseUrl +  'api/Atributes/DeleteAtribute';

    this.http.post<Atribute>(url, atr, httpOptions).subscribe
    (
      res => {
        console.log(res); 
        this.loadAtributes(this.id_folder_selected);
        this.openModalAlert(this.ventanaModal,"Exito!","Se elimino el atributo con exito!"); 
      }
      , 
      error => { 
        this.openModalAlert(this.ventanaModal,"Error!",JSON.stringify(error)); 
        console.error(error) 
      }
    );
  }


}

/* ******************************* MODELOS ******************************* */

interface DocumentType {
  idns_documento_tipo: number;
  sd_descripcion: string;
  h_alta: Date;
  n_responsable : number;
  n_aeropuertos : number;
  n_clientes : number;
  n_destinatarios : number;
}

class Atribute {
  idns_atributo: number;
  sd_atributo: string;
  ns_documento_tipo: number;
  ns_atributo_tipo : number;
  h_alta : Date;
  sd_opciones : string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

class AtributeType {
  idns_atributo_tipo: number;
  sd_tipo: string;
}