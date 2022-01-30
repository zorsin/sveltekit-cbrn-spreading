<!-- @component
Selection controls allow the user to select options.

Props: value, label, color, checked, disabled, classes, labelClasses
-->
<script lang="ts">
  import Label from './Label.svelte';
  import { createEventDispatcher } from 'svelte';
  import { ClassBuilder } from '../../utils/classes';
  import Icon from '../Icon';
  import Ripple from '../Ripple';

  const classesDefault = 'inline-flex items-center mb-2 cursor-pointer z-10';

  /** Input value. See also prop "checked".
   *
   * Default: empty string
   */
  export let value = '';
  /** Input label
   *
   * Default: empty string
   */
  export let label = '';
  /** Color variant, accepts any of the main colors described in Tailwind config.
   *
   * Default: "primary"
   */
  export let color = 'primary';
  /** Checked state.
   *
   * Default; false
   */
  export let checked = false;
  /** Disabled state.
   *
   * Default: false
   */
  export let disabled = false;
  /** Classes to pass down to checkbox wrapper.
   *
   * Default: "inline-flex items-center mb-2 cursor-pointer z-10"
   */
  export let classes: string | ((s: string) => string) = classesDefault;

  export let labelClasses: (i: any) => any = (i) => i;
  /**
   * For bind:group handling.
   * Adds/remove prop "value" to the array when checked changes */
  export let group: string[] = [];

  // for bind:group
  //keep track of group array state;
  let groupstate = group.includes(value);

  $: if (value && !disabled) {
    const groupHasValue = group.includes(value);

    // check if group array has changed, or something else
    if (groupHasValue === groupstate) {
      // add to group array if checked
      if (checked && !groupHasValue) {
        group = group.concat([value]);
        groupstate = true;
        // remove from group array if unchecked
      } else if (!checked && groupHasValue) {
        group = [...group.filter((v) => v !== value)];
        groupstate = false;
      }
    } else {
      // group array has changed. Click box
      groupstate = groupHasValue;
      check();
    }
  }
  const dispatch = createEventDispatcher();

  function check() {
    if (disabled) return;

    checked = !checked;
    dispatch('change', checked);
  }

  $: rippleColor = checked && !disabled ? color : 'gray';

  const cb = new ClassBuilder(classes, classesDefault);
  $: c = cb.flush().add(classes, true, classesDefault).add($$props.class).get();
</script>

<div class={$$props.class}>
  <div class={c} on:click={check}>
    <input bind:checked class="hidden" type="checkbox" on:change {value} />
    <div class="relative w-auto h-auto z-0">
      <Ripple color={rippleColor}>
        {#if checked}
          <Icon
            class={disabled
              ? 'text-gray-500 dark:text-gray-600'
              : `text-${color}-500 dark:text-${color}-100`}
          >
            check_box
          </Icon>
        {:else}
          <Icon
            class={disabled
              ? 'text-gray-500 dark:text-gray-600'
              : 'text-gray-600 dark:text-gray-300'}
          >
            check_box_outline_blank
          </Icon>
        {/if}
      </Ripple>
    </div>
    <slot name="label">
      <Label {disabled} {label} class={labelClasses} />
    </slot>
  </div>
</div>
