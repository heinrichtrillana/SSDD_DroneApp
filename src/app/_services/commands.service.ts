import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LatLng } from 'leaflet';

import {Operation} from '../_models/operation.model'
import { MqttService } from 'ngx-mqtt';
import { Drone } from '../_models/drone.model';

@Injectable({
  providedIn: 'root'
})
export class CommandsService {

  public selectedOperation : Operation; //Operacion
  public selectedDrone : string; //Identificador del dron en caso de operaciones individuales.
  
  public drones : Drone[] = [];

  public coordinates : BehaviorSubject<LatLng> //Coordenadas de la operacion

  constructor(private _mqttService : MqttService) { 
    this.coordinates = new BehaviorSubject<LatLng>(null);

    this.coordinates.subscribe( coord => this.handleOperation( coord )); 
    //Cuando llega un click en el mapa, si hay operacion seleccionada, se ejecuta la misma.
  }

  private handleOperation( coord : LatLng){

    switch(this.selectedOperation){
      case Operation.GOTO : 
          this.GOTO( this.selectedDrone, coord)
          break;
      case Operation.LINE : 
          this.LINE(coord)
          break;
      case Operation.COLUMN : 
          this.COLUMN(coord)
          break;
      case Operation.CIRCLE : 
          this.CIRCLE(coord)
          break;
      case Operation.SWEEP : 
          this.SWEEP(coord)
          break;
      default:
          this.drones = null;
          this.selectedOperation = null;
          this.selectedDrone = null;      
          break;
    }

  }

  private GOTO( droneId : string, coordinates : LatLng){
    console.log( droneId + " Going to " + coordinates.toString());

    var msg = {topic:"./obj",
              obj :[coordinates.lat,coordinates.lng]} 

    this._mqttService.unsafePublish('swarm/' + droneId + '/obj', JSON.stringify(msg) , {qos: 1, retain: false});
    this.selectedOperation = null;
    this.selectedDrone = null;      

  }

  private LINE( coordinates : LatLng){

    console.log("Forming line at " + coordinates.lng);

    const separation = 0.005;

    this.drones.forEach( (x,i) =>{

      var msg = {
                  topic:"./obj",
                  obj :[coordinates.lat,coordinates.lng + (i)*separation]
                }
                
      this._mqttService.unsafePublish('swarm/' + x.id + '/obj', JSON.stringify(msg) , {qos: 1, retain: false});

    })
    this.selectedOperation = null;
    this.selectedDrone = null;      

  }

  private COLUMN( coordinates : LatLng){
    console.log("Forming column at " + coordinates.lat);

    const separation = 0.005;

    this.drones.forEach( (x,i) =>{

      var msg = {
                  topic:"./obj",
                  obj :[coordinates.lat + (i)*separation ,coordinates.lng]
                }
                
      this._mqttService.unsafePublish('swarm/' + x.id + '/obj', JSON.stringify(msg) , {qos: 1, retain: false});

    })


    this.selectedOperation = null;
    this.selectedDrone = null;      

  }

  private CIRCLE( coordinates : LatLng){
    console.log("Forming circkle at " + coordinates.toString());

    const separation = 0.002;
    const angle = (2*Math.PI)/this.drones.length;

    this.drones.forEach( (x,i) =>{

	var msg = {
		    topic:"./obj",
		    obj: [coordinates.lat + Math.cos((i)*angle)*separation, coordinates.lng + Math.sin((i)*angle)*separation]
		  }

      this._mqttService.unsafePublish('swarm/' + x.id + '/obj', JSON.stringify(msg) , {qos: 1, retain: false});
    })

    this.selectedOperation = null;
    this.selectedDrone = null;      

  }
  private SWEEP( coordinates : LatLng){
    console.log("SWEEP FROM " + coordinates.toString());

    this.selectedOperation = null;
    this.selectedDrone = null;      

  }
}
