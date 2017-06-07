import {Component, OnInit, Input, OnChanges, Renderer, ElementRef, Output, EventEmitter} from '@angular/core'
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'tablita',
  template: `      
  <!--Top Control-->
  <div class="top-control" *ngIf="options.outer_form == 'top' || options.outer_form == 'both'">
      <div class="title">
          <h2>Tabla</h2>
      </div>
      <div class="actions" *ngIf="options.editable.display || options.add.display">
          <div class="button-wrapper simple-edit-buttons-wrapper fit" *ngIf="!options.editable.batch && !options.add.show" [ngClass]="{'icon': caption.icons}">
              <div class="add" *ngIf="options.add.display">
                  <button (click)="options.add.show = !options.add.show;buildEditIndexControl()">
                      <i *ngIf="caption.icons" class="fa fa-plus" aria-hidden="true"></i>
                      {{caption.add.title}}
                  </button>
              </div>
              <div class="edit" *ngIf="options.editable.display">
                  <button (click)="options.editable.batch = !options.editable.batch; options.editable.show = !options.editable.show;buildEditIndexControl()">
                      <i *ngIf="caption.icons" class="fa fa-list" aria-hidden="true"></i>
                      {{caption.edit.batchEdit}}
                  </button>
              </div>
          </div>
          <!--Simple Add-->
          <div *ngIf="options.add.show">
              <h3 *ngIf="options.add.caption == 'title' || options.add.caption == 'both'">{{caption.add.title}}</h3>
              <form [formGroup]="myForm" (ngSubmit)="onSimpleSubmit(0,'add');options.add.show = !options.add.show" novalid>
                  <table>
                      <tr>
                          <td [colSpan]="headers.length">
                              <app-form-base [myForm]="myForm.controls.formArray.controls[0]" [inputsBase]="formInputs" ></app-form-base>
                          </td>
                          <td>
                              <button type="submit" [disabled]="!myForm.valid">{{caption.add.acceptAdd}}</button>
                              <button>{{caption.add.clearAdd}}</button>
                              <button type="button" (click)="options.add.show = !options.add.show;">{{caption.add.cancelAdd}}</button>
                          </td>
                      </tr>
                  </table>
              </form>
          </div>
          <!--Batch Edit-->
          <div *ngIf="options.editable.batch">
              <h2>Edicion Masiva</h2>
              <table>
                  <tr>
                      <td [colSpan]="headers.length+1">
                          <form [formGroup]="myForm" (ngSubmit)="onBatchSubmit('edit'); options.editable.batch = !options.editable.batch; options.editable.show = !options.editable.show;buildBatchEditIndexControl()" novalid>
                              <table>
                                  <tr>
                                      <td [colSpan]="headers.length">
                                          <app-form-base [myForm]="myForm.controls.formArray.controls[0]" [inputsBase]="formInputs" ></app-form-base>
                                      </td>
                                      <td>
                                          <button type="submit" [disabled]="!myForm.valid" >{{caption.edit.batchEdit}}</button>
                                          <button (click)="onBatchSubmit('erase'); buildBatchEditIndexControl(); buildBlurControl(); options.editable.batch = !options.editable.batch; options.editable.show = !options.editable.show">{{caption.edit.batchDelete}}</button>
                                          <button (click)="buildBatchEditIndexControl(); buildBlurControl(); options.editable.batch = !options.editable.batch; options.editable.show = !options.editable.show">{{caption.edit.cancelEdit}}</button>
                                      </td>
                                  </tr>
                              </table>
                          </form>
                      </td>
                  </tr>
                  <td>

                  </td>
              </table>
          </div>
      </div>
  </div>
  <!--Data Table-->
  <div class="table">
      <!--Table Headers-->
      <div class="tr th">
          <div class="td" *ngFor="let head of headers">{{head.value}}</div>
          <div class="td" *ngIf="options.editable.show || options.editable.batch">{{caption.edit.head}}</div>
      </div>
      <div class="tbody">
          <div class="tr" *ngFor="let row of tableData; let i=index;"  [ngClass]="{'focus': blurControl[i], 'selected': batchEditControl[i]}" (click)="handleRowClick(i)">

              <!--Data Display-->
              <ng-template [ngIf]="!editControl[i]">
                  <div class="td" *ngFor="let head of headers">
                      <span *ngIf="options.blankLabel && tableData[i][head.name]=='' && inputControl[head.name]!='boolean'">{{options.blankLabel}}</span>
                      <span *ngIf="tableData[i][head.name]!='' && inputControl[head.name]!='boolean'">{{tableData[i][head.name]}}</span>
                      <input *ngIf="inputControl[head.name]=='boolean'" type="checkbox" class="checkbox" [checked]="tableData[i][head.name]" disabled>
                  </div>
              </ng-template>

              <!--Data Simple Edit-->
              <ng-template [ngIf]="editControl[i]">
                  <form [formGroup]="myForm" (ngSubmit)="onSimpleSubmit(i,'edit')" novalid>
                      <app-form-base [myForm]="myForm.controls.formArray.controls[0]" [inputsBase]="formInputs" [defaultValues]="row"></app-form-base>
                      <div class="simple-edit-buttons-wrapper" [ngClass]="{'icon': caption.icons}">
                          <button type="submit" [disabled]="!myForm.valid">
                              <i *ngIf="caption.icons" class="fa fa-check" aria-hidden="true"></i>
                              {{caption.edit.acceptEdit}}
                          </button>
                          <button type="button" (click)="editControl[i] = !editControl[i]">
                              <i *ngIf="caption.icons" class="fa fa-times" aria-hidden="true"></i>
                              {{caption.edit.cancelEdit}}
                          </button>
                      </div>
                  </form>
              </ng-template>

              <!--Data Simple Edit Control-->
              <div class="td" *ngIf="options.editable.show && options.editable.delete && !editControl[i]">
                  <div class="simple-edit-buttons-wrapper fit" [ngClass]="{'icon': caption.icons}">
                      <button (click)="buildEditIndexControl();editControl[i] = !editControl[i]">
                          <i *ngIf="caption.icons" class="fa fa-pencil" aria-hidden="true"></i>
                          {{caption.edit.simpleEdit}}
                      </button>
                      <button *ngIf="options.editable.delete" (click)="onSimpleSubmit(i,'delete')">
                          <i *ngIf="caption.icons" class="fa fa-trash" aria-hidden="true"></i>
                          {{caption.edit.simpleDelete}}
                      </button>
                  </div>
              </div>

              <!--Batch Edit Control-->
              <div class="td" *ngIf="options.editable.batch">
                  <input id="table-ui-row-{{i}}" type="checkbox" [checked]="batchEditControl[i]" (keyup)="$event.preventDefault();handleKeyBatchNavigation($event,i)" (keydown)="preventKeyDown($event)" >
              </div>

          </div>
      </div>
  </div>
  <!--Bottom Control-->
  <div class="top-control" *ngIf="options.outer_form == 'bottom' || options.outer_form == 'both'">
      <div class="title">
          <h2>Tabla</h2>
      </div>
      <div class="actions" *ngIf="options.editable.display || options.add.display">
          <div class="button-wrapper simple-edit-buttons-wrapper fit" *ngIf="!options.editable.batch && !options.add.show" [ngClass]="{'icon': caption.icons}">
              <div class="add" *ngIf="options.add.display">
                  <button (click)="options.add.show = !options.add.show;buildEditIndexControl()">
                      <i *ngIf="caption.icons" class="fa fa-plus" aria-hidden="true"></i>
                      {{caption.add.title}}
                  </button>
              </div>
              <div class="edit" *ngIf="options.editable.display">
                  <button (click)="options.editable.batch = !options.editable.batch; options.editable.show = !options.editable.show;buildEditIndexControl()">
                      <i *ngIf="caption.icons" class="fa fa-list" aria-hidden="true"></i>
                      {{caption.edit.batchEdit}}
                  </button>
              </div>
          </div>
          <!--Simple Add-->
          <div *ngIf="options.add.show">
              <h3 *ngIf="options.add.caption == 'title' || options.add.caption == 'both'">{{caption.add.title}}</h3>
              <form [formGroup]="myForm" (ngSubmit)="onSimpleSubmit(0,'add');options.add.show = !options.add.show" novalid>
                  <table>
                      <tr>
                          <td [colSpan]="headers.length">
                              <app-form-base [myForm]="myForm.controls.formArray.controls[0]" [inputsBase]="formInputs" ></app-form-base>
                          </td>
                          <td>
                              <button type="submit" [disabled]="!myForm.valid">{{caption.add.acceptAdd}}</button>
                              <button>{{caption.add.clearAdd}}</button>
                              <button type="button" (click)="options.add.show = !options.add.show;">{{caption.add.cancelAdd}}</button>
                          </td>
                      </tr>
                  </table>
              </form>
          </div>
          <!--Batch Edit-->
          <div *ngIf="options.editable.batch">
              <h2>Edicion Masiva</h2>
              <table>
                  <tr>
                      <td [colSpan]="headers.length+1">
                          <form [formGroup]="myForm" (ngSubmit)="onBatchSubmit('edit'); options.editable.batch = !options.editable.batch; options.editable.show = !options.editable.show;buildBatchEditIndexControl()" novalid>
                              <table>
                                  <tr>
                                      <td [colSpan]="headers.length">
                                          <app-form-base [myForm]="myForm.controls.formArray.controls[0]" [inputsBase]="formInputs" ></app-form-base>
                                      </td>
                                      <td>
                                          <button type="submit" [disabled]="!myForm.valid" >{{caption.edit.batchEdit}}</button>
                                          <button (click)="onBatchSubmit('erase'); buildBatchEditIndexControl(); buildBlurControl(); options.editable.batch = !options.editable.batch; options.editable.show = !options.editable.show">{{caption.edit.batchDelete}}</button>
                                          <button (click)="buildBatchEditIndexControl(); buildBlurControl(); options.editable.batch = !options.editable.batch; options.editable.show = !options.editable.show">{{caption.edit.cancelEdit}}</button>
                                      </td>
                                  </tr>
                              </table>
                          </form>
                      </td>
                  </tr>
                  <td>

                  </td>
              </table>
          </div>
      </div>
  </div>
  `,
  styles: [ `
  :host {
    display: flex;
    width: 100%;
    flex-direction: column;
  }
  
  :host .title {
    display: flex;
  }
  
  :host .actions {
    display: flex;
    width: auto;
  }
  
  :host .top-control,
  :host .bottom-control {
    display: flex;
    flex-direction: column;
  }
  
  :host .simple-edit-buttons-wrapper {
    display: flex;
    flex: 1 1 auto;
  }
  
  :host .simple-edit-buttons-wrapper.icon button {
    font-size: 0px;
    height: auto;
    align-self: center;
    padding: 9px;
  }
  
  :host .simple-edit-buttons-wrapper.icon button i {
    font-size: 0.95vw;
  }
  
  :host .simple-edit-buttons-wrapper button {
    margin-right: 8px;
  }
  
  :host .simple-edit-buttons-wrapper button:last-child {
    margin-right: 0px;
  }
  
  :host form {
    margin: 8px;
    display: flex;
    width: 100%;
    border: 1.5px solid #808080;
    padding: 10px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    z-index: 2;
  }
  
  :host .table {
    display: flex;
    flex-flow: column nowrap;
    font-size: 0.8rem;
    margin: 1rem;
    line-height: 1.5;
    border-bottom: 1px solid #d0d0d0;
    flex: 1 1 auto;
  }
  
  :host .th {
    display: flex;
  }
  
  :host .th > .td {
    white-space: normal;
    justify-content: flex-end;
    font-size: 0.75rem;
    color: rgba(0,0,0,0.8);
    padding: 0.7rem 0.5rem 0.7rem 0.5rem;
  }
  
  :host .th > .td:first-child {
    justify-content: flex-start;
  }
  
  :host .tr {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    box-shadow: 0 3px 6px rgba(0,0,0,0), 0 3px 6px rgba(0,0,0,0);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    border: 1px solid rgba(0,0,0,0);
    z-index: 1;
  }
  
  :host .tr:nth-of-type(even) {
    background-color: #f2f2f2;
  }
  
  :host .tr:nth-of-type(odd) {
    background-color: #e7e7e7;
  }
  
  :host .tr.focus {
    background-color: #c5dbff;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    z-index: 2;
    margin: 3px 0 10px 0;
    border: 1px solid rgba(0,0,0,0.1);
  }
  
  :host .tr.selected {
    background-color: #62c487;
    border: none;
  }
  
  :host .tr.th {
    background-color: #f2f2f2;
  }
  
  :host .td {
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;
    flex-basis: 0;
    padding: 0.5em;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0px;
    white-space: nowrap;
    border-bottom: 1px solid #d0d0d0;
    justify-content: flex-end;
  }
  
  :host .td input.checkbox{
    width: auto;
  }
  
  :host .td .simple-edit-buttons-wrapper {
    display: flex;
    flex: 1 1 auto;
    justify-content: flex-end;
  }
  
  :host .td .simple-edit-buttons-wrapper.icon,
  :host .td .simple-edit-buttons-wrapper.td {
    padding: 0px;
  }
  
  :host .td .simple-edit-buttons-wrapper.icon button,
  :host .td .simple-edit-buttons-wrapper.td button {
    font-size: 0px;
    height: auto;
    align-self: center;
    padding: 2px;
  }
  
  :host .td .simple-edit-buttons-wrapper.icon button i,
  :host .td .simple-edit-buttons-wrapper.td button i {
    font-size: 0.95vw;
  }
  
  :host .td:first-child {
    justify-content: flex-start;
    padding-left: 0.7rem;
  }
  
  :host .td:last-child {
    padding-left: 0.6rem;
  }
  
  `]
})
export class TablitaComponent implements OnInit, OnChanges {
  @Input() private tableData: any = []
  @Input() private options: any = {
    debug: false,
    columns: [],
    blankLabel: null,
    outer_form: 'both',
    add: {
      display: true,
      caption: 'both',
      show: true
    },
    editable: {
      display: true,
      show: true,
      delete: false,
      batch: false,
    },
    inputs: {
      notNull: [],
      number: [],
      date: [],
      checkbox: [],
      text: []
    }
  }
  @Input() private caption:any={
    icons: false,
    edit: {
      head: 'Edit',
      simpleEdit: 'Edit',
      simpleDelete: 'Delete',
      acceptEdit: 'Ok',
      batchEdit: 'Batch Edit',
      cancelEdit: 'Cancel Edit',
      batchDelete: 'Batch Delete',
    },
    add: {
      title: 'Add Row',
      head: 'Add',
      acceptAdd: 'Ok',
      clearAdd: 'Clear Add',
      cancelAdd: 'Cancel Add',
    }
  }
  @Output() tableUpdate: EventEmitter<any> = new EventEmitter()
  private feedback:any={
    errors: [],
    warnings: []
  }
  //Table data control
  private headers: any = []
  private editControl: any = []
  private inputControl: any = {}
  private batchEditControl: any = []
  private blurControl: any = []

