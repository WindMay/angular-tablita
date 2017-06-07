# angular-tablita

>Angular 2+ data table component, with edit/add/remove actions messages, with batch functions.

*angular-tablita* (Tablita translates into little table in spanish) is an *Angular 2+* component packaged for npm so everyone can use it, it binds to a a data-array creates a reactive form and emits messages so you can perform actions like "services actions, others validations" then you can mutate the input and update the data.

## Contents
* [1 Demo](#1)
* [2 Install & Usage](#2)
* [3 Rules](#3)
* [4 Build](#5)

## <a name="1"></a>1 Demo
Go to the live demo, and look how it sends the output messages [Demo](https://fir-4f1b9.firebaseapp.com/).
## <a name="2"></a>2 Install & Usage
Go to your project root folder and  execute:

```$npm install angular-tablita```

Add the module:

```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
  ]
  bootstrap: [AppComponent]
})
export class AppModule { }
```
Set options and describe columns according to the array:

(Example)

```
private options: any = {
  debug: true,//Show debug info
  blankLabel: 'n/a',//Null label
  outer_form: 'both', //Show Simple Add and Batch actions forms (top, bottom, both)
  add: {
    display:true,
    caption: 'both', // show add button on outer form options "top, bottom, both"
    show: false
  },
  editable: {
    display: true, 
    show: true,
    delete: true,
    batch: false,
  },
  columns: [  //Describe columns
    {
      name: 'Name', // <property_name>: <Name to display on table>
      type: 'string', // Data type : string, number boolean
      validators: { // Validator for the reactive form
        required: false,
        min: 2,
        max: 50
      }
    },
    {
      calories: 'Calories',
      type: 'string',
      validators: {
        required: false,
        min: 2,
        pattern: '^(0|[1-9][0-9]*\w*kcal)$'
      }
    },
    {
      carbos: 'Carbos',
      type: 'string',
      validators: {
        required: false
      }
    },
    {
      favorites: 'Favorites',
      type: 'number',
      validators: {
        required: false,
        min: 0,
        max: 20
      }
    },
    {dressing: 'Aderezo', type: 'boolean'}
    ]
  };
```
Define a method to get the tablita's feedback: 

```
updateMesage(event:any){
	console.log(event);
}
```
Use the component!
```
<tablita [tableData]="dataArray" [options]="options" (tableUpdate)="updateMesage($event)" </tablita>
```

## <a name="3"></a>3 Rules
These are to set the form's validators

```validators: { 
        required: false, //Field is required
        min: 2, //Min lenght
        max: 50, //Max lenght
        pattern: '^(0|[1-9][0-9]*\w*kcal)$' //Any Regex pattern validation
      }
 ```
## <a name="5"></a>5 Build

clone this repo then `npm install`

Build into `/dist` folder:

`npm run build`

Get package:

`npm run pack-lib`

## License
MIT3
