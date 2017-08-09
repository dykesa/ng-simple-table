import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TableSettings, ColumnSettings, SortInfo, Dropdown, DrpdwnOption } from './lib/table-settings';

@Component({
  selector: 'app-ng-simple-table',
  templateUrl: './ng-simple-table.component.html',
  styleUrls: ['./ng-simple-table.component.css', './lib/font-awesome-4.7.0/css/font-awesome.min.css']
})
export class NgSimpleTableComponent implements OnInit, OnChanges {

  @Input() settings: any;
  @Input() data: any;
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
    if (this.tsLoaded === true && this.tdLoaded === true) {this.renderReady = true; }
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
        // Add a blank filter to that column
        this.filterValues[col.name] = null;
        colCount++;
        let tempCol = new ColumnSettings();
        tempCol.name = col.name;
        if (col.display === undefined) {
          tempCol.display = '';
        } else {
          tempCol.display = col.display;
        }
        // Options are "string" (default), "checkbox", or "dropdown"
        if (col.type === undefined && col.type !== 'checkbox' && col.type !== 'dropdown') {
          tempCol.type = 'string';
        } else {
          tempCol.type = col.type;
          if (col.type === 'dropdown') {
            let dropdown = new Dropdown;
            dropdown.options = [];
            col.dropdownOptions.default === undefined ?
              dropdown.default = 'Select an option' : dropdown.default = col.dropdownOptions.default;
            col.dropdownOptions.options.forEach(option => {
              let drpOption = new DrpdwnOption;
              drpOption.display = option.display;
              drpOption.value = option.value;
              dropdown.options.push(drpOption);
            });
            tempCol.dropdownOptions = dropdown;
          }
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
        if (col.maxWidth !== undefined) {
          tempCol.maxWidth = col.maxWidth;
        }
        // If filtering enabled, setup blank array
        if (this.tableSettings.filterRow === true) {
          this.filterValues[col.name] = null;
        }
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
      const colType = this.tableSettings.columns.find(col => col.name === colName).type;
      if (colType === 'checkbox') {
        sortMDArrayByColumn(this.tableData, colName, newSort, 'checked');
      } else {
        // For String/the default
        sortMDArrayByColumn(this.tableData, colName, newSort);
      }
    }
  }

  filterTypeCapture(event, colName: string) {
    // Don't worry about shift keys
    if (event.keyCode === 16) { return; }
    // Grab the element so late it can be cleared
    const filterText = event.srcElement.value;
    this.filterChange(filterText, colName);
  }

  filterChange(filterText, colName: string) {
    // First capture the filter
    this.filterValues[colName] = filterText;
    let filterRegEx: RegExp;
    this.tableData.forEach( row => {
      row.ngSTdisp = true;
    });
    // On any key in the filterValues, filter the appropriate column for that value
    for (let key in this.filterValues) {
      if (this.filterValues[key] !== '' && this.filterValues[key] !== null) {
        filterRegEx = new RegExp(this.filterValues[key], 'gi');
        this.tableData.forEach(row => {
          let keyType = this.tableSettings.columns.find(cs => cs.name === key).type;
          if (keyType === 'string') {
            if (row[key].match(filterRegEx) === null) { row.ngSTdisp = false; }
          } else if (keyType === 'checkbox') {
            if (row[key].display.match(filterRegEx) === null) { row.ngSTdisp = false; }
          }
        });
      }
    }
  }

  clearFilter(colName) {
    this.filterChange(null, colName);
  }

  textChange(event, rowNum: number, colName: string) {
    // Don't worry about shift keys
    if (event.keyCode === 16) { return; }
    // Grab the element so late it can be cleared
    const textArea = event.srcElement;
    const textValue = event.srcElement.value;
    this.tableData[rowNum][colName] = textValue;
  }

  checkboxChange(event, rowNum: number, colName: string) {
    const newValue = event.srcElement.checked;
    this.tableData[rowNum][colName].checked = newValue;
  }

  dropdownChange(event, rowNum, colName) {
    const newValue = event.srcElement.value;
    newValue === '' ? this.tableData[rowNum][colName] = undefined : this.tableData[rowNum][colName] = newValue;
  }

}

function typeOf (obj) {
  return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
}

function sortMDArrayByColumn(ary, sortColumn, direction, subColumn?) {
    // Taken from https://stackoverflow.com/a/40389265 and modified

    // Adds a sequential number to each row of the array
    // This is the part that adds stability to the sort
    for (let x = 0; x < ary.length; x++) {ary[x].index = x; }
    if (direction === 'asc') {
      ary.sort(function(a, b){
        if (subColumn === undefined) {
          if (a[sortColumn] > b[sortColumn]) {return 1; }
          if (a[sortColumn] < b[sortColumn]) {return -1; }
          if (a.index > b.index) {
              return 1;
          }
          return -1;
        } else {
          if (a[sortColumn][subColumn] > b[sortColumn][subColumn]) {return 1; }
          if (a[sortColumn][subColumn] < b[sortColumn][subColumn]) {return -1; }
          if (a.index > b.index) {
              return 1;
          }
          return -1;
        }
      });
    } else if (direction === 'desc') {
      ary.sort(function(a, b){
        if (subColumn === undefined) {
          if (a[sortColumn] < b[sortColumn]) {return 1; }
          if (a[sortColumn] > b[sortColumn]) {return -1; }
          if (a.index > b.index) {
              return 1;
          }
          return -1;
        } else {
          if (a[sortColumn][subColumn] < b[sortColumn][subColumn]) {return 1; }
          if (a[sortColumn][subColumn] > b[sortColumn][subColumn]) {return -1; }
          if (a.index > b.index) {
              return 1;
          }
          return -1;
        }
      });
    }
}
