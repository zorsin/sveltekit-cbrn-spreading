import type IDataColumn from './IDataColumn';

export type ColumnSelector<T extends { [key: string]: unknown }> = IDataColumn<T>;
