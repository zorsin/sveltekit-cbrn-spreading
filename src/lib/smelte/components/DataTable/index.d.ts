import type { default as DataTable_ } from './DataTable.svelte';
import type { default as Header_ } from './Header.svelte';
import type { default as Row_ } from './Row.svelte';
import type { default as Pagination_ } from './Pagination.svelte';
import type { default as Editable_ } from './Editable.svelte';

declare class DataTable extends DataTable_ {}
declare class Header extends Header_ {}
declare class Row extends Row_ {}
declare class Pagination extends Pagination_ {}
declare class Editable extends Editable_ {}

export default DataTable;
export { Header, Row, Pagination, Editable };
