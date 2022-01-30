<script lang="ts">
  import type IListItemBase from '$types/IListItemBase';
  import { ClassBuilder } from '../../utils/classes';
  import ListItem from './ListItem.svelte';
  const classesDefault = 'py-2 rounded';

  export let items: IListItemBase[] = [];
  /** Selected item value, Bindable.
   *
   * Default: empty string
   */
  export let value = '';
  /** Dense variant.
   *
   * Default: false
   */
  export let dense = false;
  /** Is dropdown select.
   *
   * Default false
   */
  export let select = false;

  export const level = null;
  export const text = '';
  export const item = {};
  export const to = null;
  export const selectedClasses: string | ((s: string) => string) = (i) => i;
  export const itemClasses: string | ((s: string) => string) = (i) => i;
  export const disabledClasses: string | ((s: string) => string) = (i) => i;
  export let classes: string | ((s: string) => string) = classesDefault;

  function id(i) {
    if (i.id !== undefined) return i.id;
    if (i.value !== undefined) return i.value;
    if (i.to !== undefined) return i.to;
    if (i.text !== undefined) return i.text;
    return i;
  }

  function getText(i) {
    if (i.text !== undefined) return i.text;
    if (i.value !== undefined) return i.value;
    return i;
  }

  const cb = new ClassBuilder($$props.class, classesDefault);

  $: c = cb.flush().add(classes, true).add($$props.class).get();
</script>

<ul class={c} class:rounded-t-none={select}>
  <slot name="items" {dense} {value}>
    {#each items as item, i}
      {#if item.to !== undefined}
        <slot name="item" {item} {dense} {value}>
          <a tabindex={i + 1} href={item.to}>
            <ListItem bind:value {...item} id={id(item)} {dense} on:change>
              {item.text}
            </ListItem>
          </a>
        </slot>
      {:else}
        <slot name="item" {item} {dense} {value}>
          <ListItem
            bind:value
            {selectedClasses}
            {itemClasses}
            {disabledClasses}
            {...item}
            tabindex={i + 1}
            id={id(item)}
            selected={value === id(item)}
            {dense}
            on:change
            on:click
          >
            {getText(item)}
          </ListItem>
        </slot>
      {/if}
    {/each}
  </slot>
</ul>