  //Misc Variables
  private formInputs: any = []
  private tableElement: Element
  private myForm: FormGroup
  private uiMultipleBatchSelected:boolean = false

  constructor(private renderer: Renderer, private elementRef: ElementRef, private fb: FormBuilder) {
    this.buildForms()
  }

  ngOnInit() {
    this.tableElement = this.elementRef.nativeElement.querySelector('table')
    if(this.options.editable.show) {
      this.buildEditIndexControl()
      if(this.options.editable.batch)
        this.buildBatchEditIndexControl()
    }
    this.buildForms()
  }
  ngOnChanges(){
    this.buildHeaders()
    this.buildBlurControl()
    this.buildBatchEditIndexControl()
    if(this.options.editable.show) {
      this.buildEditIndexControl()
      if(this.options.editable.batch)
        this.buildBatchEditIndexControl()
    }
  }
  buildForms(){
    //Inputs
    for(let column of this.options.columns) {
      let prop: any = Object.keys(column)[0]
      let validatorsArray: any = []
      if (column['validators']) {
        for(let validator in column.validators) {
          validatorsArray.push({type: validator, rule: column.validators[validator]})
        }
      }
      let inputType:any
      switch(column.type){
        case 'number':
          inputType = column.type
          break
        case 'boolean':
          inputType = 'checkbox'
          break
        default:
          inputType = 'text'
      }
      this.formInputs.push({
        name: prop,
        value: column[prop],
        type: inputType,
        validators: validatorsArray
      })
    }
    //Form Group
    let newForm = this.fb.group({formArray: this.fb.array([])})
    const arrayControl = <FormArray>newForm.controls['formArray']
    let controls: any = {}
    this.formInputs.forEach((input: any)=>{
      let valArray: any = []
      input.validators.forEach((validator: any)=>{
        switch(validator.type){
          case 'required':
            if(validator.rule)
              valArray.push(Validators.required)
            break
          case 'min':
            valArray.push(Validators.minLength(validator.rule))
            break
          case 'max':
            valArray.push(Validators.maxLength(validator.rule))
            break
          case 'pattern':
            valArray.push(Validators.pattern(validator.rule))
        }
      })
      controls[input.name] = [null, valArray]
    })

    arrayControl.push(this.fb.group(controls));
    this.myForm = newForm;
  }

