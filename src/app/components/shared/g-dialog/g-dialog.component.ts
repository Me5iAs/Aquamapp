import { Component, OnInit, Inject } from '@angular/core';
import { gQueryService } from "../../../services/g-query.service"
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-g-dialog',
  templateUrl: './g-dialog.component.html',
  styleUrls: ['./g-dialog.component.styl']
})
export class GDialogComponent implements OnInit {

  constructor(
    private gQuery: gQueryService,
    public dialogRef: MatDialogRef<GDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onOk(data){

  }

  onBuscar(data){

  }
}
