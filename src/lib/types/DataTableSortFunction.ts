import type { ColumnSelector } from '$types/ColumnSelector';
export type DataTableSortFunction<T extends { [key: string]: unknown }> = (
  data: T[],
  col: ColumnSelector<T>,
  asc?: boolean
) => T[];
