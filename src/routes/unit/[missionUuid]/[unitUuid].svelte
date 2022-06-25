<script lang="ts">
  import { PageTitle, Button, TextField, Switch, SolidTruck, notifier } from '$lib/smelte';
  import { Leaflet, Marker, Polyline } from '$lib/comps';
  import { session } from '$app/stores';
  import Geolocation from 'svelte-geolocation';
  import type { GeolocationCoords } from 'svelte-geolocation/types/Geolocation.svelte';

  import { t } from 'svelte-intl-precompile';

  export let unit;
  export let mission;

  let checked = false;
  let checkedDemo = false;
  let lastPoint;
  let measureValue = 0;
  let messureUuid = null;
  let coords: GeolocationCoords;
  let getPosition = false;
  //#region leaflet

  let map;
  let loaded = false;
  let lines = [];
  let markerLocation;
  let lastColor = 'transparent';
  let initialView = [49.1273755, 9.2176877];

  function resizeMap() {
    if (map) {
      map.invalidateSize();
    }
  }

  const onMapClick = (event) => {
    if (checkedDemo) {
      // checkedDemo = false;
      markerLocation = [event.detail.latlng.lat, event.detail.latlng.lng];
      // updateLocation();
    }
  };
  //#endregion leaflet

  $: if (checked && messureUuid && markerLocation?.length == 2) updateLocation();
  $: if (checked) {
    setupMeasure();
  }

  const setupMeasure = async () => {
    const res = await fetch('/api/mission/measure', {
      method: 'POST',
      body: JSON.stringify({
        missionUuid: mission.uuid,
        unitUuid: unit.unitUuid,
      }),
    });
    if (res.ok) {
      const { uuid, lines: dblines } = await res.json();
      messureUuid = uuid;
      if (dblines) lines = dblines;
    } else {
      notifier.error($t('pages.unit-mission.errors.start-measure'));
      checked = false;
    }
  };

  const updateLocation = async () => {
    if (!checked) return;
    if (markerLocation?.length != 2) return;
    if (!lastPoint) {
      lastPoint = markerLocation;
      return;
    }
    const res = await fetch('/api/mission/measure', {
      method: 'PATCH',
      body: JSON.stringify({
        missionUuid: mission.uuid,
        unitUuid: unit.unitUuid,
        latLng: markerLocation,
        lastLatLng: lastPoint,
        id: lines.length,
      }),
    });
    if (res.ok) {
      const { color, value } = await res.json();
      measureValue = value;
      lastColor = color;
      const point = {
        id: lines.length,
        color,
        latLngs: [lastPoint, markerLocation],
      };
      lastPoint = markerLocation;
      lines = [...lines, point];
    } else {
      notifier.error($t('pages.unit-mission.errors.update-point'));
    }
  };

  $: if (coords && coords[0] > 1 && coords[1] > 1) {
    markerLocation = [coords[1], coords[0]];
    initialView = [coords[1], coords[0]];
  }
</script>

<svelte:window on:resize={resizeMap} on:load={() => (loaded = true)} />
<Geolocation {getPosition} watch={true} bind:coords />
<PageTitle>{$t('pages.unit-mission.title', { values: { unit: unit?.radio } })}</PageTitle>

<div class="grid(& cols-12) gap-4 md:gap-8 mt-8">
  <Switch
    class="col-span-2"
    classes={(s) => s.replace('inline-flex', 'hidden md:inline-flex')}
    label="Demo Point"
    bind:value={checkedDemo}
  />
  <Switch
    class="col(span-6 md:start-8 md:end-10)"
    label={$t('pages.unit-mission.labels.gps')}
    bind:value={getPosition}
  />
  <Switch
    class="col(span-6 md:start-10 md:end-13)"
    label={$t('pages.unit-mission.labels.start')}
    bind:value={checked}
  />
  <div class="row-start-2 col(span-12 md:start-1 md:end-9) h-[20rem] md:h-[37rem]">
    {#if loaded || document.readyState === 'complete'}
      <Leaflet bind:map view={initialView} zoom={15} on:click={onMapClick}>
        {#if markerLocation}
          <Marker latLng={markerLocation} height={30} width={30} class="text-primary-500">
            <SolidTruck class="w-full h-full relative -top-[14px]" />
          </Marker>
        {/if}
        {#each lines as line (line.id)}
          <Polyline latLngs={line.latLngs} color={line.color} />
        {/each}
      </Leaflet>
    {/if}
  </div>
  <div class="row-start-3 md:row-start-2 col(span-12 md:start-9 md:end-13) flex flex-col">
    <h5 class="text-xl">{$t('pages.unit-mission.labels.unit')}</h5>
    <p>{$t('pages.unit-mission.labels.radio', { values: { radio: unit?.radio } })}</p>
    <p>{$t('pages.unit-mission.labels.crew', { values: { crew: unit?.crew } })}</p>
    <p>{$t('pages.unit-mission.labels.vehicle', { values: { crew: unit?.vehicle } })}</p>
    <h5 class="text-xl mt-4">{$t('pages.unit-mission.labels.measurement')}</h5>
    <p>{$t('pages.unit-mission.labels.value', { values: { value: measureValue / 1000 } })}</p>
    <div class="w-full h-5" style="background-color: {lastColor};" />
  </div>
</div>
