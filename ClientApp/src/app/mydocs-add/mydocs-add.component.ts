import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-mydocs-add',
  templateUrl: './mydocs-add.component.html',
  styleUrls: ['./mydocs-add.component.css'],
  providers: [BsModalService]
})
export class MydocsAddComponent implements OnInit {

  @Input() title: string = 'Modal with component';
  @Input() fileName: string = '';
  @Output() action = new EventEmitter();

  constructor(public bsModalRef: BsModalRef) { }

  public clickOk() {
    console.log("Click ok...");
    let numero: number = 9;
		this.action.emit(numero);
  }

  ngOnInit() {
    //if(fileName)
  }


}
