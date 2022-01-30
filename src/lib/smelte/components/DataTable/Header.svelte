<!-- @component
Header component for the Data Table
 -->
<script lang="ts">
  import type IDataRow from '$types/IDataRow';
  import type IDataTableColumn from '$types/IDataTableColumn';
  import { ClassBuilder } from '../../utils/classes';
  import { createEventDispatcher } from 'svelte';
  import Icon from '../Icon';

  const classesDefault =
    'capitalize duration-100 text-gray-600 text-xs hover:text-black dark-hover:text-white p-3 font-normal text-right';
  /** String of root element classes. */
  export let classes: string | ((s: string) => string) = classesDefault;
  /** Column information */
  export let column: IDataTableColumn<{ [key: string]: unknown }> = {};
  export let asc = false;
  export let sortBy: IDataTableColumn<{ [key: string]: any }> | boolean = false;
  export let sortable = true;
  export let editing = false;
  export let iconUp = 'arrow_upward';
  export let iconDown = 'arrow_downward';
  export let iconSortable = 'import_export';
  export let remove = '';

  const dispatch = createEventDispatcher();

  const cb = new ClassBuilder(classes, classesDefault);
  $: c = cb.flush().add(classes, true, classesDefault).remove(remove).add($$props.class).get();

  function headerColumnClass(column) {
    const cb = new ClassBuilder('sort-wrapper flex items-center justify-end', '');
    if (column.headerReplace) {
      cb.replace(column.headerReplace);
    }
    if (column.headerAdd) {
      cb.add(column.headerAdd);
    }
    if (column.headerRemove) {
      cb.remove(column.headerRemove);
    }
    return cb.get();
  }

  const headerClick = () => {
    if (column.sortable === false || !sortable) return;
    editing = false;
    asc = sortBy === column ? !asc : false;
    sortBy = column;
    dispatch('sort', column);
  };
</script>

<th class={c} class:cursor-pointer={sortable || column.sortable} on:click={() => headerClick()}>
  <div class={headerColumnClass(column)}>
    {#if sortable && column.sortable !== false && !column.iconAfter}
      {#if sortBy === column}
        <Icon small color="text-gray-400 dark:text-gray-100">{asc ? iconUp : iconDown}</Icon>
      {:else}
        <Icon small color="text-gray-400 dark:text-gray-100">{iconSortable}</Icon>
      {/if}
    {/if}
    <span class={sortBy === column ? 'underline' : ''}>{column.label || column.field}</span>
    {#if sortable && column.sortable !== false && !!column.iconAfter}
      {#if sortBy === column}
        <Icon small color="text-gray-400 dark:text-gray-100">{asc ? iconUp : iconDown}</Icon>
      {:else}
        <Icon small color="text-gray-400 dark:text-gray-100">{iconSortable}</Icon>
      {/if}
    {/if}
  </div>
</th>
