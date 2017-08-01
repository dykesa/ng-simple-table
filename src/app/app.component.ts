import { Component } from '@angular/core';

import { NgSimpleTableComponent } from './ng-simple-table/ng-simple-table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Simple Table Example';
  exampleTableSettings: any;
  exampleTableData: any;

  constructor() {
    this.exampleTableSettings = {
      tableClass: 'table-class-example'
      , columns: [
        {name: 'col1',
        display: 'Column 1',
        type: 'string',
        edit: false}
        , {name: 'col2',
        display: 'Column 2 Test',
        type: 'string',
        edit: false,
        sortable: false}
      ]
    };

    this.exampleTableData = [
      {
        col1: 'Test'
        , col2: 'Second Column, Row 1'
      },
      {
        ngSTRowId: '1234'
        , col1: 'Row2'
        , col2: 'Mary had a little lamb'
      },
      {
        col1: '3rd Row'
        , col2: '555'
      },
      {
        col1: 'Testing 4th Row'
        , col2: 'Additional Data!'
      },
      {
        col1: 'Row 5'
        , col2: 'Additional Data!'
      },
      {
        col1: 'Row 6'
        , col2: 'Additional Data!'
      },
      {
        col1: 'Row 7'
        , col2: 'Additional Data!'
      },
      {
        col1: 'Row 8'
        , col2: 'Additional Data!'
      },
      {
        col1: 'Row 9'
        , col2: 'Additional Data!'
      },
      {
        col1: 'Row 10'
        , col2: 'Additional Data!'
      },
      {
        col1: 'Row 11'
        , col2: 'Additional Data!'
      },
      {
        col1: 'Row 12'
        , col2: 'Additional Data!'
      },
      {
        col1: 'Row 13'
        , col2: 'Additional Data!'
      }
    ];
  }

  testAlert(displayText: string) {
    console.log(displayText);
  }


}
