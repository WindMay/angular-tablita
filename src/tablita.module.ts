import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TablitaComponent} from './tablita.component';
import {FormBaseComponent} from './form-base.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    TablitaComponent,
    FormBaseComponent
  ],
  exports: [
    TablitaComponent,
    FormBaseComponent
  ]
})
export class TablitaModule {}
