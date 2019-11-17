import { Component, OnInit, Input } from '@angular/core';
import { Drone } from '../_models/drone.model';
import { CommandsService } from '../_services/commands.service';

import {Operation} from '../_models/operation.model'

@Component({
  selector: 'app-pannel',
  templateUrl: './pannel.component.html',
  styleUrls: ['./pannel.component.css']
})
export class PannelComponent implements OnInit {

  @Input() drones : Drone[];

  constructor(private _commands : CommandsService) { }

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

  goTo( droneId : string ){
    this._commands.selectedDrone = droneId;
    this._commands.selectedOperation = Operation.GOTO;
  }

  private formLine(){
    this._commands.selectedOperation = Operation.LINE;
  }

  private formColumn(){
    this._commands.selectedOperation = Operation.COLUMN;
  }

  private formCircle(){
    this._commands.selectedOperation = Operation.CIRCLE;
  }
  private sweep(){
    this._commands.selectedOperation = Operation.SWEEP;
  }

}
