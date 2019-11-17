import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LatLng } from 'leaflet';

import {Operation} from '../_models/operation.model'

@Injectable({
  providedIn: 'root'
})
export class CommandsService {

  public selectedOperation : Operation; //Operacion
  public selectedDrone : string; //Identificador del dron en caso de operaciones individuales.

  public coordinates : BehaviorSubject<LatLng> //Coordenadas de la operacion

  constructor() { 
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
          this.selectedOperation = null;
          this.selectedDrone = null;      
          break;
    }

  }

  private GOTO( droneId : string, coordinates : LatLng){
    console.log( droneId + " Going to " + coordinates.toString());

    this.selectedOperation = null;
    this.selectedDrone = null;      

  }

  private LINE( coordinates : LatLng){
    console.log("Forming line at " + coordinates.lng);

    this.selectedOperation = null;
    this.selectedDrone = null;      

  }

  private COLUMN( coordinates : LatLng){
    console.log("Forming column at " + coordinates.lat);

    this.selectedOperation = null;
    this.selectedDrone = null;      

  }

  private CIRCLE( coordinates : LatLng){
    console.log("Forming circkle at " + coordinates.toString());

    this.selectedOperation = null;
    this.selectedDrone = null;      

  }
  private SWEEP( coordinates : LatLng){
    console.log("SWEEP FROM " + coordinates.toString());

    this.selectedOperation = null;
    this.selectedDrone = null;      

  }
}
