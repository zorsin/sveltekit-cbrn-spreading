<!-- @component
Based on: https://github.com/dimfeld/svelte-leaflet-demo/blob/master/full/src/map/Control.svelte
 -->
<script lang="ts">
  import { getContext, onDestroy } from 'svelte';
  import type * as L from 'leaflet';
  import { Control } from './Control';

  let classNames: string | undefined = undefined;
  export { classNames as class };
  export let position: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
  /** The control instance created by this component */
  export let control: Control | undefined = undefined;
  const map = getContext<() => L.Map>('map')();

  function createControl(container: HTMLElement) {
    control = new Control(container, position).addTo(map);
    return {
      destroy() {
        control!.remove();
        control = undefined;
      },
    };
  }
</script>

<div class="hidden">
  <div use:createControl class={classNames}>
    {#if control}
      <slot {control} />
    {/if}
  </div>
</div>
