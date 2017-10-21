import { Component } from '@angular/core';

import { NgSimpleTableComponent, DataChangeRequest } from './ng-simple-table/ng-simple-table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Simple Table Example';
  exampleTableSettings: any;
  exampleTableData: any;
  dataChange: DataChangeRequest;

  constructor() {
    this.exampleTableSettings = {
      tableClass: 'table-class-example'
      , bottomEditAllRow: true
      , changeTextDelay: 500
      , changeAllTextDelay: 4000
      , emitDataChanges: true
      , columns: [
        {name: 'col1',
        display: 'Column 1',
        type: 'string',
        edit: true,
        maxWidth: 100}
        , {name: 'col2',
        display: 'Column 2 Test',
        type: 'string',
        edit: false,
        sortable: false,
        maxWidth: 100}
        , {name: 'col3',
        display: 'Checkbox Test',
        type: 'checkbox',
        edit: true,
        sortable: true,
        maxWidth: 100}
        , {name: 'col4',
        display: 'Dropdown Development',
        type: 'dropdown',
        edit: true,
        sortable: true,
        maxWidth: 100,
        dropdownOptions: {
            default: 'Pick something',
            options: [{
              display: 'Option 1',
              value: 'secret-magic'
            }, {
              display: 'Go home',
              value: 'opt2'
            }]
        }}
        , {name: 'htmlTest',
        display: 'HTML Test',
        type: 'html',
        edit: false,
        sortable: true,
        maxWidth: 150}
      ]
    };

    this.exampleTableData = [
      {
        col1: 'Test'
        , col2: 'Second Column, Row 1'
        , col3: {
          checked: true
          , display: 'Test Checkbox Display'
        }
        , col4: 'secret-magic'
        , htmlTest: '<strong>Test</strong>'
      },
      {
        ngSTRowId: '1234'
        , col1: 'Row2'
        , col2: 'Mary had a little lamb'
        , col3: {
          checked: false
          , display: 'This should be unchecked'
        }
        , col4: 'opt2'
        , htmlTest: '<strong>Test</strong>'
      },
      {
        col1: '3rd Row'
        , col2: '555'
        , col3: {
          checked: false
          , display: 'This should be unchecked'
        }
        , htmlTest: '<strong>Test</strong>'
      },
      {
        col1: 'Testing 4th Row'
        , col2: 'Additional Data!'
        , col3: {
          checked: false
          , display: 'This should be unchecked'
        }
        , htmlTest: '<strong>Test</strong>'
      },
      {
        col1: 'Row 5'
        , col2: 'Additional Data!'
        , col3: {
          checked: false
          , display: 'This should be unchecked'
        }
      },
      {
        col1: 'Row 6'
        , col2: 'Additional Data!'
        , col3: {
          checked: false
          , display: 'This should be unchecked'
        }
      },
      {
        col1: 'Row 7'
        , col2: 'Additional Data!'
        , col3: {
          checked: false
          , display: 'This should be unchecked'
        }
        , htmlTest: '<strong>Test</strong>'
      },
      {
        col1: 'Row 8'
        , col2: 'Additional Data!'
        , col3: {
          checked: false
          , display: 'This should be unchecked'
        }
      },
      {
        col1: 'Row 9'
        , col2: 'Additional Data!'
        , col3: {
          checked: false
          , display: 'This should be unchecked'
        }
      },
      {
        col1: 'Row 10'
        , col2: 'Additional Data!'
        , col3: {
          checked: false
          , display: 'This should be unchecked'
        }
      },
      {
        col1: 'Row 11'
        , col2: 'Additional Data!'
        , col3: {
          checked: false
          , display: 'This should be unchecked'
        }
      },
      {
        col1: 'Row 12'
        , col2: 'Additional Data!'
        , col3: {
          checked: false
          , display: 'This should be unchecked'
        }
      },
      {
        col1: 'Row 13'
        , col2: 'Additional Data!'
        , col3: {
          checked: false
          , display: 'This should be unchecked'
        }
      }
    ];
  }

  captureDataChange(event) {
    this.dataChange = event;
    console.log(this.dataChange);
  }

}
