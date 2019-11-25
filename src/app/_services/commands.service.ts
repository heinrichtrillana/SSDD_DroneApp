import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LatLng } from 'leaflet';

import {Operation} from '../_models/operation.model'
import { MqttService, IMqttMessage } from 'ngx-mqtt';
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

    var msg = {
              obj :[coordinates.lat,coordinates.lng]
              } 

    this._mqttService.unsafePublish('swarm/' + droneId + '/objective', JSON.stringify(msg) , {qos: 1, retain: false});
    this.selectedOperation = null;
    this.selectedDrone = null;      

  }

  private LINE( coordinates : LatLng){

    console.log("Forming line at " + coordinates.lng);

    const separation = 0.002;

    this.drones.forEach( (x,i) =>{

      var msg = {
                  obj :[coordinates.lat,coordinates.lng + (i)*separation]
                }
                
      this._mqttService.unsafePublish('swarm/' + x.id + '/objective', JSON.stringify(msg) , {qos: 1, retain: false});

    })
    this.selectedOperation = null;
    this.selectedDrone = null;      

  }

  private COLUMN( coordinates : LatLng){
    console.log("Forming column at " + coordinates.lat);

    const separation = 0.002;

    this.drones.forEach( (x,i) =>{

      var msg = {
                  obj :[coordinates.lat - (i)*separation ,coordinates.lng]
                }
                
      this._mqttService.unsafePublish('swarm/' + x.id + '/objective', JSON.stringify(msg) , {qos: 1, retain: false});

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
		    obj: [coordinates.lat + Math.cos((i)*angle)*separation, coordinates.lng + Math.sin((i)*angle)*separation]
		  }

      this._mqttService.unsafePublish('swarm/' + x.id + '/objective', JSON.stringify(msg) , {qos: 1, retain: false});
    })

    this.selectedOperation = null;
    this.selectedDrone = null;      

  }
  private SWEEP( coordinates : LatLng){
    let origin = this.drones[0].position;
    
    console.log("SWEEP FROM (" + origin.x + ", " + origin.y + ") TO " + coordinates.toString());

    const separation = 0.002;

    this.drones.forEach( (x,i) =>{

      var msg = {
                  obj :[origin.x - (i)*separation ,origin.y]
                }
                
      this._mqttService.unsafePublish('swarm/' + x.id + '/objective', JSON.stringify(msg) , {qos: 1, retain: false});

    })

    var arrived = new Promise( (resolve) => {
      let ok = 0;

      this.drones.forEach( (x,i) =>{
        this._mqttService.observe('swarm/' + x.id + '/position').subscribe((message: IMqttMessage) =>{
	  
	  var drone = <any>JSON.parse(message.payload.toString());

	  if( (drone.pos[0] == (origin.x-(i)*separation)) && (drone.pos[1] == origin.y)){
	    ok = ok + 1;
	  }else{
	    ok = 0;
          }

	  if( ok == this.drones.length)
	    resolve();
	});
      });
    });
 
    arrived.then(()=>{
      this.drones.forEach( (x,i) =>{

        var msg = {
                    obj :[coordinates.lat - (i)*separation ,coordinates.lng]
                  }
                
        this._mqttService.unsafePublish('swarm/' + x.id + '/objective', JSON.stringify(msg) , {qos: 1, retain: false});

      })
    });

      this.selectedOperation = null;
      this.selectedDrone = null;      

  }
}
