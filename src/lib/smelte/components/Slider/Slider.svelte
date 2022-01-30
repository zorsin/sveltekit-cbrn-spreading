<!-- @component
Sliders allow users to make selections from a range of values.

Props: value, label, color, disabled, min, max, step, classes
-->
<script lang="ts">
  import { ClassBuilder } from '../../utils/classes';
  // import Ripple from '../Ripple';

  /** Value.
   *
   * Default: 0
   */
  export let value = 0;
  /** Label.
   *
   * Default: empty string
   */
  export let label = '';
  /** Color variant, accepts any of the main colors described in Tailwind config.
   *
   * Default: "primary" */
  export let color = 'primary';
  /** Disabled variant.
   *
   * Default: false
   */
  export let disabled = false;
  /** Minimum value.
   *
   * Default: 0
   */
  export let min = 0;
  /** Maximum value.
   *
   * Default: 100
   */
  export let max = 100;
  /** Step
   *
   * Default: null
   */
  export let step: number | null = null;
  const classesDefault = `bg-${color}-50 w-full rounded cursor-pointer`;
  export let classes: string | ((s: string) => string) = classesDefault;

  let toPercent;
  $: {
    let factor = 100.0 / (max - min);
    toPercent = (v) => (v - min) * factor;
  }

  const cb = new ClassBuilder(classes, classesDefault);

  $: c = cb.flush().add(classes, true, classesDefault).add($$props.class).get();

  const getColor = (c) => `var(${c})`;

  let style;
  $: {
    let c1 = getColor(`--color-${color}-500`);
    let c2 = getColor(`--color-${color}-200`);
    let cv = toPercent(value);
    style = disabled
      ? ''
      : `background: linear-gradient(to right, ${c1} 0%, ${c1} ${cv}%, ${c2} ${cv}%, ${c2} 100%); --bg: ${c1}; --bg-focus: ${c1}`;
  }

  function applyColor(node): void {
    if (typeof window === 'undefined') return;

    let c = getColor(`--color-${color}-500`);
    node.style.setProperty('--bg', c);
    node.style.setProperty('--bg-focus', c);
  }
  const name = `slider-${Math.random()}`;
</script>

<label for={name}>{label}</label>
<input
  {name}
  use:applyColor
  type="range"
  class={c}
  {min}
  {max}
  {step}
  {disabled}
  bind:value
  on:change
  {style}
/>
