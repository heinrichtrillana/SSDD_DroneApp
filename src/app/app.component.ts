import { Component } from '@angular/core';

import { Drone } from './_models/drone.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hive-app';

  public drones : Drone[] = [];

  constructor(){
    console.log("Holaaa");

    this.drones.push({
      id : 'Dron de prueba',
      position : { 
        x: 33,
        y: 99
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
      position : null,
      rotation : null,
      battery : null,
      rotor : null
    })

    console.log(this.drones);
  }


}
