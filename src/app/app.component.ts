import { Component } from '@angular/core';

import { Drone } from './_models/drone.model';
import { CommandsService } from './_services/commands.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hive-app';

  public drones : Drone[] = [];

  constructor( private _commands : CommandsService ){

    console.log("Holaaa");

    this.drones.push({
      id : 'Dron de prueba',
      position : { 
        x: 40.397874,
        y: -3.649002
      },
      rotation : {
        roll: 1,
        pitch : 2,
        yaw : 3
      },
      battery : 60,
      rotor : [
        { state : true},
        { state : true},
        { state : true},
        { state : true}
      ]
    })

    this.drones.push({
      id : 'Dron de prueba',
      position : {
        x : 40.384833,
        y : -3.615731
      },
      rotation : null,
      battery : null,
      rotor : null
    })
  }


}
