import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NgSimpleTableComponent } from '../ng-simple-table.component';

@Component({
  selector: 'app-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.css', '../lib/font-awesome-4.7.0/css/font-awesome.min.css']
})
export class FilterBoxComponent implements OnInit {
  @Input() colName: string;
  @Input() table: NgSimpleTableComponent;

  filterValue: string;

  filterBox: any;

  constructor() {
    this.filterValue = null;
   }

  ngOnInit() {
  }


  filterChange(event) {
    // Don't worry about shift keys
    if (event.keyCode === 16) { return; }
    // Grab the element so late it can be cleared
    this.filterBox = event.srcElement;
    this.filterValue = event.srcElement.value;
    this.emitChanges();
  }

  clearFilter() {
    this.filterBox.value = null;
    this.filterValue = null;
    this.emitChanges();
  }

  emitChanges() {
    this.table.filterChange(this.filterValue, this.colName);
  }

}

export class FilterData {
  filterKey: string;
  filterValue: string;

  constructor(filterKey: string, filterValue: string) {
    this.filterKey = filterKey;
    this.filterValue = filterValue;
  }
}
