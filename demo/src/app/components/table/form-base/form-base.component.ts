import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-base',
  templateUrl: './form-base.component.html',
  styleUrls: ['./form-base.component.styl']
})
export class FormBaseComponent {
  @Input() myForm: FormGroup
  @Input() inputsBase:any = []
  @Input() defaultValues:any = {}

  constructor(){}
  ngOnInit(){
    this.inputsBase.forEach((input)=>{
      if(typeof this.defaultValues[input.name]!='undefined') {
        this.myForm.controls[input.name].setValue(this.defaultValues[input.name])
      } else {
        this.myForm.controls[input.name].setValue(null)
      }
    })
  }
}
