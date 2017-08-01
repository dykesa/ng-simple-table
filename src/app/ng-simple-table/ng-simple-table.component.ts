import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TableSettings, ColumnSettings, SortInfo } from './lib/table-settings';

import { FilterBoxComponent } from './filter-box/filter-box.component';

@Component({
  selector: 'app-ng-simple-table',
  templateUrl: './ng-simple-table.component.html',
  styleUrls: ['./ng-simple-table.component.css', './lib/font-awesome-4.7.0/css/font-awesome.min.css']
})
export class NgSimpleTableComponent implements OnInit, OnChanges {

  @Input() settings: any;
  @Input() data: any;
  @Input() functionObject: any;
  tableSettings: TableSettings;
  tableData: any[];
  tsLoaded = false;
  tdLoaded = false;
  renderReady = false;
  filterValues: string[];

  constructor() {
    this.tableSettings = new TableSettings();
    this.filterValues = [];
   }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['settings']) {
      this.loadTableSettings();
      this.checkRenderReady();
    }
    if (changes['data']) {
      this.loadTableData();
      this.checkRenderReady();
    }
  }

  checkRenderReady() {
    if (this.tsLoaded === true && this.tdLoaded === true) {this.renderReady = true; console.log('Ready to render'); }
  }

  loadTableSettings() {
    // Set defaults for some table settings if they weren't set by the user
    if (this.settings.displayHeaders === undefined || (this.settings.displayHeaders !== false && this.settings.displayHeaders !== true)) {
      // displayHeaders was undefined or some invalid value
      this.tableSettings.displayHeaders = true;
    } else {
      this.tableSettings.displayHeaders = this.settings.displayHeaders;
    }
    if (this.settings.tableClass !== undefined && typeOf(this.settings.tableClass) === 'string') {
      this.tableSettings.tableClass = this.settings.tableClass;
    }
    let colCount = 0;
    this.settings.columns.forEach(col => {
      // column must have a name
      if (col.name !== undefined) {
        colCount++;
        let tempCol = new ColumnSettings();
        tempCol.name = col.name;
        if (col.display === undefined) {
          tempCol.display = '';
        } else {
          tempCol.display = col.display;
        }
        // Options are "string" or "checkbox"
        if (col.type === undefined || col.type !== 'checkbox') {
          tempCol.type = 'string';
        } else {
          tempCol.type = col.type;
        }
        if (col.edit === undefined || (col.edit !== false && col.edit !== true)) {
          tempCol.edit = false;
        } else {
          tempCol.edit = col.edit;
        }
        if (col.visible === undefined || (col.visible !== false && col.visible !== true)) {
          tempCol.visible = true;
        } else {
          tempCol.visible = col.visible;
        }
        if (col.sortable === undefined || (col.sortable !== false && col.sortable !== true)) {
          tempCol.sortable = true;
        } else {
          tempCol.sortable = col.sortable;
        }
        tempCol.filterKey = 'ngstf' + col.name;
        tempCol.sortSettings = new SortInfo();
        tempCol.order = colCount;
        this.tableSettings.columns.push(tempCol);
      }
    });
    if (this.tableSettings.columns.length !== 0) {
      this.tsLoaded = true;
    }

  }

  loadTableData() {
    if (typeOf(this.data) === 'array') {
      this.tableData = [];
      // Add original sort order number to data passed in
      let i = 0;
      this.data.forEach(rowIn => {
        i++;
        rowIn.ngSToso = i;
        // Should a row be displayed
        rowIn.ngSTdisp = true;
        this.tableData.push(rowIn);
      });
      this.tableData = this.data;
      this.tdLoaded = true;
    }
  }

  sortClick(colName: string) {
    // Cycle goes unsort/asc/desc

    /******
     * This section of code only handles the visual aspect of the sorting
     *****/
    // Capture the current sort of the column passed in, set all columns to unsorted, then fix the column passed in
    const currentSort = this.tableSettings.columns.find(col => col.name === colName).sortSettings.sort;
    let newSort: string;
    newSort = 'unsort';
    this.tableSettings.columns.forEach( col => col.sortSettings.sort = 'unsort');
    if (currentSort === 'unsort') {
      newSort = 'asc';
      this.tableSettings.columns.find(col => col.name === colName).sortSettings.sort = 'asc';
    } else if (currentSort === 'asc') {
      newSort = 'desc';
      this.tableSettings.columns.find(col => col.name === colName).sortSettings.sort = 'desc';
    }

    // Sort
    const colIndex = this.tableSettings.columns.findIndex( col => col.name === colName);
    if (newSort === 'unsort') {
      // Just set the data equal to the original data pull (This may not always work...
      //      after a user starts modifying dropdowns and comments, etc. ) Should probably modify this later
      sortMDArrayByColumn(this.tableData, 'ngSToso', 'asc');
    } else {
      sortMDArrayByColumn(this.tableData, colName, newSort);
    }
  }

  filterChange(event, colName: string) {
    // Don't worry about shift keys
    if (event.keyCode === 16) { return; }
    const filterText = event.srcElement.value;
    let filterRegEx = new RegExp('.*?', 'gi');
    if (filterText !== '' && filterText !== null) {
      filterRegEx = new RegExp(filterText, 'gi');
    }
    this.tableData.forEach( row => {
      const colVal: string = row[colName];
      if (colVal !== undefined && colVal !== null) {
        if (colVal.match(filterRegEx) !== null) {
          row.ngSTdisp = true;
        } else {
          row.ngSTdisp = false;
        }
      }
    });
  }

}

function typeOf (obj) {
  return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
}

function sortMDArrayByColumn(ary, sortColumn, direction) {
    // Taken from https://stackoverflow.com/a/40389265 and modified

    // Adds a sequential number to each row of the array
    // This is the part that adds stability to the sort
    for (let x = 0; x < ary.length; x++) {ary[x].index = x; }
    if (direction === 'asc') {
      ary.sort(function(a, b){
          if (a[sortColumn] > b[sortColumn]) {return 1; }
          if (a[sortColumn] < b[sortColumn]) {return -1; }
          if (a.index > b.index) {
              return 1;
          }
          return -1;
      });
    } else if (direction === 'desc') {
      ary.sort(function(a, b){
          if (a[sortColumn] < b[sortColumn]) {return 1; }
          if (a[sortColumn] > b[sortColumn]) {return -1; }
          if (a.index > b.index) {
              return 1;
          }
          return -1;
      });
    }
}
