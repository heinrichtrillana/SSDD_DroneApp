import { Component } from '@angular/core';

import { Drone } from './_models/drone.model';
import { CommandsService } from './_services/commands.service';
import { interval } from 'rxjs';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Marker, marker, icon, Layer } from 'leaflet';

import {GrowlModule, GrowlService} from 'ngx-growl';

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
              private _mqttService : MqttService,
              private growlService: GrowlService){


    this._mqttService.observe('swarm/+/position').subscribe((message: IMqttMessage) => {
      this.setDrones( message )
      this.setMarkers();
    });

    this._mqttService.observe('swarm/+/status').subscribe((message : IMqttMessage) => {
      this.setStatus( message );
      this.checkStatus( message )
    })

    this._mqttService.observe('swarm/lw').subscribe((message : IMqttMessage) => {


      this.growlService.addError({heading: 'ERROR' , message: message.payload.toString()});

    })
  }

  private setStatus( message : IMqttMessage){
    var drone = <any>JSON.parse(message.payload.toString());
    var cached_drone = this.drones.find( x => x.id == drone.drone)

    if( cached_drone ){
      cached_drone.battery = drone.battery;
      cached_drone.rotation = drone.rotation;
      cached_drone.rotor = [
        {state : drone.rotors[0]},
        {state : drone.rotors[1]},
        {state : drone.rotors[2]},
        {state : drone.rotors[3]},
      ]
    }
  }

  private checkStatus(message : IMqttMessage) {
    
    var drone = <any>JSON.parse(message.payload.toString());

    //Mensajes de alerta.
    if( drone.battery < 25) {
      this.growlService.addWarn({heading: drone.drone , message: 'Attention, low battery.'});
    }

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
