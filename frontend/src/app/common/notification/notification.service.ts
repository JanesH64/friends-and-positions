import { DialogConfig } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { InfoDialogComponent } from 'src/app/info-dialog/info-dialog.component';
import { DvDialogConfig } from 'src/app/models/dvDialogConfig';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  successSnackBarConfig: MatSnackBarConfig = {
    horizontalPosition: "center",
    verticalPosition: "bottom",
    panelClass: "success-snackbar",
    duration: 30000
  }

  errorSnackBarConfig: MatSnackBarConfig = {
    horizontalPosition: "center",
      verticalPosition: "bottom",
      panelClass: "error-snackbar",
      duration: 30000
  }

  success(message: string) {
    this.snackBar.open(message, "OK", this.successSnackBarConfig);
  }

  error(error: string): void {
    this.snackBar.open(error, "Read", this.errorSnackBarConfig);
  }

  confirm(config: DvDialogConfig) {
    this.dialog.open(InfoDialogComponent, {data: config})
  }
}
