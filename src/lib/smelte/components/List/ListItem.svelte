<script lang="ts">
  import { ClassBuilder } from '../../utils/classes';
  import { createEventDispatcher } from 'svelte';
  import Icon from '../Icon';
  import createRipple from '../Ripple/ripple';

  const classesDefault =
    'focus:bg-gray-50 dark-focus:bg-gray-700 hover:bg-gray-transDark relative overflow-hidden duration-100 p-4 cursor-pointer text-gray-700 dark:text-gray-100 flex items-center z-10';
  const selectedClassesDefault = 'bg-gray-200 dark:bg-primary-transLight';
  const subheadingClassesDefault = 'text-gray-600 p-0 text-sm';
  const disabledClassesDefault = 'text-gray-600';
  const ripple = createRipple();
  const dispatch = createEventDispatcher();
  /** Prepend item with icon.
   *
   * Default: empty string
   */
  export let icon = '';
  export let id = '';
  export let value = '';
  export let text = '';
  /** Item subheading.
   *
   * Default: empty string
   */
  export let subheading = '';
  /** Disabled state. Bindable.
   *
   * Default: false
   */
  export let disabled = false;
  /** Dense variant.
   *
   * Default: false
   */
  export let dense = false;
  /** Is selected. Bindable.
   *
   * Default: false
   */
  export let selected = false;
  /** Tab index.
   *
   * default: null
   */
  export let tabindex: number | null = null;
  export let selectedClasses: string | ((s: string) => string) = selectedClassesDefault;
  export let subheadingClasses: string = subheadingClassesDefault;
  export let disabledClasses: string | ((s: string) => string) = disabledClassesDefault;
  export let classes: string | ((s: string) => string) = classesDefault;

  export let to = '';
  export const item = null;
  export const items = [];
  export const level = null;

  function change() {
    if (disabled) return;
    value = id;
    dispatch('change', { id, to });
  }

  const cb = new ClassBuilder(classes, classesDefault);

  $: c = cb
    .flush()
    .add(selectedClasses, selected, selectedClassesDefault)
    .add('py-2', dense)
    .add(disabledClasses, disabled)
    .add($$props.class)
    .get();
</script>

<li use:ripple class={c} {tabindex} on:keypress={change} on:click={change} on:click>
  {#if icon}
    <Icon class="pr-6" small={dense}>
      {icon}
    </Icon>
  {/if}

  <div class="flex flex-col p-0">
    <div class={$$props.class}>
      <slot>{text}</slot>
    </div>
    {#if subheading}
      <div class={subheadingClasses}>{subheading}</div>
    {/if}
  </div>
</li>
