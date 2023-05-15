<script lang="ts">
  import { Leaflet, Marker, Polyline } from '$lib/comps';
  import Geolocation from 'svelte-geolocation';
  import type { GeolocationCoords } from 'svelte-geolocation/types/Geolocation.svelte';
  import { t } from 'svelte-intl-precompile';
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import ContentGrid from '$lib/skeleton/ContentGrid.svelte';
  import { PageTitle, Switch } from '$lib/skeleton';
  import { SolidTruck } from '$lib/heroicons';
  export let data: PageData;
  const { unit, mission, notify } = data;

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

  if (notify) {
    // notifier.success($t(notify));
    goto($page.url.pathname);
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
      // notifier.error($t('pages.unit-mission.errors.start-measure'));
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
      // notifier.error($t('pages.unit-mission.errors.update-point'));
    }
  };

  $: if (coords && coords[0] > 1 && coords[1] > 1) {
    markerLocation = [coords[1], coords[0]];
    initialView = [coords[1], coords[0]];
  }
</script>

<svelte:window on:resize={resizeMap} on:load={() => (loaded = true)} />
<Geolocation {getPosition} watch={true} bind:coords />

<ContentGrid>
  <PageTitle>{$t('pages.unit-mission.title', { values: { unit: unit?.radio } })}</PageTitle>
  <Switch name="demo" class="col-span-2" bind:checked={checkedDemo}>Demo Point</Switch>
  <Switch class="col-span-6 md:col-start-8 md:col-end-10" name="enableGPS" bind:checked={getPosition}
    >{$t('pages.unit-mission.labels.gps')}
  </Switch>
  <Switch class="col-span-6 md:col-start-10 md:col-end-13" name="enableMeasure" bind:checked
    >{$t('pages.unit-mission.labels.start')}</Switch>
  <div class="row-start-3 col-span-12 md:col-start-1 md:col-end-9 h-[20rem] md:h-[37rem]">
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
  <div class="row-start-4 md:row-start-3 col-span-12 md:col-start-9 md:col-end-13 flex flex-col">
    <h5 class="text-xl">{$t('pages.unit-mission.labels.unit')}</h5>
    <p>{$t('pages.unit-mission.labels.radio', { values: { radio: unit?.radio } })}</p>
    <p>{$t('pages.unit-mission.labels.crew', { values: { crew: unit?.crew } })}</p>
    <p>{$t('pages.unit-mission.labels.vehicle', { values: { crew: unit?.vehicle } })}</p>
    <h5 class="text-xl mt-4">{$t('pages.unit-mission.labels.measurement')}</h5>
    <p>{$t('pages.unit-mission.labels.value', { values: { value: measureValue / 1000 } })}</p>
    <div class="w-full h-5" style="background-color: {lastColor};" />
  </div>
</ContentGrid>
