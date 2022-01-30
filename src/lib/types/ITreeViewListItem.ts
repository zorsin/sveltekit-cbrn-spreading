import type IListItemBase from './IListItemBase';
export default interface TreeViewListItem extends IListItemBase {
  /** Hide arrow Icon */
  hideArrow?: boolean;
  /** Sub-tree items */
  items?: TreeViewListItem[];
}
