import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NgSimpleTableComponent } from './ng-simple-table/ng-simple-table.component';

@NgModule({
  declarations: [
    AppComponent,
    NgSimpleTableComponent
  ],
  imports: [
    BrowserModule
    , FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
