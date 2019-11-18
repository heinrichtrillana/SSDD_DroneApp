import { Component } from '@angular/core';

import { Drone } from './_models/drone.model';
import { CommandsService } from './_services/commands.service';
import { interval } from 'rxjs';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Marker, marker, icon, Layer } from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hive-app';

  public drones : Drone[] = [];
  public markers : Layer[] = [];

  constructor( private _commands : CommandsService,
              private _mqttService : MqttService){

    this._mqttService.observe('swarm/+/pos').subscribe((message: IMqttMessage) => {
     
      this.setDrones( message )
      this.setMarkers();
    });
  }

  private setDrones( message : IMqttMessage){
    var drone = <any>JSON.parse(message.payload.toString());

      var cached_drone = this.drones.find( x => x.id == drone.drone)
      if(!cached_drone){
        this.drones.push({
          id: drone.drone,
          position : {
            x : drone.pos[0],
            y : drone.pos[1]
          },
          rotation : null,
          battery : null,
          rotor : null
        })
      }
      else{
        cached_drone.position = {
          x : drone.pos[0],
          y : drone.pos[1]
        }
      }
  }

  private setMarkers(){

    this.markers = this.drones.map( (drone : Drone) =>{

      return marker(
        [drone.position.x, drone.position.y],
        {
          icon: icon({
            iconSize: [ 25, 41 ],
            iconAnchor: [ 13, 41 ],
            iconUrl: 'assets/img/drone.png',
            shadowUrl: 'leaflet/marker-shadow.png'
          })        }
      )
    })
  }

}
