import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/Forms';

import { AppComponent } from './app.component';
import { ServerService } from './services/serverService';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,

    
    

  ],
  providers: [ServerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
