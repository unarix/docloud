import {Component, OnInit, Inject, TemplateRef, ElementRef } from "@angular/core";
import {HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpResponse} from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Http, Headers, RequestOptions } from "@angular/http";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { NgForm } from "@angular/forms";


@Component({
  selector: "app-users",
  templateUrl: "./users.component.html"
})
export class UsersComponent implements OnInit {
  // **** Ventanas Modales ****
  modalRef: BsModalRef;
  modalRefAlert: BsModalRef;
  modalUser: BsModalRef;

  public baseUrl: string;
  public http: HttpClient;
  public headers: Headers;
  public options: RequestOptions;
  public usuarios: User[];
  public usuario: User;
  public message: string;
  public title: string;
  public nuevo:boolean = true; 

  
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
    this.loadUsers();
  }

  loadUsers() {
    //Aca se llama a la api para obtener todos los usuarios...
    this.http
      .get<User[]>(this.baseUrl + "api/Users/GetAllUsers")
      .subscribe(result => {
        this.usuarios = result;
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
    if (confirm("Está seguro que quiere eliminar el usuario?")) {
      //Aca se llama a la api para obtener todos los usuarios...
      this.http
        .get<boolean>(
          this.baseUrl + "api/Users/DeleteUser?iduser=" + _idns_user
        )
        .subscribe(result => {
          console.log(result);
          alert("Se ha eliminado correctamente el usuario" + _idns_user);
        });
    } else {
      // Do nothing!
    }
  }

  // Abre la ventana modal que muestra las propiedades de la carpeta
  editUser(template: TemplateRef<any>, usuario: User) {
    //marca de edicion de usuario
    this.nuevo = false;
   
    this.usuario = usuario;
    template.elementRef
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

  saveUser(forma: NgForm) {
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
        
        //this.openModalAlert(this.ventanaModal,"Exito!","Se creo su nuevo atributo con exito!"); 
      }
      , 
      error => { 
        //this.openModalAlert(this.ventanaModal,"Error!",JSON.stringify(error)); 
        console.error(error) 
      }
    );

    

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
