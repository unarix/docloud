import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent {

  // // mensaje que se despliega al iniciar el componente
   alerts: any[] = [{
  //   type: 'info',
  //   msg: 'Selecciona el archivo que quieres cargar y luego haz click en "subir"',
  //   timeout: 5000
   }];

  public progress: number =0;
  
  public message: string;
  constructor(private ref: ChangeDetectorRef,private http: HttpClient) { }
  public files: UploadFile[] = [];
  
  public dropped(event: UploadEvent) {
    
    this.files = event.files;
    for (const droppedFile of event.files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
 
          const formData = new FormData()
          formData.append('logo', file, droppedFile.relativePath)

          const uploadReq = new HttpRequest('POST', 'api/UploadFile', formData, {
            reportProgress: true,
          });
      
          this.http.request(uploadReq).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress)
              this.progress = Math.round(100 * event.loaded / event.total);
            else if (event.type === HttpEventType.Response)
            {
              this.mostrarMensaje(event.body.toString());
            }
      
          });
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        alert("" + droppedFile.relativePath + fileEntry);
      }
    }
  }
 
  public mostrarMensaje(mensajex)
  {
    alert(mensajex);
    location.reload();
  }

  public fileOver(event){
    //console.log(event);
  }
 
  public fileLeave(event){
    //console.log(event);
  }

  

}
