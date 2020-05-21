import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ParticipantsComponent } from './participants/Participants.component';

import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = {
    url: 'http://localhost:3000',
    options: {}
};

@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    ParticipantsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TooltipModule,
    ButtonModule,
    InputTextModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
