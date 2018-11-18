import { Component } from '@angular/core';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  
  foodList= ['Jollof Rice', 'Garri', 'Yam', 'Beans'];
  title = 'app';
  
  dynamicFormConfig = [
    {
      type: 'input',
      name: 'query',
      inputType: 'text',
      placeholder: 'Upload Anything'
    },
    {
      type: 'select',
      label: 'Choose Your Fav',
      options: this.foodList,
      name: 'food',
      inputType: 'text',
      placeholder: 'Select Favorite Food'
    },
    {
      type: 'button',
      label: 'Clicking ',
      labelClass: 'pad-20',
      text: 'Search',
      inputType: 'submit',
      class: 'btn btn-primary',
      name: 'submit',
    }
  ];

  ngOnInit() {
    this.dynamicFormConfig = [];
    this.dynamicFormConfig.push({type:'input',name:'query',inputType:'text',placeholder:'Sube lo que sea'});
    this.dynamicFormConfig.push({type:'input',name:'query1',inputType:'text',placeholder:'Sube lo que sea'});
    this.dynamicFormConfig.push({type:'input',name:'query2',inputType:'text',placeholder:'Sube lo que sea'});
    this.dynamicFormConfig.push({type:'input',name:'query3',inputType:'text',placeholder:'Sube lo que sea'});
    this.dynamicFormConfig.push({type:'button',label: '', labelClass: '',text: 'Search',inputType: 'submit',class: 'btn btn-primary',name: 'submit'});
  }

  doSomethingCool(model: any) {
    console.log(model);
  }

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