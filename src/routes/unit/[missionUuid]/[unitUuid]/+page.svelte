<script lang="ts">
  import { Leaflet, Marker, Polyline } from '$lib/comps';

  import { t } from 'svelte-intl-precompile';
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  import { PageTitle, Switch, ContentGrid } from '$lib/skeleton';
  import { SolidTruck } from '$lib/heroicons';
  import { getContext, onDestroy } from 'svelte';
  import type { UnitMissionSettings } from '$types/Context';
  import Cog8Tooth from '$lib/heroicons/Cog8Tooth.svelte';
  import { drawerStore } from '@skeletonlabs/skeleton';

  export let data: PageData;
  const { unit, mission, notify, demoMode } = data;

  let checkedDemo = false;
  let lastPoint;
  let measureValue = 0;
  let messureUuid = null;

  //#region leaflet
  const { enableGPS, enableMeasure, coords } = getContext<UnitMissionSettings>('UNIT_MISSION_SETTINGS');

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

  $: if ($enableMeasure && messureUuid && markerLocation?.length == 2) updateLocation();
  $: if ($enableMeasure) {
    setupMeasure();
  }

  if (notify) {
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
      $enableMeasure = false;
    }
  };

  const updateLocation = async () => {
    if (!$enableMeasure) return;
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
    }
  };

  const unsub = coords.subscribe((value) => {
    if (value[0] > 1 && value[1] > 1) {
      markerLocation = [value[1], value[0]];
      initialView = [value[1], value[0]];
    }
  });

  onDestroy(() => {
    unsub();
  });

  const openSettings = () => {
    drawerStore.open({ id: 'unit-mission-settings', position: 'bottom' });
  };
</script>

<svelte:window on:resize={resizeMap} on:load={() => (loaded = true)} />

<ContentGrid>
  <PageTitle class="flex justify-between">
    {$t('pages.unit-mission.title', { values: { unit: unit?.radio } })}<button class="w-8 h-8 md:hidden" on:click={openSettings}
      ><Cog8Tooth /></button
    ></PageTitle>

  {#if demoMode}
    <Switch name="demo" class="col-span-12 row-start-7 md:col-span-2 md:row-start-2" bind:checked={checkedDemo}>Demo Point</Switch>
  {/if}
  <Switch class="hidden md:block md:col-start-8 md:col-end-10" name="enableGPS" bind:checked={$enableGPS}
    >{$t('pages.unit-mission.labels.gps')}
  </Switch>
  <Switch class="hidden md:block  md:col-start-10 md:col-end-13" name="enableMeasure" bind:checked={$enableMeasure}
    >{$t('pages.unit-mission.labels.start')}</Switch>
  <div class="md:row-start-3 col-span-12 md:col-start-1 md:col-end-9 h-[20rem] md:h-[37rem]">
    {#if loaded || document.readyState === 'complete'}
      <Leaflet bind:map view={initialView} zoom={15} on:click={onMapClick}>
        {#if markerLocation}
          <Marker latLng={markerLocation} height={30} width={30} class="text-secondary-500">
            <SolidTruck class="w-full h-full relative -top-[14px]" />
          </Marker>
        {/if}
        {#each lines as line (line.id)}
          <Polyline latLngs={line.latLngs} color={line.color} />
        {/each}
      </Leaflet>
    {/if}
  </div>
  <div class="col-span-12 md:row-start-3 md:col-start-9 md:col-end-13 flex flex-col">
    <h2 class="h2 mb-4">{$t('pages.unit-mission.labels.unit')}</h2>
    <p>{$t('pages.unit-mission.labels.radio', { values: { radio: unit?.radio } })}</p>
    <p>{$t('pages.unit-mission.labels.crew', { values: { crew: unit?.crew } })}</p>
    <p>{$t('pages.unit-mission.labels.vehicle', { values: { crew: unit?.vehicle } })}</p>
    <div class="hidden md:block">
      <h3 class="h3 mt-4">{$t('pages.unit-mission.labels.measurement')}</h3>
      <p>{$t('pages.unit-mission.labels.value', { values: { value: measureValue / 1000 } })}</p>
      <div class="w-full h-5" style="background-color: {lastColor};" />
    </div>
  </div>
  <div class="col-span-12 row-start-2 mb-4 md:hidden">
    <h3 class="h3 mt-4">{$t('pages.unit-mission.labels.measurement')}</h3>
    <p>{$t('pages.unit-mission.labels.value', { values: { value: measureValue / 1000 } })}</p>
    <div class="w-full h-5" style="background-color: {lastColor};" />
  </div>
</ContentGrid>
