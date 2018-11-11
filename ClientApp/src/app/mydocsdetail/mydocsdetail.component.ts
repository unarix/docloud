import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-mydocsdetail',
  templateUrl: './mydocsdetail.component.html',
  styleUrls: ['./mydocsdetail.component.css']
})
export class MydocsdetailComponent implements OnInit {

  public idns_documento: string;
  public sd_descripcion: string;

  constructor(private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      this.idns_documento = params["idns_documento"];
      this.sd_descripcion = params["sd_descripcion"];
    });
  }

  ngOnInit() {
  }

}
