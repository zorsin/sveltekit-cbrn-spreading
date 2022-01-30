<!-- @component
A tree view widget presents a hierarchical list.

Props: items, level, showExpandIcon, expandIcon, selectable, selected, selectedClasses

Slots: default
 -->
<script lang="ts">
  import type ITreeViewListItem from '$types/ITreeViewListItem';
  import List, { ListItem } from '../List';
  import Icon from '../Icon';

  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';

  /** Items
   *
   * Default: []
   */
  export let items: ITreeViewListItem[] = [];
  export const value = '';
  export const text = '';
  export const dense = false;
  export const navigation = false;
  export const select = false;
  /** Subtree level.
   *
   * Default: 0
   */
  export let level = 0;
  /** Show expand icon.
   *
   * Default: true
   */
  export let showExpandIcon = true;
  /** Expand Icon.
   *
   * Default: "arrow_right"
   */
  export let expandIcon = 'arrow_right';
  /** Selectable.
   *
   * Default: true
   */
  export let selectable = true;
  /** Selected item.
   *
   * Default: null
   */
  export let selected: ITreeViewListItem | null = null;
  /** Selected classes
   *
   * Default: "bg-primary-trans"
   */
  export let selectedClasses: string | ((s: string) => string) = 'bg-primary-trans';

  const classesDefault = 'rounded';

  let expanded = [];

  const dispatch = createEventDispatcher();

  function toggle(i) {
    dispatch('select', i);

    if (selectable && !i.items) {
      selected = i;
    }

    expanded = i && !expanded.includes(i) ? [...expanded, i] : expanded.filter((si) => si !== i);
  }
</script>

<List {items} {...$$props}>
  <span slot="item" let:item>
    <ListItem
      {item}
      {...$$props}
      {...item}
      selected={selectable && selected === item}
      {selectedClasses}
      on:click={() => toggle(item)}
      on:click
    >
      <div class="flex items-center">
        {#if showExpandIcon && !item.hideArrow && item.items}
          <Icon tip={expanded.includes(item)}>{expandIcon}</Icon>
        {/if}
        <slot><span>{item.text}</span></slot>
      </div>
    </ListItem>

    {#if item.items && expanded.includes(item)}
      <div in:slide class="ml-6">
        <svelte:self {...$$props} items={item.items} level={level + 1} on:click on:select />
      </div>
    {/if}
  </span>
</List>
