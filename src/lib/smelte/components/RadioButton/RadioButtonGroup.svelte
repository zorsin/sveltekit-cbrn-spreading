<!-- @component
Radio Button Selection Control

Props: classes, items, selected, name, disabled, color, buttonClasses
-->
<script lang="ts">
  import RadioButton from './RadioButton.svelte';
  import { ClassBuilder } from '../../utils/classes';
  import type { Colors } from '$types/Colors';
  interface IRadioButton {
    value: string;
    label: string;
  }

  const classesDefault = 'flex flex-col mb-4 cursor-pointer';

  export let classes: string | ((s: string) => string) = classesDefault;

  export let items: IRadioButton[] = [];
  /** Selected state. Bindable.
   *
   * Default: empty string
   */
  export let selected = '';
  export let name = '';
  /** Disabled variant.
   *
   * Default: false
   */
  export let disabled = false;
  /** Color variant, accepts any of the main colors described in Tailwind config.
   *
   * Default: "primary" */
  export let color: Colors = 'primary';
  export let small = false;
  export let buttonClasses: string | ((s: string) => string) =
    'flex items-center mb-2 cursor-pointer z-0';

  const cb = new ClassBuilder(classes, classesDefault);

  $: c = cb.flush().add($$props.class).get();
</script>

<div class={c}>
  {#each items as item}
    <slot {item}>
      <RadioButton
        bind:selected
        class={buttonClasses}
        {...item}
        {color}
        {small}
        name={name || `radio-${Math.random()}`}
        {disabled}
      />
    </slot>
  {/each}
</div>
