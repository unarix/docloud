import { Component, OnInit, Inject, TemplateRef, ElementRef } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import { ActivatedRoute} from "@angular/router";
import { Http, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit {

  public baseUrl : string;
  public http: HttpClient;
  public headers: Headers;
  public options: RequestOptions;
  public usuarios: User[];

  constructor(private route: ActivatedRoute, http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = http;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });

    }
  
ngOnInit() {
    this.loadUsers()
  }

  loadUsers()
  {

    //Aca se llama a la api para obtener todos los usuarios...
    this.http.get<User[]>(this.baseUrl + 'api/Users/GetAllUsers').subscribe(result => {
      this.usuarios = result;
      console.log(this.usuarios);
    });

    // this.http.get<Document[]>(this.baseUrl + 'api/DocumentType/GetDocumentTypes').subscribe(result => {
    //   this.document = result;
    // }, error => {
    //     this.openModalAlert(this.ventanaModal,"Error!", JSON.stringify(error)); 
    //     console.log(error);
    //   }
    // ); 
  }

    // Elimina un atributo
    deleteUser(_idns_user:number)
    {
      // alert(_idns_user);
  
      // var date = new Date();
  
      // let usr: User = {
      //   idns_atributo: _idns_atributo,
      //   sd_atributo: "",
      //   ns_documento_tipo: this.id_folder_selected,
      //   ns_atributo_tipo : 0,
      //   h_alta : date,
      //   sd_opciones : "",
      // };
  
      // console.log(atr);
  
      // const httpOptions = {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // };
      
      // let url = this.baseUrl +  'api/Atributes/DeleteAtribute';
  
      // this.http.post<User>(url, atr, httpOptions).subscribe
      // (
      //   res => {
      //     console.log(res); 
      //     this.loadAtributes(this.id_folder_selected);
      //     this.openModalAlert(this.ventanaModal,"Exito!","Se elimino el atributo con exito!"); 
      //   }
      //   , 
      //   error => { 
      //     this.openModalAlert(this.ventanaModal,"Error!",JSON.stringify(error)); 
      //     console.error(error) 
      //   }
      // );
    }
  
  }
  class User {
    usuario_id : number;
    usuario : string;
    password : string;
    nombre : string;
    apellido : string;
    telefono : string;
    email : string;
    documento : number;
    alta_fecha : Date;
    // familias : family[];
    
  }
  // class family{



  // }
