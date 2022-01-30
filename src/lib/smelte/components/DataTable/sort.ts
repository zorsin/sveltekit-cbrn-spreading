import type { ColumnSelector } from '$types/ColumnSelector';

export default function sort<T extends { [key: string]: unknown }>(
  data: T[],
  col: ColumnSelector<T>,
  asc: boolean,
): T[] {
  if (!col) return data;

  if (col.sort) return col.sort(data);

  return data.sort((a, b) => {
    const valA = col.value ? col.value(a) : a[col.field];
    const valB = col.value ? col.value(b) : b[col.field];

    const first = asc ? valA : valB;
    const second = asc ? valB : valA;

    if (typeof valA === 'number') {
      return <number>first - <number>second;
    }

    return ('' + first).localeCompare(<string>second);
  });
}
