import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TableComponent } from './components/table/table.component';
import { FormBaseComponent } from './components/table/form-base/form-base.component';
import {RecipesService} from "./services/recipes.service";

import 'hammerjs';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AngularFireModule} from "angularfire2";
import {environment} from "../environments/environment";
import {firebase} from "../firebasecred"
const CREDS: any = firebase || {
  apiKey: "hi",
  authDomain: "try",
  databaseURL: "later",
  projectId: "xD",
  storageBucket: "itsnotpaid",
  messagingSenderId: "anyways"
}

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    FormBaseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebase)
  ],
  providers: [
    RecipesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
