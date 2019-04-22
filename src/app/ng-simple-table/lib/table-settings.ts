export class TableSettings {
  displayHeaders: boolean;
  tableClass: string;
  filterRow: boolean;
  bottomEditAllRow: boolean;
  changeTextDelay: number;
  changeAllTextDelay: number;
  emitDataChanges: boolean;
  maxDisplayRows: number;
  columns: ColumnSettings[];

  constructor() {
    this.columns = [];
    this.tableClass = 'ng-simple-table';
    // Default values
    this.displayHeaders = true;
    this.filterRow = true;
    this.bottomEditAllRow = false;
    this.changeTextDelay = 0;
    this.changeAllTextDelay = 0;
    this.emitDataChanges = false;
    this.maxDisplayRows = null;
  }
}

export class ColumnSettings {
  name: string;
  display: string;
  type: string;
  edit: boolean;
  visible: boolean;
  order: number;
  sortable: any;
  sortSettings: SortInfo;
  style: string;
  dropdownOptions?: Dropdown;
  maxWidth: number;
}

export class SortInfo {
  sort: string;

  constructor(startSort?: string) {
    // Options for this should be "unsort", "asc", "desc"
    if (startSort === undefined || (startSort !== 'unsort' && startSort !== 'asc' && startSort !== 'desc')) {
      this.sort = 'unsort';
    } else {
      this.sort = startSort;
    }
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
