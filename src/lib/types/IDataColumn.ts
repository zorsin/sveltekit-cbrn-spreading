export default interface IColumn<T> {
  sort?: (d: T[]) => T[];
  value?: (v: T) => number | string;
  field?: keyof T;
}
