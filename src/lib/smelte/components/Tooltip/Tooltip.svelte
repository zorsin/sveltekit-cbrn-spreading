<!-- @component
Tooltips display informative text when users hover over.
Use "activator" slot for element to be hovered, "default" slot for the message

Props: classes, show, timeout, delayHide, delayShow

Slots: activator, default
 -->
<script lang="ts">
  import { scale, fade } from 'svelte/transition';
  import { ClassBuilder } from '../../utils/classes';

  const classesDefault =
    'tooltip whitespace-nowrap text-xs absolute mt-2 bg-gray-600 text-gray-50 rounded md:px-2 md:py-2 py-4 px-3 z-30';
  /** Classes.
   *
   * Default: "tooltip whitespace-nowrap text-xs absolute mt-2 bg-gray-600 text-gray-50 rounded md:px-2 md:py-2 py-4 px-3 z-30"
   */
  export let classes: string | ((s: string) => string) = classesDefault;
  /** Show tooltip. Bindable.
   *
   * Default: false
   */
  export let show = false;
  /** Timeout */
  export let timeout = null;
  /** Delay hide tooltip in milliseconds.
   *
   * Default: 100
   */
  export let delayHide = 100;
  /** Delay show tooltip in milliseconds.
   *
   * Default: 100
   */
  export let delayShow = 100;

  const cb = new ClassBuilder(classes, classesDefault);
  $: c = cb.flush().add(classes, true, classesDefault).add($$props.class).get();

  function showTooltip() {
    if (show) return;

    show = true;

    if (!timeout) return;

    timeout = setTimeout(() => {
      show = false;
    }, timeout);
  }

  function hideTooltip() {
    if (!show) return;

    show = false;
    clearTimeout(timeout);
  }

  function debounce(func: () => void, wait: number, immediate = false) {
    let timeout;
    return function () {
      let context = this,
        args = arguments;
      let later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
</script>

<div class="relative inline-block">
  <div
    on:mouseenter={debounce(showTooltip, delayShow)}
    on:mouseleave={debounce(hideTooltip, delayHide)}
    on:mouseenter
    on:mouseleave
    on:mouseover
    on:mouseout
    on:focus
    on:blur
  >
    <slot name="activator" />
  </div>

  {#if show}
    <div in:scale={{ duration: 150 }} out:scale={{ duration: 150, delay: 100 }} class={c}>
      <slot />
    </div>
  {/if}
</div>

<style>
  .tooltip {
    left: 50%;
    transform: translateX(-50%);
  }
</style>
