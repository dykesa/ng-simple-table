export class TableSettings {
  displayHeaders: any;
  tableClass: string;
  filterRow: any;
  bottomEditAllRow: any;
  changeTextDelay: number;
  emitDataChanges: any;
  columns: ColumnSettings[];

  constructor() {
    this.columns = [];
    this.tableClass = 'ng-simple-table';
    // Default values
    this.displayHeaders = true;
    this.filterRow = true;
    this.bottomEditAllRow = false;
    this.changeTextDelay = 0;
    this.emitDataChanges = false;
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
  dropdownOptions?: Dropdown;
  maxWidth: number;
}

export class SortInfo {
  sort: any;

  constructor() {
    // Options for this should be "unsort", "asc", "desc"
    this.sort = 'unsort';
  }
}

export class Dropdown {
  default: string;
  options: DrpdwnOption[];
}

export class DrpdwnOption {
  display: string;
  value: string;
}
