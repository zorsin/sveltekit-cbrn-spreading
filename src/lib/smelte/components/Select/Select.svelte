<!-- @component
Select components are used for collecting user provided information from a list of options.
One may bind to a select via on:change event. 

Props: items, value, label, selectedLabel, color, outlined, placeholder, 
hint, error, append, dense, persistentHint, noUnderline, showList, classes, 
optionsClasses, inputWrapperClasses, apendClasses, labelClasses, inputClasses,
prependClasses, listClasses, selectedClasses, itemClasses, add, remove, replace

Slots: select, options
-->
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { quadOut, quadIn } from 'svelte/easing';
  import List from '../List/List.svelte';
  import TextField from '../TextField';
  import { ClassBuilder } from '../../utils/classes';
  import { hideListAction } from '../../utils/hide-list-action';
  import type { Colors } from '$types/Colors';

  const optionsClassesDefault =
    'absolute left-0 bg-white rounded shadow w-full z-20 dark:bg-dark-500  border border-primary-500';
  const classesDefault = 'cursor-pointer relative pb-2';

  const noop = (i: string): string => i;
  /** Array of Items
   *
   * Default: []
   */
  export let items: ({ value: string; text: string } | string)[] = [];
  /** Selected Value. Bindable
   *
   * Default: empty string
   */
  export let value: string = '';
  export const text = '';
  /** Label of the TextField
   *
   * Default: empty string
   */
  export let label = '';

  let selectedLabelProp: string = undefined;
  /** Selected Label. Bindable.
   *
   * Default: undefined
   */
  export { selectedLabelProp as selectedLabel };
  /** Color variant, accepts any of the main colors described in Tailwind config.
   *
   * Default: "primary" */
  export let color: Colors = 'primary';
  /** Outlined variant.
   *
   * Default: false
   */
  export let outlined = false;
  /** Placeholder Text.
   *
   * Default: empty string
   */
  export let placeholder = '';
  /** Hint
   *
   * Default: empty string
   */
  export let hint = '';
  /** Error variant.
   *
   * Default: false
   */
  export let error = false;
  /** Append Icon.
   *
   * Default: "arrow_drop_down"
   */
  export let append = 'arrow_drop_down';
  /** Dense variant.
   *
   * Default: false
   */
  export let dense = false;
  /** Persisten Hint variant.
   *
   * Default: false
   */
  export let persistentHint = false;
  /** Autocomplete variant.
   *
   * Default: false
   */
  export let autocomplete = false;
  /** No underline variant.
   *
   * Default: false
   */
  export let noUnderline = false;
  /** Show List. Bindable.
   *
   * Default: false
   */
  export let showList = false;
  export let classes: string | ((s: string) => string) = classesDefault;
  export let optionsClasses: string | ((s: string) => string) = optionsClassesDefault;

  export let inputWrapperClasses: string | ((s: string) => string) = noop;
  export let appendClasses: string | ((s: string) => string) = noop;
  export let labelClasses: string | ((s: string) => string) = noop;
  export let inputClasses: string | ((s: string) => string) = noop;
  export let prependClasses: string | ((s: string) => string) = noop;
  export let listClasses: string | ((s: string) => string) = noop;
  export let selectedClasses: string | ((s: string) => string) = noop;
  export let itemClasses: string | ((s: string) => string) = noop;
  /** List of classes to add to the component (blank space separated).
   *
   * Default: empty string
   */
  export let add = '';
  /** List of classes to remove from the component (blank space separated).
   *
   * Default: empty string
   */
  export let remove = '';
  /** List of classes to replace in the component.
   *
   * Default: {}
   */
  export let replace: { [key: string]: string } = {};

  export let name = undefined;

  let itemsProcessed = [];

  function process(it) {
    return it.map((i) => (typeof i !== 'object' ? { value: i, text: i } : i));
  }

  $: itemsProcessed = process(items);

  const dispatch = createEventDispatcher();

  let selectedLabel = '';
  $: {
    if (selectedLabelProp !== undefined) {
      selectedLabel = selectedLabelProp;
    } else if (value !== undefined) {
      let selectedItem = itemsProcessed.find((i) => i.value === value);
      selectedLabel = selectedItem ? selectedItem.text : '';
    } else {
      selectedLabel = '';
    }
  }

  let filterText = null;
  $: filteredItems = itemsProcessed.filter(
    (i) => !filterText || i.text.toLowerCase().includes(filterText),
  );

  function filterItems({ target }) {
    filterText = target.value.toLowerCase();
  }

  function handleInputClick() {
    if (autocomplete) {
      showList = true;
    } else {
      showList = !showList;
    }
  }

  const onHideListPanel = () => (showList = false);

  const cb = new ClassBuilder(classes, classesDefault);
  $: c = cb.flush().add(classes, true, classesDefault).add($$props.class).get();

  const ocb = new ClassBuilder(optionsClasses, optionsClassesDefault);
  $: o = ocb
    .flush()
    .add(optionsClasses, true, optionsClassesDefault)
    .add('rounded-t-none', !outlined)
    .get();

  $: if (dense) {
    appendClasses = (i) => i.replace('pt-4', 'pt-3');
  }
</script>

<div class={c} use:hideListAction={onHideListPanel}>
  <input class="hidden" {value} {name} />
  <slot name="select">
    <TextField
      select
      {dense}
      focused={showList}
      {autocomplete}
      value={selectedLabel}
      {outlined}
      {label}
      {placeholder}
      {hint}
      {error}
      {append}
      {persistentHint}
      {color}
      {add}
      {remove}
      {replace}
      {noUnderline}
      class={inputWrapperClasses}
      {appendClasses}
      {labelClasses}
      {inputClasses}
      {prependClasses}
      on:click={handleInputClick}
      on:click-append={(e) => (showList = !showList)}
      on:click
      on:input={filterItems}
      appendReverse={showList}
    />
  </slot>

  {#if showList}
    <slot name="options">
      <div class={o} on:click={() => (showList = false)}>
        <List
          bind:value
          class={listClasses}
          {selectedClasses}
          {itemClasses}
          select
          {dense}
          items={filteredItems}
          on:change={({ detail }) => {
            dispatch('change', detail);
          }}
        />
      </div>
    </slot>
  {/if}
</div>
