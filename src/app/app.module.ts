import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { LeafletModule } from "@asymmetrik/ngx-leaflet";

import { AngularFontAwesomeModule } from "angular-font-awesome";

import { AppComponent } from "./app.component";
import { MapComponent } from "./map/map.component";
import { PannelComponent } from "./pannel/pannel.component";

import {
  MqttModule,
  IMqttServiceOptions
} from 'ngx-mqtt';
import { GrowlModule } from 'ngx-growl';


export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'localhost',
  port: 8080,
  path: ''
};

@NgModule({
  declarations: [AppComponent, MapComponent, PannelComponent],
  imports: [BrowserModule, LeafletModule.forRoot(), AngularFontAwesomeModule,MqttModule.forRoot(MQTT_SERVICE_OPTIONS), GrowlModule.forRoot({maxMessages: 1, displayTimeMs: 4000})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
