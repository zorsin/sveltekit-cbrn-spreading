<script lang="ts">
  import { fade } from 'svelte/transition';
  import { quadOut, quadIn } from 'svelte/easing';
  /** Opacity, between 0 and 1.
   *
   * Default: .5
   */
  export let opacity = 0.5;
  /** fade in props
   *
   * Default: { duration: 200, easing: quadIn }
   */
  export let inProps: {
    delay?: number;
    duration: number;
    easing: typeof quadIn;
  } = { duration: 200, easing: quadIn };
  /** fade out props
   *
   * Default: { duration: 200, easing: quadOut }
   */
  export let outProps: {
    delay?: number;
    duration: number;
    easing: typeof quadOut;
  } = { duration: 200, easing: quadOut };
</script>

<div
  class="bg-black fixed top-0 left-0 z-10 w-full h-full"
  style="opacity: {opacity}"
  in:fade={inProps}
  out:fade={outProps}
  on:click
/>
