<!-- @component
Radio Button Selection Control

Props: selected, label, color, disabled,
name, value, classes, labelClasses

Slots: label
 -->
<script lang="ts">
  import Icon from '../Icon';
  import Ripple from '../Ripple';
  import Label from '../Checkbox/Label.svelte';
  import { ClassBuilder } from '../../utils/classes';
  import type { Colors } from '$types/Colors';

  const classesDefault = 'flex items-center mb-2 cursor-pointer z-0';
  /** Selected state. If selected===value then radiobutton is checked. Bindable
   *
   * Default: ""
   */
  export let selected = '';
  /** Text for the label.
   *
   * Default: empty string
   */
  export let label = '';
  /** Color variant, accepts any of the main colors described in Tailwind config.
   *
   * Default: "primary" */
  export let color: Colors = 'primary';
  /** Disabled variant.
   *
   * Default: false
   */
  export let disabled = false;
  /** Name of the input field.
   *
   * Default: empty string
   */
  export let name = '';
  /** Input value */
  export let value = '';
  export let classes: string | ((s: string) => string) = classesDefault;
  export let small = false;
  export let labelClasses = (i: string): string => i;

  function select() {
    if (disabled) return;

    selected = value;
  }

  const cb = new ClassBuilder(classes, classesDefault);
  $: c = cb.flush().add(classes, true, classesDefault).add($$props.class).get();

  $: rippleColor = value && !disabled ? color : 'gray';
</script>

<div class={c} on:click={select}>
  <input
    aria-label={label}
    class="hidden"
    type="radio"
    role="radio"
    {disabled}
    {name}
    selected={selected === value}
  />
  <div class="relative">
    <Ripple color={rippleColor}>
      {#if selected === value}
        <Icon {small} class="text-{disabled ? 'gray' : color}-500">radio_button_checked</Icon>
      {:else}
        <Icon {small} class={disabled ? 'text-gray-500 dark:text-gray-600' : 'text-gray-600'}>
          radio_button_unchecked
        </Icon>
      {/if}
    </Ripple>
  </div>
  <slot name="label">
    <Label {name} {disabled} {label} class={labelClasses} />
  </slot>
</div>
