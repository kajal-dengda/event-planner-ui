import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app';
import { LoginComponent } from './components/login/login';
import { MyEventsComponent } from './components/my-events/my-events';
import { PublicEventsComponent } from './components/public-events/public-events';
import { EventFormComponent } from './components/event-form/event-form';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MyEventsComponent,
    PublicEventsComponent,
    EventFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
