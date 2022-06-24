<script lang="ts">
  import {
    PageTitle,
    Checkbox,
    SolidTrash,
    notifier,
    SolidTruck,
    Switch,
    SolidLocationMarker,
  } from '$lib/smelte';
  import { Leaflet, Marker, Polyline } from '$lib/comps';
  import { goto, invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import Button from '$lib/smelte/components/Button/Button.svelte';
  import { t } from 'svelte-intl-precompile';
  import { writable } from 'svelte/store';

  export let mission;

  //#region leaflet

  let map;
  let loaded = false;
  let lines = [];
  let markerLocation;
  let initialView = [49.1273755, 9.2176877];

  function resizeMap() {
    if (map) {
      map.invalidateSize();
    }
  }
  //#endregion leaflet

  if (mission.spreadLight) {
    lines = mission.spreadLight;
  }

  if (mission?.spread?.start) {
    markerLocation = mission.spread.start;
    initialView = markerLocation;
  }

  const startFilter = {};
  mission.units.forEach((element) => {
    startFilter[element.unitUuid] = true;
  });
  const unitFilter = writable(startFilter);

  let unitMeasures = [];
  let toggleUpdate = false;
  let intervall;

  const onDelUnitClick = async (unitUuid: string) => {
    const res = await fetch(`/api/mission/units`, {
      method: 'delete',
      body: JSON.stringify({ missionUuid: mission.uuid, unitUuid }),
    });
    if (res.ok) {
      notifier.success($t('pages.commander-mission.delete-unit-success'));
      await invalidate($page.url.pathname);
    }
  };

  const updateMap = async () => {
    let filter = '';
    for (const [key, value] of Object.entries($unitFilter)) {
      if (value) filter += `&filter=${key}`;
    }
    const res = await fetch(`/api/mission/measure?mission=${mission.uuid}${filter}`);
    if (res.ok) {
      const data = await res.json();
      unitMeasures = data.measures;
    }
  };

  $: if (toggleUpdate) {
    intervall = setInterval(() => updateMap(), 2000);
  } else {
    clearInterval(intervall);
  }

  const onDelMissionClick = async () => {
    const res = await fetch(`/api/mission`, {
      method: 'delete',
      body: JSON.stringify({ uuid: mission.uuid }),
    });
    if (res.ok) {
      notifier.success($t('pages.commander-mission.delete-mission-success'));
      goto('/commander');
    }
  };
</script>

<svelte:window on:resize={resizeMap} on:load={() => (loaded = true)} />

<PageTitle>{$t('pages.commander-mission.title')}</PageTitle>
<div class="grid(& cols-12) gap-4">
  <span class="col-span-2"
    >{$t('pages.commander-mission.labels.code', { values: { code: mission.code } })}</span
  >
  <Switch
    class="col(start-10 end-13)"
    label={$t('pages.commander-mission.labels.update')}
    bind:value={toggleUpdate}
  />
  <div class="row-start-2 col(start-1 end-10) h-[40rem]">
    <!-- map -->
    {#if loaded || document.readyState === 'complete'}
      <Leaflet bind:map view={initialView} zoom={14}>
        {#each lines as line (line.id)}
          <Polyline latLngs={line.latLngs} color={line.color} />
        {/each}
        {#if markerLocation}
          <Marker
            latLng={markerLocation}
            width={40}
            height={40}
            class="text-primary-500 flex items-center flex-col"
          >
            <SolidLocationMarker class="w-full h-full relative -top-[19px]" />
            <small
              class="w-max h-full relative -top-[19px] block bg-white p-0.5 rounded border border-primary-500"
              >Start</small
            >
          </Marker>
        {/if}
        {#each unitMeasures as measure}
          {@const lastVehicle = measure.lines[measure.lines.length - 1]?.latLngs[1]}
          {#if lastVehicle}
            <Marker
              latLng={lastVehicle}
              height={30}
              width={30}
              class="text-primary-500 flex items-center flex-col"
            >
              <SolidTruck class="w-full h-full relative -top-[14px]" />
              <small
                class="w-max h-full relative -top-[14px] block bg-white p-0.5 rounded border border-primary-500"
                >{mission.units.find((unit) => unit.unitUuid == measure.unitUuid).radio}</small
              >
            </Marker>
          {/if}
          {#each measure.lines as line (line.id)}
            <Polyline latLngs={line.latLngs} color={line.color} />
          {/each}
        {/each}
      </Leaflet>
    {/if}
  </div>
  <div class="row-start-2 col(start-10 end-13) ">
    <!-- units -->
    <h4 class="text-lg">{$t('pages.commander-mission.labels.units')}</h4>
    <div class="flex flex-col">
      {#each mission.units as unit}
        <div
          class="bg-dark-500 mt-4 grid(& cols-5) gap-2 items-center border(& 2 primary-700) rounded py-2"
        >
          <div>
            <Checkbox bind:checked={$unitFilter[unit.unitUuid]} />
          </div>
          <div class="col-span-3">
            <h6 class="text-base mb-2">{unit.radio} - {unit.vehicle}</h6>
            <p class="text-sm">{unit.crew}</p>
          </div>
          <div>
            <Button on:click={() => onDelUnitClick(unit.unitUuid)}>
              <SolidTrash class="h-5 w-5" />
            </Button>
          </div>
        </div>
      {/each}
    </div>
  </div>
  <Button class="col-span-2" on:click={onDelMissionClick}
    >{$t('pages.commander-mission.labels.delete-mission')}</Button
  >
</div>
