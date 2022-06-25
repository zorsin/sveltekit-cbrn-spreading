<!-- @component
Based on: https://github.com/dimfeld/svelte-leaflet-demo/blob/master/full/src/map/Leaflet.svelte
 -->
<script lang="ts">
  import { createEventDispatcher, setContext } from 'svelte';
  import * as L from 'leaflet';
  // Uncomment this for use outside the REPL
  import 'leaflet/dist/leaflet.css';

  // Must set either bounds, or view and zoom.
  export let bounds: L.LatLngBounds = undefined;
  export let view = undefined;
  export let zoom = undefined;
  let mapProp: L.Map | undefined = undefined;
  export { mapProp as map };

  export const invalidateSize = () => map?.invalidateSize();

  const dispatch = createEventDispatcher();

  let map: L.Map | undefined;
  $: mapProp = map;

  export const getMap = () => map;
  setContext('layerGroup', { getMap });
  setContext('layer', { getMap });
  setContext('map', { getMap });

  function createLeaflet(node: HTMLElement) {
    map = L.map(node)
      .on('zoom', (e) => dispatch('zoom', e))
      .on('mousemove', (e) =>
        dispatch('mousemove', { containerPoint: e.containerPoint, latlng: e.latlng }),
      )
      .on('click', (e) => dispatch('click', { containerPoint: e.containerPoint, latlng: e.latlng }))
      .on('layeradd', (e) => dispatch('layeradd', e));

    if (bounds) {
      map.fitBounds(bounds);
    } else {
      map.setView(view, zoom);
    }

    setTimeout(() => {
      if (map) {
        map.invalidateSize();
        // map.fitBounds(bounds);
      }
    }, 250);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
      maxZoom: 18,
    }).addTo(map);

    return {
      destroy() {
        map!.remove();
        map = undefined;
      },
    };
  }

  $: if (map) {
    if (bounds) {
      map.fitBounds(bounds);
    } else {
      map.setView(view, zoom);
    }
  }
</script>

<div class="w-full h-full" use:createLeaflet>
  {#if map}
    <slot {map} />
  {/if}
</div>

<style>
  :global(.leaflet-control-container) {
    position: static;
  }
  :global(.leaflet-container) {
    z-index: 0;
  }
</style>
