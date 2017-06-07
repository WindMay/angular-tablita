import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-base',
  template: `
  <form [formGroup]="myForm">
      <div  *ngFor="let chunk of inputsBase" class="inputs-wrapper">
          <label>{{chunk.value}}:</label>
          <input *ngIf="chunk?.type == 'text' || chunk?.type == 'number'" class="text" [type]="chunk.type" [formControlName]="chunk.name" [value]="defaultValues[chunk.name] ? defaultValues[chunk.name] : null" [placeholder]="chunk.value"/>
          <input *ngIf="chunk?.type == 'checkbox'" [type]="chunk.type" class="checkbox" [formControlName]="chunk.name" [checked]="defaultValues[chunk.name]" (change)="$event.target.checked ? myForm.controls[chunk.name].setValue(true) : myForm.controls[chunk.name].setValue(false)"/>
      </div>
  </form>`,
  styles: [`
    :host {
      width: 100%;
    }

    form {
      display: flex;
      width: 100%;
    }

    form .inputs-wrapper {
      display: flex;
      flex: 1 1 auto;
      justify-content: flex-start;
      flex-flow: column;
    }

    form .inputs-wrapper label {
      font-size: 0.65vw;
      margin: 0px 0px 1px 3px;
    }

    form .inputs-wrapper input {
      font-size: 0.9vw;
      width: 75%;
      height: 80%;
      padding: 4px;
      border-radius: 3px;
      border: 1px solid #d3d3d3;
      color: #2f4f4f;
    }

    form .inputs-wrapper input.checkbox {
      justify-self: center;
      width: auto;
    }

    form .inputs-wrapper:first-child {
      justify-content: flex-start;
    }
  `]
})
export class FormBaseComponent {
  @Input() myForm: FormGroup
  @Input() inputsBase:any = []
  @Input() defaultValues:any = {}

  constructor(){}
  ngOnInit(){
    this.inputsBase.forEach((input:any) => {
      if(typeof this.defaultValues[input.name] !== 'undefined') {
        this.myForm.controls[input.name].setValue(this.defaultValues[input.name])
      } else {
        this.myForm.controls[input.name].setValue(null)
      }
    })
  }
}
