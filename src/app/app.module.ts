import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgSimpleTableComponent } from './ng-simple-table/ng-simple-table.component';
import { FilterBoxComponent } from './ng-simple-table/filter-box/filter-box.component';

@NgModule({
  declarations: [
    AppComponent,
    NgSimpleTableComponent,
    FilterBoxComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
