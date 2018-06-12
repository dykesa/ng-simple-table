import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NgSimpleTableComponent } from './ng-simple-table/ng-simple-table.component';
import { DisplayFilterPipe } from './ng-simple-table/lib/display-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NgSimpleTableComponent,
    DisplayFilterPipe
  ],
  imports: [
    BrowserModule
    , FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
