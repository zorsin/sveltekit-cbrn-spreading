<!-- @component
A Data Table component visualizes data in a strucured form
  -->
<script lang="ts">
  import type IDataRow from '$types/IDataRow';
  import type DataTableColumn from '$types/IDataTableColumn';
  import type { DataTableSortFunction } from '$types/DataTableSortFunction';
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';
  import { ClassBuilder } from '../../utils/classes';
  import Icon from '../Icon';
  import Button from '../Button';
  import TextField from '../TextField';
  import { ProgressLinear } from '../ProgressLinear';
  import Header from './Header.svelte';
  import Row from './Row.svelte';
  import Pagination from './Pagination.svelte';
  import defaultSort from './sort';

  const classesDefault = 'shadow relative text-sm overflow-x-auto dark:bg-dark-500';

  /** The input data to show
   *
   * Default: []
   */
  export let data: IDataRow[] = [];
  /** The column labels. "field" should match the keys of data.
   *
   * Default: []
   */
  export let columns: DataTableColumn<IDataRow>[] = Object.keys(data[0] || {}).map((i) => ({
    label: (i || '').replace('_', ' '),
    field: i,
  }));
  /** Page state. Can be bound.
   *
   * Default: 1
   */
  export let page = 1;
  /** Custom sort function for column headers */
  export let sort: DataTableSortFunction<IDataRow> = defaultSort;
  /** How many items to show per page.
   *
   * Default 10
   */
  export let perPage = 10;
  /** Options for showing items per page.
   *
   * Default [10, 20, 50]
   */
  export let perPageOptions: string[] = ['10', '20', '50'];
  /** Sort Ascending state. Bindable */
  export let asc = false;
  /** Table is loading state. Bindable. */
  export let loading = false;
  /** Disable showing loading progress.
   *
   * Default: false
   */
  export let hideProgress = false;
  /** Global switch, if editing is allowed.
   *
   * Default: true
   */
  export let editable = true;
  /** Global switch for sortability.
   *
   * Default: true
   */
  export let sortable = true;
  /** Pagination wanted.
   *
   * Defaul: true
   */
  export let pagination = true;
  /** Should scroll to top on page change.
   *
   * Default: false
   */
  export let scrollToTop = false;
  export let headerClasses: (i: string) => string = (i) => i;
  export let headerRemove = '';
  export let paginationClasses: (i: string) => string = (i) => i;
  export let editableClasses: (i: string) => string = (i) => i;
  /**
   * Options spread to paginator buttons
   *
   * Default: {
   *  color: "gray",
   *  text: true,
   *  flat: true,
   *  dark: true,
   *  remove: "px-4 px-3",
   *  iconClasses: (c) => c.replace("p-4", ""),
   *  disabledClasses: (c) => c
   *      .replace("text-white", "text-gray-200")
   *      .replace("bg-gray-300", "bg-transparent")
   *      .replace("text-gray-700", ""),
   * }
   */
  export let paginatorProps: Record<string, unknown> | null = null;
  /** Classes.
   *
   * Default: "flex justify-between items-center text-gray-700 text-sm w-full h-16"
   */
  export let classes: string | ((s: string) => string) = classesDefault;
  export let customSort = false;
  export let sortBy = null;
  export let iconUp = 'arrow_upward';
  export let iconDown = 'arrow_downward';
  export let iconSortable = 'import_export';

  let table: HTMLElement;

  $: {
    perPage = pagination ? perPage : data.length;
  }
  $: offset = page * perPage - perPage;
  $: sorted = customSort ? data : sort(data, sortBy, asc).slice(offset, perPage + offset);
  $: pagesCount = Math.ceil(data.length / perPage);

  const dispatch = createEventDispatcher();

  let editing = false;

  const cb = new ClassBuilder(classes, classesDefault);
  $: c = cb.flush().add(classes, true, classesDefault).add($$props.class).get();
</script>

<table class={c} bind:this={table}>
  <thead class="items-center">
    {#each columns as column, i}
      <slot name="header" {column}>
        <Header
          class={headerClasses}
          {column}
          bind:asc
          bind:sortBy
          remove={headerRemove}
          {sortable}
          {editing}
          {iconUp}
          {iconDown}
          {iconSortable}
          on:sort={() => sort}
        />
      </slot>
    {/each}
  </thead>
  {#if loading && !hideProgress}
    <div class="absolute w-full" transition:slide>
      <ProgressLinear />
    </div>
  {/if}
  <tbody>
    {#each sorted as item, index}
      <slot name="item" {item} {index}>
        <Row bind:editing {index} {item} {columns} {editable} {editableClasses} on:update />
      </slot>
    {/each}
  </tbody>
  {#if pagination}
    <slot name="pagination">
      <Pagination
        bind:page
        bind:perPage
        class={paginationClasses}
        {perPageOptions}
        {scrollToTop}
        {paginatorProps}
        {offset}
        {pagesCount}
        {table}
        total={data.length}
      />
    </slot>
  {/if}

  <slot name="footer" />
</table>
