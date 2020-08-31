import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { gQueryService } from "../../../services/g-query.service"
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {inputI} from "../../../models/input.interface";
import {FormGroup, FormControl, Validators} from "@angular/forms";  
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";

@Component({
  selector: 'app-g-input',
  templateUrl: './g-input.component.html',
  styleUrls: ['./g-input.component.styl'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})


export class GInputComponent implements OnInit {

  InputForm: FormGroup;
  public imageUrl;
  public FileData;

 
  constructor(
    private gQuery: gQueryService,
    public dialogRef: MatDialogRef<GInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data:inputI) {
      this.InputForm = new FormGroup({});
      
      data.Campos.forEach(element => {
        if(element["Validacion"]){
          this.InputForm.addControl(element["Nombre"], new FormControl('',element["Validacion"]))
        }else{
          this.InputForm.addControl(element["Nombre"], new FormControl(''))
        }
      });
      this.FileData = [
        this.File,
        this.InputForm.value
      ]
    }
    // image: new FormControl(null, [Validators.required, requiredFileType('png')])
  public File;
  ngOnInit() {
  
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  public previewImage(event) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);

    reader.onload = _event => {
      console.log(_event);
      this.imageUrl = reader.result;
      
        // need to run CD since file load runs outside of zone
        // do something else
        // this.cd.markForCheck();
    };
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.File = event.target.files[0];
    }
    this.FileData = [
      this.File,
      this.InputForm.value
    ]

  }
  // SelImagen(files: FileList){
  //   console.log(files);
  //   // return;
  //   var file;
  //   this.data.Campos.forEach(element => {
  //     if(element["Tipo"]=='Archivo'){
        
  //       this.InputForm.controls[element["Nombre"]].setValue(files);
  //       file = files;
  //     }
  //   });

  //   console.log(file);
    
    

  // }
}
