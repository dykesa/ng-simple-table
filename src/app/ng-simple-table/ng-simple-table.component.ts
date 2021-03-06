import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { TableSettings, ColumnSettings, SortInfo, Dropdown, DrpdwnOption } from './lib/table-settings';

@Component({
  selector: 'app-ng-simple-table',
  templateUrl: './ng-simple-table.component.html',
  styleUrls: ['./ng-simple-table.component.css', './lib/fontello/css/fontello.min.css']
})
export class NgSimpleTableComponent implements OnInit, OnChanges {

  @Input() settings: TableSettings;
  @Input() data: any;
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  tableSettings: TableSettings;
  tsLoaded = false;
  tdLoaded = false;
  renderReady = false;
  filterValues: string[];
  timeoutHandles: any[][];
  allElements: any[];             // ngModels for "all" row
  pageInfo: PageInfo;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.tableSettings = new TableSettings();
    this.filterValues = [];
    this.timeoutHandles = [];
    this.allElements = [];
    this.pageInfo = new PageInfo();
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
    if (this.tsLoaded === true && this.tdLoaded === true) {
      // Setup timout handlers array
      this.tableSettings.columns.forEach(c => {
        if (c.type === 'string' || c.type === undefined || (c.type !== 'checkbox' && c.type !== 'dropdown' && c.type !== 'html')) {
          this.timeoutHandles[c.name] = [];
        }
      });
      this.calculatePagingInfo();
      this.renderReady = true;
    }
  }

  calculatePagingInfo() {
    if (this.tableSettings.maxDisplayRows !== null) {
      this.pageInfo.calculatePageInfo(this.data.length, this.tableSettings.maxDisplayRows);
    } else {
      this.pageInfo = new PageInfo();
    }
  }

  gotoPage(pageNumber: number) {
    if (pageNumber === undefined || pageNumber === null || pageNumber < 1) {
      // Undefined, null, 0, or negative -> just go to page 1
      this.pageInfo.pageOffset = 1;
    } else {
      if (pageNumber > this.pageInfo.numberPages) {
        // Page over the avialable number of pages, set to last page
        this.pageInfo.pageOffset = this.pageInfo.numberPages;
      } else {
        // something valid passed in, set current page offset to passed in page number
        this.pageInfo.pageOffset = pageNumber;
      }
    }
    this._changeDetectorRef.detectChanges();
  }

  // dispRowFilter(): Array<any> {
  //   let returnArr = [];

  //   // Return an array of all displayed rows
  //   returnArr = this.data.filter(dr => dr.ngSTdisp === true);
  //   if (returnArr === undefined) {
  //     // If no values are displayed, just return the data array
  //     returnArr = [];
  //   }
  //   console.log(returnArr);

  //   return returnArr;
  // }

  loadTableSettings() {
    // Set defaults for some table settings if they weren't set by the user
    if (this.settings.displayHeaders !== undefined && (this.settings.displayHeaders === false || this.settings.displayHeaders === true)) {
      this.tableSettings.displayHeaders = this.settings.displayHeaders;
    }
    if (this.settings.tableClass !== undefined) {
      this.tableSettings.tableClass = this.settings.tableClass;
    }
    if (this.settings.bottomEditAllRow !== undefined &&
        (this.settings.bottomEditAllRow === false || this.settings.bottomEditAllRow === true)) {
      this.tableSettings.bottomEditAllRow = this.settings.bottomEditAllRow;
    }
    if (this.settings.changeTextDelay !== undefined) { this.tableSettings.changeTextDelay = this.settings.changeTextDelay; }
    if (this.settings.changeAllTextDelay !== undefined) { this.tableSettings.changeAllTextDelay = this.settings.changeAllTextDelay; }
    if (this.settings.emitDataChanges !== undefined) { this.tableSettings.emitDataChanges = this.settings.emitDataChanges; }
    if (this.settings.maxDisplayRows !== undefined) { this.tableSettings.maxDisplayRows = this.settings.maxDisplayRows; }
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
        if (col.type === undefined && col.type !== 'checkbox' && col.type !== 'dropdown' && col.type !== 'html') {
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
        if (col.maxWidth !== undefined || col.type === 'html') {
          // for html types, table gets a little funky if there is no maxwidth
          if (col.type === 'html' && col.maxWidth === undefined) {
            tempCol.maxWidth = 200;
          } else {
            tempCol.maxWidth = col.maxWidth;
          }
        }
        // If filtering enabled, setup blank array
        if (this.tableSettings.filterRow === true) {
          this.filterValues[col.name] = null;
        }
        tempCol.sortSettings = new SortInfo();
        tempCol.order = colCount;
        // If bottom edit all row is enabled and column can be edited, setup array for ngModel binding so a reset can happen
        if (this.tableSettings.bottomEditAllRow === true && tempCol.edit === true) {
          switch (tempCol.type) {
            case 'checkbox':
              this.allElements[tempCol.name] = false;
              break;
            default:
              this.allElements[tempCol.name] = '';
          }
        }
        this.tableSettings.columns.push(tempCol);
      }
    });
    if (this.tableSettings.columns.length !== 0) {
      this.tsLoaded = true;
    }

  }

  loadTableData() {
    if (typeOf(this.data) === 'array') {
      // Add original sort order number to data passed in
      let i = 0;
      this.data.forEach(rowIn => {
        i++;
        rowIn.ngSToso = i;
        // Should a row be displayed
        rowIn.ngSTdisp = true;
        // Marking rows to be compared
        rowIn.ngSTcomp = false;
      });
      this.tdLoaded = true;
    }
  }

  startAllChkStatus(colName) {
    // Basically if more than 50% of the checkboxes start checked, show the all as checked so it can be unchecked and vice versa
    let chkAll = false;
    // If there are no rows of data, just show a non-checked all
    const rowCount = this.data.length;
    if (rowCount === undefined) { return chkAll; }
    let checkCount = 0;
    this.data.forEach(r => {
      if (r[colName].checked !== undefined && r[colName].checked === true) { checkCount++; }
    });
    if (checkCount === undefined) { return chkAll; }
    if ((checkCount / rowCount) > .5) { chkAll = true; }
    return chkAll;
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
      sortMDArrayByColumn(this.data, 'ngSToso', 'asc');
    } else {
      const colType = this.tableSettings.columns.find(col => col.name === colName).type;
      if (colType === 'checkbox') {
        sortMDArrayByColumn(this.data, colName, newSort, 'checked');
      } else {
        // For String/the default
        sortMDArrayByColumn(this.data, colName, newSort);
      }
    }
  }

  filterTypeCapture(event, colName: string) {
    const filterText = event;
    this.filterChange(filterText, colName);
  }

  filterChange(filterText, colName: string) {
    // First capture the filter
    this.filterValues[colName] = filterText;
    let filterRegEx: RegExp;
    this.data.forEach( row => {
      row.ngSTdisp = true;
    });
    // On any key in the filterValues, filter the appropriate column for that value
    for (let key in this.filterValues) {
      if (this.filterValues[key] !== '' && this.filterValues[key] !== null) {
        filterRegEx = new RegExp(this.filterValues[key], 'gi');
        this.data.forEach(row => {
          let keyType = this.tableSettings.columns.find(cs => cs.name === key).type;
          if (keyType === 'string') {
            if (row[key].match(filterRegEx) === null) { row.ngSTdisp = false; }
          } else if (keyType === 'checkbox') {
            if (row[key].display.match(filterRegEx) === null) { row.ngSTdisp = false; }
          } else if (keyType === 'dropdown') {
            const drpdwnOpts = this.dropdownOptionAssociation(colName);
            const rowVal = row[key];
            if (drpdwnOpts[rowVal] !== undefined && drpdwnOpts[rowVal].toString().match(filterRegEx) === null ) {
              row.ngSTdisp = false;
            } else if (drpdwnOpts[rowVal] === undefined) {
              row.ngSTdisp = false;
            }
          }
        });
      }
    }
    // console.log(this.data.filter(dr => dr.ngSTdisp === true));
    this.pageInfo.calculatePageInfo(this.data.filter(dr => dr.ngSTdisp === true).length);
    sortMDArrayByColumn(this.data, 'ngSTdisp', 'desc');
  }

  dropdownOptionAssociation(dropdownColName: string) {
    const drpdwnArray = [];
    const drpCol = this.tableSettings.columns.find(c => c.name === dropdownColName);
    if (drpCol !== undefined && drpCol.type === 'dropdown') {
      drpCol.dropdownOptions.options.forEach(opt => drpdwnArray[opt.value] = opt.display);
    }
    return drpdwnArray;
  }

  clearFilter(colName) {
    this.filterChange(null, colName);
    this.allClear();
  }

  textChange(event, rowNum: number, colName: string) {
    const newValue = event;

    const rowArray: number[] = [];
    if (this.timeoutHandles[colName][rowNum] !== undefined) { clearTimeout(this.timeoutHandles[colName][rowNum]); }
    rowArray.push(rowNum);
    this.timeoutHandles[colName][rowNum] =
      setTimeout(this.changeDelay.bind(null, this, rowArray, colName, 'text', newValue), this.tableSettings.changeTextDelay);
  }

  checkboxChange(event, rowNum: number, colName: string) {
    const newValue = event.target.checked;
    // Call exception delete function here
    this.data[rowNum][colName].checked = newValue;
    const rowArray: number[] = [];
    if (this.tableSettings.emitDataChanges === true) {
      rowArray.push(rowNum);
      this.emitDataChange(rowArray, colName, 'chk', newValue);
    }
  }

  dropdownChange(event, rowNum, colName) {
    let newValue = event.target.value;
    const rowArray: number[] = [];
    if (newValue === '') {
      newValue = undefined;
    }
    this.data[rowNum][colName] = newValue;
    if (this.tableSettings.emitDataChanges === true) {
      rowArray.push(rowNum);
      this.emitDataChange(rowArray, colName, 'drp', newValue);
    }
  }

  allChange(event, colName: string, type: string) {
    let newValue;
    const rowArray: number[] = [];
    if (type === 'allText') {
      // Catch a change, delay by the number of milliseconds defined in the tables settings before activating the change,
      //  or, if another change comes through before the delay is up then delay again

      // Actual rows aren't calculated until the delay is up so just passing in an array with a number 0
      rowArray.push(0);
      newValue = event;
      if (this.timeoutHandles[colName]['all'] !== undefined) { clearTimeout(this.timeoutHandles[colName]['all']); }
      this.timeoutHandles[colName]['all'] =
        setTimeout(this.changeDelay.bind(null, this, rowArray, colName, 'allText', newValue), this.tableSettings.changeAllTextDelay);
    } else if (type === 'chk') {
      // Checkboxes
      newValue = event.target.checked;
      this.data.forEach((r, rIndex) => {
        if (r.ngSTdisp === true) { r[colName].checked = newValue; rowArray.push(rIndex); }
      });
      if (this.tableSettings.emitDataChanges === true) {
        this.emitDataChange(rowArray, colName, 'chk', newValue);
      }
    } else if (type === 'drp') {
      // Dropdowns
      if (newValue === 'ngSTunset') {
        newValue = '';
      } else {
        newValue = event.target.value;
      }
      this.data.forEach((r, rIndex) => {
        if (r.ngSTdisp === true) { r[colName] = newValue; rowArray.push(rIndex); }
      });
      if (this.tableSettings.emitDataChanges === true) {
        this.emitDataChange(rowArray, colName, 'drp', newValue);
      }
      event.target.value = '';
    }
  }

  changeDelay(objectIn, rowArray: number[], colName: string, type: string, newValue: string) {
    // Once a user hasn't made another change for a column in 500 milliseconds,
    //  write the change to the data table

    if (type === 'allText') {
      rowArray = []
;      objectIn.data.forEach((r, rIndex) => {
        if (r.ngSTdisp === true) { r[colName] = newValue; rowArray.push(rIndex); }
      });
      if (objectIn.tableSettings.emitDataChanges === true) {
        objectIn.emitDataChange(rowArray, colName, 'text', newValue);
      }
    } else if (type === 'text') {
      const rowNum = rowArray[0];
      objectIn.data[rowNum][colName] = newValue;
      if (objectIn.tableSettings.emitDataChanges === true) {
        objectIn.emitDataChange(rowArray, colName, 'text', newValue);
      }
    }
  }

  emitDataChange(rowArray: number[], colName: string, type: string, newValue: string) {
    // Create a data change request object and emit and event
    const dataChange: DataChangeRequest = new DataChangeRequest(rowArray, colName, type, newValue);
    this.dataChange.emit(dataChange);
  }

  allClear() {
    // This function clears any strings or checkboxes in the "all" row
    this.tableSettings.columns.forEach(col => {
      if (this.tableSettings.bottomEditAllRow === true && col.edit === true) {
        if (col.type === 'string') {
          this.allElements[col.name] = '';
        } else if (col.type === 'checkbox') {
          this.allElements[col.name] = false;
        }
      }
    });
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

export class DataChangeRequest {
  RowArray: number[];
  ColName: string;
  Type: string;
  NewValue: any;

  constructor(rowArray?: number[], colName?: string, type?: string, newValue?: string) {
    this.RowArray = rowArray;
    this.ColName = colName;
    this.Type = type;
    this.NewValue = newValue;
  }
}

class PageInfo {
    // Data paging info
    totalRows: number;
    rowsPerPage: number;
    pageOffset: number;
    numberPages: number;

    constructor() {
      this.totalRows = 0;
      this.rowsPerPage = null;
      this.pageOffset = null;
      this.numberPages = null;
    }

    calculatePageInfo(totalRows?: number, rowsPerPage?: number) {
      if (totalRows !== undefined) {
        this.totalRows = totalRows;
      } else {
        totalRows = this.totalRows;
      }
      if (rowsPerPage !== undefined) {
        this.rowsPerPage = rowsPerPage;
      } else {
        rowsPerPage = this.rowsPerPage;
      }

      if (totalRows !== undefined && rowsPerPage !== undefined && rowsPerPage !== null) {
        this.pageOffset = 1;
        this.numberPages = Math.floor(this.totalRows / rowsPerPage);
        if (this.totalRows % rowsPerPage !== 0) {
          this.numberPages += 1;
        }
      } else {
        this.rowsPerPage = null;
        this.pageOffset = null;
        this.numberPages = null;
      }
    }
}
