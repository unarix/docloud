import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { HttpClient } from '@angular/common/http'
import { Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-mydocs-add',
  templateUrl: './mydocs-add.component.html',
  styleUrls: ['./mydocs-add.component.css'],
  providers: [BsModalService]
})
export class MydocsAddComponent implements OnInit {

  @Input() title: string = '';
  @Input() fileName: string = '';
  @Output() action = new EventEmitter();
  
  public baseUrl : string;
  public http: HttpClient;
  public dynamicFormConfig = [];
  public Atributes: Atribute[];
  public documentTypes: DocumentType[];

  //constructor(public bsModalRef: BsModalRef) { }

  constructor(public bsModalRef: BsModalRef, http: HttpClient, @Inject('BASE_URL') baseUrl: string, private modalService: BsModalService) {
    this.baseUrl = baseUrl;
    this.http = http;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
  }


  public clickOk() {
    console.log("Click ok...");
    let numero: number = 9;
		this.action.emit(numero);
  }

  ngOnInit() {
    if(this.fileName != '')
    {
      // Si el archivo no es vacio, pido que seleccion la carpeta donde va a guardarlo
      console.log("> Cargando documentos");
      this.loadDocumentTypes();
    }

  }

  public loadDocumentTypes()
  {
      console.log(" -> Obteniendo .... ");
      this.http.get<DocumentType[]>(this.baseUrl + 'api/DocumentType/GetDocumentTypes').subscribe(result => {
        this.documentTypes = result;
      }, error => {
          console.log(error);
        }
      ); 
      console.log(" -> Terminado");
  }

  public loadAttrs(idns_documento_tipo: string)
  {
    // Debo contruir el html para completar los atributos
    this.dynamicFormConfig = [];

    console.log("obteniendo atributos");

    this.http.get<Atribute[]>(this.baseUrl + 'api/Atributes/' + idns_documento_tipo).subscribe(result => 
      {
        this.Atributes = result;
        console.log(result);
        console.log(this.Atributes);
      }, error => {
        JSON.stringify(error); 
        console.log(error);
      }, () => {
        
        // Por cada atributo cargo un fomr control (input)
        this.Atributes.forEach(element => {
          this.dynamicFormConfig.push({type:'input', name:element.idns_atributo, inputType:'text', placeholder: element.sd_atributo});
        });

        // Cargo el boton que guardara los atributos
        this.dynamicFormConfig.push({type: 'button', label: '', labelClass: '', text: 'Guardar', inputType: 'submit', class: 'btn btn-primary', name: 'submit'});
      }
    );  
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

class AtributeValue {
  idns_atributo_valor: number;
  ns_atributo: number;
  sd_valor: string;
  ns_documento : number;
  h_fecha_alta : Date;
  h_valor : Date;
  ns_valor : number;
}

interface DocumentType {
  idns_documento_tipo: number;
  sd_descripcion: string;
  h_alta: Date;
  n_responsable : number;
  n_aeropuertos : number;
  n_clientes : number;
  n_destinatarios : number;
}