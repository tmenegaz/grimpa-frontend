import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective } from 'ngx-mask';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  imports: [
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    RouterModule,
    TranslateModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatSortModule,
  ],
  exports: [
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    RouterModule,
    TranslateModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatSortModule,
  ]
})
export class SharedModule { }