  //CRUD Methods

  onSimpleSubmit(i:number, action:string):void{
    switch(action) {
      case 'edit':
        this.editControl[i] = !this.editControl[i]
        let newValue = false
        for (let property in this.myForm.value.formArray[0])
          if (this.myForm.value.formArray[0][property] != this.tableData[i][property])
            newValue = true
        if (newValue) {
          this.tableUpdate.emit({
            action: 'edit',
            index: i,
            value: this.myForm.value.formArray[0]
          })
        }
        break;
      case 'delete':
        this.tableUpdate.emit({
          action: 'delete',
          index: i,
        })
        break;
      case 'add':
        this.tableUpdate.emit({
          action: 'add',
          index: i,
          value: this.myForm.value.formArray[0]
        })
        break;
      default:
        console.log('Wrong signal for simple submit')
    }/*
    if(action=='edit') {
      this.editControl[i] = !this.editControl[i]
      let newValue = false
      for (let property in this.myForm.value.formArray[0]) {
        if (this.myForm.value.formArray[0][property] != this.tableData[i][property])
          newValue = true
      }
      if (newValue) {
        this.tableUpdate.emit({
          action: 'edit',
          index: i,
          value: this.myForm.value.formArray[0]
        })
      }
    } else {
      this.tableUpdate.emit({
        action: 'delete',
        index: i,
      })
    }*/
  }

