<!-- @component
Date picker component.

Props: label, open defaultIcon, value, locale, todayClasses, selectedClasses, 
closeOnSelect, appendClasses, dense

No Slots.
-->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { slide, fade, fly } from 'svelte/transition';
  import Card from '../Card/Card.svelte';
  import TextField from '../TextField';
  import Picker from './Picker.svelte';
  import Menu from '../Menu';
  import Button from '../Button';
  import Ripple from '../Ripple';
  import { getWeekDays, weekStart } from './util';

  const dispatch = createEventDispatcher();
  const noop = (i) => i;
  /** Label.
   *
   * Default: "Date"
   */
  export let label = 'Date';
  /** Open. Bindable.
   *
   * Default: false
   */
  export let open = false;
  /** Default icon for date button.
   *
   * Default: "date_range"
   */
  export let defaultIcon = 'date_range';
  /** Value. Bindable.
   *
   * Default: null
   */
  export let value: Date | null = null;
  /** Locale.
   *
   * Default: "default"
   */
  export let locale = 'default';
  export let todayClasses = 'text-primary-600 rounded-full border border-primary-600';
  export let selectedClasses = 'bg-primary-600 text-white rounded-full';
  /** Close on select variant.
   *
   * Default: false
   */
  export let closeOnSelect = true;
  export let appendClasses: string | ((i: string) => string) = noop;
  /** Dense variant.
   *
   * Default: false
   */
  export let dense = false;

  let hasUserValue = Boolean(value);
  if (hasUserValue) value = new Date(value);

  const today = new Date().getDate();

  let displayValue = value && value.toLocaleDateString ? value.toLocaleDateString() : '';

  function valid(date) {
    return (
      new Date(date).toISOString() != 'Invalid Date' && !isNaN(new Date(date).getMilliseconds())
    );
  }

  function changeTextInput(e) {
    let date;
    const dateArray = e.target.value.split(/\D+/);
    if (dateArray[2].length == 4) date = new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
    else date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    if (valid(date)) value = date;

    if (e.target.value === '') {
      value = null;
    }
  }

  $: if (dense) {
    appendClasses = (i: string): string => i.replace('pt-4', 'pt-3');
  }
</script>

<Menu bind:open>
  <div slot="activator">
    <TextField
      classes="mt-2 relative text-gray-600 dark:text-gray-100"
      value={displayValue}
      {label}
      {dense}
      append={defaultIcon}
      {appendClasses}
      on:click={() => (open = !open)}
      on:click-append={() => (open = !open)}
      on:change={changeTextInput}
    />
  </div>
  <div slot="menu">
    {#if open}
      <Picker
        bind:value
        bind:open
        {dense}
        {locale}
        {todayClasses}
        {selectedClasses}
        {closeOnSelect}
        on:change
        on:change={(e) => {
          displayValue = e.detail.toLocaleDateString();
        }}
      />
    {/if}
  </div>
</Menu>
