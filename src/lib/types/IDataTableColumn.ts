export default interface DataTableColumn<DataRow> {
  /** The label of the column. If empty, 'field' is shown  */
  label?: string;
  /** The column to be shown. Can supply 'value' function instead */
  field?: string;
  class?: string;
  /** Derive a cell from data input
   * -- Warning -- uses unsafe svelte-@html-method, might be vulnerable to XSS attacks. See [svelte.dev/tutorial/html-tags](https://svelte.dev/tutorial/html-tags)
   */
  value?: (v: DataRow) => unknown;
  /** A component to be shown in column.
   *
   * Default: undefined */
  component?: unknown;
  /** Derive props to be passed to component.
   *
   * Default: () => {} */
  componentProps?: (v: DataRow) => { [key: string]: unknown };
  /** Cells are Editable. Default: false */
  editable?: boolean;
  /** If editable is true and textarea is true, edit fiels is textarea (text in more than one row)
   *
   * Default: false
   */
  textarea?: boolean;
  /** List of classes to remove from the component (blank space separated).
   *
   * Default: empty string
   */
  remove?: string;
  /** List of classes to add to the component (blank space separated).
   *
   * Default: empty string
   */
  add?: string;
  /** List of classes to replace in the component.
   *
   * Default: {}
   */
  replace?: { [key: string]: string };
  /** List of classes to remove from the component (blank space separated).
   *
   * Default: empty string
   */
  headerRemove?: string;
  /** List of classes to add to the component (blank space separated).
   *
   * Default: empty string
   */
  headerAdd?: string;
  /** List of classes to replace in the component.
   *
   * Default: {}
   */
  headerReplace?: { [key: string]: string };
  /** Sets if sort arrow should be shown after header label.
   *
   * Default: false
   */
  iconAfter?: boolean;
  /** Allow sorting by this column.
   *
   * Default: true */
  sortable?: boolean;
}
