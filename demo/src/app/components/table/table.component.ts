import {Component, OnInit, Input, OnChanges, Renderer, ElementRef, Output, EventEmitter} from '@angular/core'
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.styl']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() public tableData:any=[]
  @Input() public options:any={
    debug: false,
    columns: [],
    blankLabel: null,
    outer_form: 'both', // Top, bottom, both
    add:{
      display: true,
      caption: 'both',// head, title, both
      show: true
    },
    editable:{
      display:true,
      show: true,
      delete: false,
      batch: false,
    },
    inputs:{
      notNull:[],
      number:[],
      date:[],
      checkbox:[],
      text:[]
    }
  }
  @Input() public caption:any={
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
      title:'Add Row',
      head: 'Add',
      acceptAdd: 'Ok',
      clearAdd: 'Clear Add',
      cancelAdd: 'Cancel Add',
    }
  }
  @Output() tableUpdate:EventEmitter<any> = new EventEmitter()
  private feedback:any={
    errors:[],
    warnings:[]
  }
  //Table data control
  public headers:any=[]
  private editControl:any=[]
  private inputControl:any={}
  private batchEditControl:any=[]
  private blurControl:any=[]

  //Misc Variables
  private formInputs:any=[]
  private tableElement:Element
  private myForm: FormGroup
  private uiMultipleBatchSelected:boolean = false

  constructor(private renderer : Renderer, private elementRef : ElementRef, private fb: FormBuilder) {
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
      let prop = Object.keys(column)[0]
      let validatorsArray = []
      if(column['validators']){
        for(let validator in column.validators)
          validatorsArray.push({type:validator, rule:column.validators[validator]})
      }
      let inputType
      switch(column.type){
        case 'number':
          inputType=column.type
          break
        case 'boolean':
          inputType='checkbox'
          break
        default:
          inputType='text'
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
    let controls:any={}
    this.formInputs.forEach(input=>{
      let valArray=[]
      input.validators.forEach(validator=>{
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
    let index = []
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
