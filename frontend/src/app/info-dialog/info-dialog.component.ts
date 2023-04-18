import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DvDialogConfig } from '../models/dvDialogConfig';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DvDialogConfig
  ) { }

  ngOnInit(): void {
  }

}