  onBatchSubmit(action:string){
    let index: any = []
    for(let i = 0;this.batchEditControl.length>i;i++){
      if(this.batchEditControl[i])
        index.push(i)
    }
    if(index.length>0) {
      if(action == 'edit')
        this.tableUpdate.emit({
          action: 'Batch Edit',
          index: index,
          value: this.myForm.value.formArray[0]
        })
      else
        this.tableUpdate.emit({
          action: 'Batch Delete',
          index: index
        })
    }
  }

  //Build Table Methods

  buildHeaders(){
    this.headers=[]
    this.inputControl=[]
    for(let column of this.options.columns) {
      let prop = Object.keys(column)[0]
      this.headers.push({
        name: prop,
        value: column[prop]
      })
      if(this.options.editable.show)
        this.inputControl[prop] = column.type
    }
  }
  buildEditIndexControl(){
    this.editControl = Array(this.tableData.length).fill(false)
  }
  buildBlurControl(){
    this.blurControl = Array(this.tableData.length).fill(false)
  }
  buildBatchEditIndexControl(){
    this.batchEditControl = Array(this.tableData.length).fill(false)
  }

  //Debug Methods

  getType(value:any){
    return typeof value
  }
  outputEvent(mssg:string){
    console.log(mssg)
  }

  //UI control
  preventKeyDown(event:any){
    if(event.code!='Tab')
      event.preventDefault()
  }

