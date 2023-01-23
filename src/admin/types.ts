export type NumberFilter = {
  name: 'num',
  from: number,
  to: number,
}

export type StringFilter = {
  name: 'str',
  search: string,
  notInclude: string,
}

export type DateFilter = {
  name: 'date',
  from: Date,
  to: Date,
}

export type EnumFilter = {
  name: 'enum';
  filter: string[];
  values: string[];
}

export type NullFilter = {
  name: 'not-null';
}

export type JustFilter = EnumFilter | DateFilter | NumberFilter | StringFilter | NullFilter;

export type Column<Data> = {
  key: keyof Data,
  title: string,
  type: 'num' | 'str' | 'anchor' | 'key' | 'img',
  width?: number,
} | {
  key: keyof Data,
  title: string,
  type: 'enum',
  values: string[],
  width?: number,
} | {
  key: keyof Data,
  title: string,
  type: 'date',
  format: string,
  width?: number,
};

export type TableSort = { desc: boolean, columnKey: string }
export type TableFilter = { filter: JustFilter, columnKey: string };

export type GetDataParams = {
  sort: TableSort[],
  filter: TableFilter[],
  search: string,
  offset: number,
  limit: number,
}

export type TableType<Data> = {
  columns: Column<Data>[];
  getData: (params: GetDataParams) => Promise<{
    data: Data[];
    totalRows: number;
    totalFiltredRows: number;
  }>;
}