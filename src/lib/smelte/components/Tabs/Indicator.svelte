<!-- @component
Indicator.

Props: width, left, color

No Slots.
-->
<script lang="ts">
  import type { Colors } from '$types/Colors';

  import { slide } from 'svelte/transition';
  import utils from '../../utils/classes';
  /** Width.
   *
   * Default: 0
   */
  export let width = 0;
  /** Left.
   *
   * Default: 0
   */
  export let left = 0;
  /** Color.
   *
   * Default: "primary"
   */
  export let color: Colors = 'primary';

  const { bg } = utils(color);
</script>

<div
  class="absolute bottom-0 left-0 transition {bg('700')}"
  class:hidden={left < 0}
  style="width: {width}px; left: {left}px; height: 2px;"
  transition:slide
/>
