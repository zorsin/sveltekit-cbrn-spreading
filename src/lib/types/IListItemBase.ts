export default interface IListItemBase {
  /** Item id.
   *
   * Default: empty string
   */
  id?: string;
  /** href */
  to?: string;
  /** Selected item value.
   *
   * Default: empty string
   */
  value?: string;
  /** Item text.
   *
   * Default: empty string
   */
  text?: string;
}
