export class TableSettings {
  displayHeaders: any;
  tableClass: string;
  filterRow: any;
  columns: ColumnSettings[];

  constructor() {
    this.columns = [];
    this.tableClass = 'ng-simple-table';
    this.filterRow = true;
  }
}

export class ColumnSettings {
  name: string;
  display: string;
  type: string;
  edit: any;
  visible: any;
  order: number;
  sortable: any;
  sortSettings: SortInfo;
  filterKey;
}

export class SortInfo {
  sort: any;

  constructor() {
    // Options for this should be "unsort", "asc", "desc"
    this.sort = 'unsort';
  }
}
