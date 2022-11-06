<!-- @component
Switch Selection Control

Props: checked, label, color, disabled, trackClasses
thumbClasses, labelClasses, classes
 -->
<script lang="ts">
  import Ripple from '../Ripple';

  import { ClassBuilder } from '../../utils/classes';
  import type { Colors } from '$types/Colors';

  const classesDefault = `inline-flex items-center mb-2 cursor-pointer z-10`;
  const trackClassesDefault =
    'relative w-10 h-auto z-0 rounded-full overflow-visible flex items-center justify-center';
  const thumbClassesDefault = 'rounded-full p-2 w-5 h-5 absolute shadow duration-100';
  const labelClassesDefault = 'pl-2 cursor-pointer';
  /** Input checked. Bindable.
   *
   * Default: false
   */
  export let checked = false;
  /** Input label.
   *
   * Default: empty string
   */
  export let label = '';
  /** Color variant, accepts any of the main colors described in Tailwind config.
   *
   * Default: "primary"
   */
  export let color: Colors = 'primary';
  /** Disabled variant.
   *
   * Default: false
   */
  export let disabled = false;
  /** Track classes. Can be set directly or function to modify the default, eg. s=>s.replace("justify-center","justify-left").
   *
   * Default: "relative w-10 h-auto z-0 rounded-full overflow-visible flex items-center justify-center"
   */
  export let trackClasses: string | ((s: string) => string) = trackClassesDefault;
  /** Thumb classes. Can be set directly or function to modify the default, eg. s=>s.replace("duration-100","duration-500").
   *
   * Default: "rounded-full p-2 w-5 h-5 absolute shadow duration-100"
   */
  export let thumbClasses: string | ((s: string) => string) = thumbClassesDefault;
  /** Label classes. Can be set directly or function to modify the default, eg. (s=>s + " w10").
   *
   * Default: "pl-2 cursor-pointer"
   */
  export let labelClasses: string | ((s: string) => string) = labelClassesDefault;
  /** Classes to pass down to checkbox wrapper. Can be set directly or function to modify the default, eg. s=>s.replace("mb-2","mb-4").
   *
   * Default; `inline-flex items-center mb-2 cursor-pointer z-10`
   */
  export let classes: string | ((s: string) => string) = classesDefault;
  export let name: string = `switch-${Math.random()}`;

  const cb = new ClassBuilder(classes, classesDefault);
  const trcb = new ClassBuilder(trackClasses, trackClassesDefault);
  const thcb = new ClassBuilder(thumbClasses, thumbClassesDefault);
  const lcb = new ClassBuilder(labelClasses, labelClassesDefault);

  $: c = cb.flush().add(classes, true, classesDefault).add($$props.class).get();
  $: tr = trcb
    .flush()
    .add('bg-gray-700', !checked)
    .add(`bg-${color}-200`, checked)
    .add(trackClasses, true, trackClassesDefault)
    .get();
  $: th = thcb
    .flush()
    .add(thumbClasses, true, thumbClassesDefault)
    .add('bg-white left-0', !checked)
    .add(`bg-${color}-400`, checked)
    .get();
  $: l = lcb
    .flush()
    .add(labelClasses, true, labelClassesDefault)
    .add('text-gray-700', disabled)
    .add('text-gray-300', !disabled)
    .get();

  function check() {
    if (disabled) return;

    checked = !checked;
  }
</script>

<div class={c} on:click={check} on:keydown={check}>
  <input {name} class="hidden" type="checkbox" on:change bind:checked />
  <div class={tr}>
    <div class="w-full h-full absolute" />
    <Ripple color={checked && !disabled ? color : 'gray'} noHover>
      <div class={th} style={checked ? 'left: 1.25rem' : ''} />
    </Ripple>
  </div>
  <label for={name} aria-hidden="true" class={l}>
    {label}
  </label>
</div>
