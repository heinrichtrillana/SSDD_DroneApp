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


  @Input() markers : Layer[];

  public mapOptions =  {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 25, attribution: '...' })
    ],
    zoom: 15,
    center: latLng(40.3886441, -3.6295277)
  };


  constructor(private _commands : CommandsService) {}

  ngOnInit() {
  }

  ngOnChanges(){
  }

  clickHandler( event ){
    this._commands.coordinates.next(event.latlng);
  }
}