import {Component, OnInit, Inject, TemplateRef, ElementRef } from "@angular/core";
import {HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpResponse} from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Http, Headers, RequestOptions } from "@angular/http";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { NgForm } from "@angular/forms";
import { Family } from "../families/families.component";
import { DocumentType  } from "../access/access.component";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html"
})
export class UsersComponent implements OnInit {
  // **** Ventanas Modales ****
  modalRef: BsModalRef;
  modalRefAlert: BsModalRef;
  modalUser: BsModalRef;
  modalAsoc: BsModalRef;

  public baseUrl: string;
  public http: HttpClient;
  public headers: Headers;
  public options: RequestOptions;
  public usuarios: User[];
  public usuario: User;
  public message: string;
  public title: string;
  public nuevo:boolean = true; 
  public dtOptions: DataTables.Settings = {};
  table = $('#datatable').DataTable(); // creamos esta variable para la tabla de atributos.
  public data: Object;
  public temp_var: Object=false;

  public PerfilesList = [];
  public TiposDocList = [];

  public selectedPerfiles = [];
  public selectedTiposDoc = [];

  public dropdownSettingsPerf = {};
  public dropdownSettingsTiposDoc = {};
  
  constructor(
    private route: ActivatedRoute, http: HttpClient, @Inject("BASE_URL") baseUrl: string, private modalService: BsModalService) {
    this.baseUrl = baseUrl;
    this.http = http;
    let headers = new Headers({
      "Content-Type": "application/x-www-form-urlencoded"
    });
    let options = new RequestOptions({ headers: headers });
  }

  ngOnInit() {
     // Estos dtOptions son las propiedades de la Datatable
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
    this.loadUsers();
    //cargo las familias en el dropdownlist
    this.loadFamilies()
    //cargo los tipos de documentos en el dropdownlist
    this.loadTipoDocumentos()
    

    // this.dropdownList = [
    //   { item_id: 1, item_text: 'Mumbai' },
    //   { item_id: 2, item_text: 'Bangaluru' },
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' },
    //   { item_id: 5, item_text: 'New Delhi' }
    // ];

    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' }
    // ];

    //configuraciones de dropdownlist de perfiles
    this.dropdownSettingsPerf = {
      singleSelection: false,
      idField: 'familia_id',
      textField: 'descripcion',
      selectAllText: 'Seleccionar todos',
      unSelectAllText: 'Deseleccionar todos',
      itemsShowLimit: 10,
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar',
      noDataAvailablePlaceholderText:'No hay datos'
    };
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
    //Aca se llama a la api para obtener todos las familias...
    this.http
      .get<Family[]>(this.baseUrl + "api/Family/GetAllFamilies")
      .subscribe(result => {
        this.PerfilesList = result;       
        console.log(this.PerfilesList);
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


  loadUsers() {
    this.table.destroy() // Trato de destruir la Datatable
    //Aca se llama a la api para obtener todos los usuarios...
    this.http
      .get<User[]>(this.baseUrl + "api/Users/GetAllUsers")
      .subscribe(result => {
        this.usuarios = result;
        this.temp_var=true;
        console.log(this.usuarios);
      });
  }

  // Abre una ventana modal que muestra el error personalizado
  openModalAlert(template: TemplateRef<any>, ttl: string, msg: string) {
    this.message = msg;
    this.title = ttl == "" ? "Alerta" : ttl;
    this.modalRefAlert = this.modalService.show(template, { class: "second" });
  }

  // Elimina un usuario
  deleteUser(_idns_user: number) {
    if (confirm("Está seguro que quiere eliminar al usuario?")) {
      //Aca se llama a la api para obtener todos los usuarios...
      this.http
        .get<boolean>(
          this.baseUrl + "api/Users/DeleteUser?iduser=" + _idns_user
        )
        .subscribe(result => {
          console.log(result);
          this.loadUsers();
          alert("Se ha eliminado correctamente al usuario: " + _idns_user);
        });
    } else {
      // Do nothing!
    }
  }


  asocUser(template: TemplateRef<any>, usuario: User) {
 
    this.usuario = usuario;
  
    console.log(this.usuario );
    this.modalAsoc = this.modalService.show(template);
  }

  saveAsoc(forma2: NgForm, template: TemplateRef<any>) {
    console.log("Formulario posteado");
    console.log("ngForm" , forma2);
    console.log("valor forma", forma2.value);

    console.log("asoc1", this.selectedPerfiles);
    console.log("asoc2", this.selectedTiposDoc);
    //this.usuario = forma2.value;

  }

  // Abre la ventana modal que muestra las propiedades de la carpeta
  editUser(template: TemplateRef<any>, usuario: User) {
    //marca de edicion de usuario
    this.nuevo = false;
   
    this.usuario = usuario;
  
    console.log(this.usuario );
    this.modalUser = this.modalService.show(template);
  }

  // Abre la ventana modal que muestra las propiedades de la carpeta
  newUser(template: TemplateRef<any>) {
    //marca de creacion de usuario
    this.nuevo = true;
    
    //limpio objecto
    this.usuario = null;
    this.usuario = new User();
    
    this.modalUser = this.modalService.show(template);
  }

  
  saveUser(forma: NgForm, template: TemplateRef<any>) {
    // this.usuario.usuario = user;
    // this.usuario.nombre = username;
    // this.usuario.apellido = lastname;
    // this.usuario.telefono = telephone.toString();
    // this.usuario.email = email;
    console.log("Formulario posteado");
    console.log("ngForm" , forma);
    console.log("valor forma", forma.value);

    console.log("Usuario", this.usuario);
    this.usuario = forma.value;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let url;
    console.log(this.nuevo)
    if (this.nuevo){
      url = this.baseUrl +  'api/Users/InsertUser';
    }else{
     url = this.baseUrl +  'api/Users/UpdateUser';
    }
    console.log(this.usuario);

    this.http.post<User>(url, this.usuario, httpOptions).subscribe
    (
      res => {
        console.log(res);
        this.loadUsers(); 
        alert("Usuario creado/modificado con éxito")
       
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

 class User {
  usuario_id: number;
  usuario: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  documento: number;
  alta_fecha: Date;
  // familias : family[];
}
// class family{

// }
