import { Component, OnInit, Input } from '@angular/core';
import { Drone } from '../_models/drone.model';

@Component({
  selector: 'app-pannel',
  templateUrl: './pannel.component.html',
  styleUrls: ['./pannel.component.css']
})
export class PannelComponent implements OnInit {

  @Input() drones : Drone[];

  constructor() { }

  ngOnInit() {
  }

  batteryIcon( percentage : number){

    var resul = '';
    let none = 'battery-slash'

    switch( true ){
      case percentage > 75 : 
            resul = 'battery-full'; 
            break;
      case percentage > 50 : 
            resul = 'battery-three-quarters'; 
            break;
      case percentage > 25 :
            resul = 'battery-half';
            break;
      case percentage > 0 :
          resul = 'battery-quarter'; 
          break;
      default: 
            resul = 'battery-empty'
        break;
    } 
    return resul;
  }

}
