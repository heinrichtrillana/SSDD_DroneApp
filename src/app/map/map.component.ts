import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import { tileLayer, latLng, Layer, marker, icon } from 'leaflet';
import { CommandsService } from '../_services/commands.service';

import { Drone } from '../_models/drone.model';
import { interval } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges{


  @Input() drones : Drone[];

  public mapOptions =  {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 25, attribution: '...' })
    ],
    zoom: 15,
    center: latLng(40.3886441, -3.6295277)
  };

  markers: Layer[] = [];

  constructor(private _commands : CommandsService) {

    interval(1000).subscribe(() => {
      console.log('cghagbeu')
      this.drones.forEach( x =>{
        if(Math.random() > 0.5) {
          x.position.x = x.position.x + Math.random()/1000;
        }
        else x.position.y = x.position.y + Math.random()/1000;
      })

      this.setMarkers(this.drones);

      
    })

  }

  ngOnInit() {
    this.setMarkers(this.drones)
  }

  ngOnChanges(){
    
    console.log(
      "its changing"
    )
    this.markers = [];
    this.setMarkers(this.drones);
  }

  clickHandler( event ){
    this._commands.coordinates.next(event.latlng);
  }

  private setMarkers( drones : Drone[]){

    this.markers = drones.map( (drone : Drone) =>{

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

    console.log(this.markers);
  }

	removeMarker() {
		this.markers.pop();
	}

}
