<!-- @component
Chips are compact elements that represent an input, attribute, or action.

Props: removable, icon, outlined, selected, selectable, color, 
remove, add, replace
-->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { scale } from 'svelte/transition';
  import createRipple from '../Ripple/ripple';
  import utils, { ClassBuilder, filterProps } from '../../utils/classes';
  import Icon from '../Icon';
  import type { Colors } from '$types/Colors';

  /** If true adds a x-marked button to remove.
   *
   * Default: false
   */
  export let removable = false;
  /** Add an icon.
   *
   * Default: empty string
   */
  export let icon = '';
  /** Outlined variant.
   *
   * Default: false
   */
  export let outlined = false;
  /** Selected state. Can be bound to.
   *
   * Default: false
   */
  export let selected = false;
  /** Selectable variant.
   *
   * Default: true
   */
  export let selectable = true;
  /** Color variant, accepts any of the main colors described in Tailwind config.
   *
   * Default: "primary" */
  export let color: Colors = 'primary';
  /** List of classes to remove from the component (blank space separated).
   *
   * Default: empty string
   */
  export let remove = '';
  /** List of classes to add to the component (blank space separated).
   *
   * Default: empty string
   */
  export let add = '';
  /** List of classes to replace in the component.
   *
   * Default: {}
   */
  export let replace: { [key: string]: string } = {};

  $: ripple = createRipple(color);

  let value = true;

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
    value = false;
  }

  function select() {
    if (!selectable) return;

    selected = true;
  }

  const { bg, txt, border } = utils(color);

  const cb = new ClassBuilder('', '');

  $: classes = cb
    .flush()
    .add('relative overflow-hidden flex items-center rounded-full px-2 py-1')
    .add('bg-transparent border', outlined)
    .add(
      'border-gray-400 border-solid hover:bg-gray-100 dark-hover:bg-dark-400 bg-gray-300 dark:bg-dark-600',
      !selected,
    )
    .add(`${border('')} dark:${border('800')} ${txt('')} ${bg('100')} hover:${bg('50')}`, selected)
    .remove(remove)
    .replace(replace)
    .add(add)
    .get();

  const props = filterProps(
    ['removable', 'icon', 'outlined', 'selected', 'selectable', 'color'],
    $$props,
  );

  $: iconClass = selected
    ? `hover:${bg('300')} ${bg('400')}`
    : 'hover:bg-gray-400 bg-gray-500 dark:bg-gray-800';

  $: c = cb.flush().add($$props.class).get();
</script>

{#if value}
  <span class="{c} mx-1 inline-block" out:scale={{ duration: 100 }}>
    <button class={classes} on:click use:ripple {...props} on:click={select}>
      {#if icon}
        <Icon small class={selected ? txt('400') : 'text-gray-600'}>
          {icon}
        </Icon>
      {/if}
      <span class="px-2 text-sm">
        <slot />
      </span>
      {#if removable}
        <span
          class="rounded-full p-1/2 inline-flex items-center cursor-pointer {iconClass}"
          on:click|stopPropagation={close}
        >
          <Icon class="text-white dark:text-white" xs>clear</Icon>
        </span>
      {/if}
    </button>
  </span>
{/if}

<style>
  .p-1\/2 {
    padding: 0.125rem;
  }
</style>
