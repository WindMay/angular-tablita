import { Component } from '@angular/core';
import {RecipesService} from "./services/recipes.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public recipes:any=[]
  public options:any={}
  public tableMessages:any=[]
  public timer:any
  constructor(private recipesService:RecipesService){}
  ngOnInit(){
    this.options={
      debug: true,
      blankLabel: 'n/a',
      outer_form: 'both',
      add:{
        display:true,
        caption: 'both',// head, title, both
        show: false
      },
      editable: {
        display: true,
        show: true,
        delete: true,
        batch: false,
      },
      columns:[
        {
          name: "Nombre",
          type: 'string',
          validators:{
            required: false,
            min: 2,
            max: 50
          }
        },
        {
          calories: "Calorias",
          type: 'string',
          validators:{
            required: false,
            min: 2,
            pattern: "^(0|[1-9][0-9]*\w*kcal)$"
          }
        },
        {
          carbos: "Carbohidratos",
          type: 'string',
          validators:{
            required: false
          }
        },
        {
          favorites: "Favoritos",
          type: 'number',
          validators:{
            required: false,
            min: 0,
            max: 20
          }
        },
        {dressing: "Aderezo", type: 'boolean'}
      ]
    }
    this.recipesService
      .get('./assets/recipes.json')
      .then(result=>this.recipes=result)
      .catch(error => console.log(error))
  }
  toggleOption(option:any):void{
    option!=option
  }
  updateMesage(event:any){
    if(this.tableMessages.length>0){
      this.timer.unsubscribe()
    }
    this.tableMessages.push(event)
    this.timer=Observable.interval(3000).subscribe(() => {
      this.tableMessages=[]
      this.timer.unsubscribe()
    })
    console.log(event)
  }
}