  handleKeyBatchNavigation(event:any, index:number){
    if( (event.shiftKey && (event.code!='Enter' || event.code!='Space'  ) && event.code!='Tab') || event.key=='Shift' || (this.uiMultipleBatchSelected && event.code=='Enter') ){
      this.uiMultipleBatchSelected=true
    } else {
      this.uiMultipleBatchSelected=false
      this.buildBlurControl()
    }
    if((event.code == 'ArrowDown') && index + 1 < this.tableData.length) {
      //Not optimal look for a DOM array ui build
      this.focusRowIndex(index+1)
      this.blurControl[index + 1] = true
    } else if(event.code == 'Tab' && index + 1 < this.tableData.length) {
      this.blurControl[index] = true
      this.focusRowIndex(index)
    }else if(event.code == 'ArrowUp' && index - 1 >= 0) {
      //Not optimal look for a DOM array ui build
      this.focusRowIndex(index-1)
      this.blurControl[index - 1] = true
    } else if(event.code == 'Enter' || event.code == 'Space') {
      if(this.uiMultipleBatchSelected){
        this.uiMultipleBatchSelected=false
        for(let i=0;i<this.blurControl.length;i++)
          if(this.blurControl[i])
            this.batchEditControl[i]=true
        this.buildBlurControl()
      } else {
        this.batchEditControl[index] = !this.batchEditControl[index]
      }
    }
  }
  handleRowClick(index:number){
    if(this.options.editable.batch) {
      this.batchEditControl[index] = !this.batchEditControl[index];
      this.buildBlurControl()
      this.blurControl[index]=true
      this.focusRowIndex(index)
    }
  }
  focusRowIndex(index:number){
    let element: HTMLElement = <HTMLElement>document.getElementById(`table-ui-row-${index}`);
    if(element)
      element.focus()
  }

}
