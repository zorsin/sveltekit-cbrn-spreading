<script lang="ts">
  import type { Colors } from '$types/Colors';

  import createRipple from '../Ripple/ripple';
  /** Color variant, accepts any of the main colors described in Tailwind config.
   *
   * Default: "primary" */
  export let color: Colors = 'primary';
  /** No hover variant.
   *
   * Default: false
   */
  export let noHover = false;

  $: ripple = createRipple(color, true);
  $: hoverClass = `hover:bg-${color}-transLight`;
</script>

<span
  use:ripple
  class="z-40 {$$props.class
    ? $$props.class
    : ''} p-2 rounded-full flex items-center justify-center top-0 left-0 {noHover
    ? ''
    : hoverClass}"
>
  <slot />
</span>

<style>
  .ripple {
    position: absolute !important;
  }
</style>
