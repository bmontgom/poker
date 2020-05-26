import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ItemListComponent } from './item-list/item-list.component';
import { UsersComponent } from './users/users.component';

import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = {
    // url: '192.168.1.97:3000',
    url: 'http://ec2-54-166-39-120.compute-1.amazonaws.com:3000',
    options: {
        transports: ['websocket'],
        upgrade: false
    }
};

@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TooltipModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
