import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { LeafletModule } from "@asymmetrik/ngx-leaflet";

import { AngularFontAwesomeModule } from "angular-font-awesome";

import { AppComponent } from "./app.component";
import { MapComponent } from "./map/map.component";
import { PannelComponent } from "./pannel/pannel.component";

@NgModule({
  declarations: [AppComponent, MapComponent, PannelComponent],
  imports: [BrowserModule, LeafletModule.forRoot(), AngularFontAwesomeModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
