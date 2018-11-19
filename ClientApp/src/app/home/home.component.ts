import { Component } from '@angular/core';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
 
  alerts: any[] = [{
    type: 'success',
    msg: `Bienvenido a doCLoud, ya puedes cargar tus documentos! (added: ${new Date().toLocaleTimeString()})`,
    timeout: 5000
  }];
 
  add(): void {
    this.alerts.push({
      type: 'info',
      msg: `This alert will be closed in 5 seconds (added: ${new Date().toLocaleTimeString()})`,
      timeout: 5000
    });
  }
 
  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

}

export enum Color {
  'Blue','Pink','Red','Yellow'
};