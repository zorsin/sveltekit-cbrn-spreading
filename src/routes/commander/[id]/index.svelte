<script lang="ts">
  import { PageTitle, SolidLocationMarker } from '$lib/smelte';
  import { Leaflet, Polyline, Marker } from '$lib/comps';
  import { t } from 'svelte-intl-precompile';
  export let spreadId;
  export let spread;
  export let lines = [];

  //#region leaflet
  let map;
  let loaded = false;
  let markerLocation = spread.start;
  const initialView = spread.start;

  function resizeMap() {
    if (map) {
      map.invalidateSize();
    }
  }

  function resetMapView() {
    map.setView(initialView, 13);
  }

  const onLayerAdd = (event) => {
    const newLayer = event.detail.layer;
    if (newLayer.getBounds) {
      map && map.fitBounds(newLayer.getBounds());
    }
  };
  //#endregion leaflet
</script>

<svelte:window on:resize={resizeMap} on:load={() => (loaded = true)} />

<PageTitle>{$t('pages.commander-view.title', { values: { id: spreadId } })}</PageTitle>

<div class="grid(& cols-4) gap-4">
  <div class="col-span-4 h-[40rem] bg-error-500 z-20">
    {#if (loaded || document.readyState === 'complete') && window}
      <Leaflet bind:map view={initialView} zoom={13} on:layeradd={onLayerAdd}>
        {#each lines as line (line.id)}
          <Polyline latLngs={line.latLngs} color={line.color} />
        {/each}
        {#if markerLocation}
          <Marker latLng={markerLocation} width={40} height={40} class="text-primary-500">
            <SolidLocationMarker class="w-full h-full relative -top-[19px]" />
          </Marker>
        {/if}
      </Leaflet>
    {/if}
  </div>
</div>
