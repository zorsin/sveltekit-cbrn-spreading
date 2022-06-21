<script lang="ts">
  import * as L from 'leaflet';
  import { getContext, setContext, onDestroy } from 'svelte';

  // 'map' is set by the parent Leaflet component, and returns the
  // Leaflet map instance.
  const { getMap } = getContext('map');
  const map = getMap();

  export let latLngs;
  export let color;

  // Create the line when the component instantiates...
  export let line: L.Polyline = new L.Polyline(latLngs, { color }).addTo(map);

  // And remove the line when the component is torn down
  onDestroy(() => line.remove());

  // The real component would have all the relevant properties here.
  $: style = { color };
  // Update the line when styles change.
  $: line.setStyle(style);

  // Move the line as needed.
  $: {
    line.setLatLngs(latLngs);
    line.redraw();
  }
</script>

<slot />
