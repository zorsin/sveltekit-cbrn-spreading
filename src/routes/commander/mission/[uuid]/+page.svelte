<script lang="ts">
  // throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");
  // Suggestion (check code before using, and possibly convert to data.X access later):
  // import type { PageData } from './$types';
  // export let data: PageData;
  // $: ({ mission } = data);

  import { Leaflet, Marker, Polyline } from '$lib/comps';
  import { goto, invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import { t } from 'svelte-intl-precompile';
  import { writable } from 'svelte/store';
  import type { PageData } from './$types';
  import { onDestroy } from 'svelte';
  import { Button, Checkbox, ContentGrid, PageTitle, Switch } from '$lib/skeleton';
  import { SolidLocationMarker, SolidRefresh, SolidTrash, SolidTruck } from '$lib/heroicons';

  export let data: PageData;
  const pageData = writable<PageData>();
  $: pageData.set(data);
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

  const startFilter = {};
  const unsubPageData = pageData.subscribe((data) => {
    if (!data?.mission) return;
    if (data.mission?.spreadLight) {
      lines = data.mission?.spreadLight;
    }

    if (data.mission?.spread?.start) {
      markerLocation = data?.mission?.spread.start;
      initialView = markerLocation;
    }
    data.mission?.units.forEach((element) => {
      startFilter[element.unitUuid] = true;
    });
  });

  const unitFilter = writable(startFilter);

  let unitMeasures = [];
  let toggleUpdate = false;
  let toggleSpread = true;
  let intervall;

  const onDelUnitClick = async (unitUuid: string) => {
    const res = await fetch(`/api/mission/units`, {
      method: 'delete',
      body: JSON.stringify({ missionUuid: $pageData?.mission?.uuid, unitUuid }),
    });
    if (res.ok) {
      // notifier.success($t('pages.commander-mission.delete-unit-success'));
      await invalidate('commander:mission');
    }
  };

  const updateMap = async () => {
    let filter = '';
    for (const [key, value] of Object.entries($unitFilter)) {
      if (value) filter += `&filter=${key}`;
    }
    const res = await fetch(`/api/mission/measure?mission=${$pageData?.mission?.uuid}${filter}`);
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

  onDestroy(() => {
    clearInterval(intervall);
    unsubPageData();
  });

  const onDelMissionClick = async () => {
    const res = await fetch(`/api/mission`, {
      method: 'delete',
      body: JSON.stringify({ uuid: $pageData?.mission?.uuid }),
    });
    if (res.ok) {
      // notifier.success($t('pages.commander-mission.delete-mission-success'));
      goto('/commander');
    }
  };

  const onRefreshUnitClick = async () => {
    await invalidate('commander:mission');
  };
</script>

<svelte:window on:resize={resizeMap} on:load={() => (loaded = true)} />

<ContentGrid>
  <PageTitle>{$t('pages.commander-mission.title')}</PageTitle>
  <span class="col-span-12 md:col-span-3 self-center"
    >{$t('pages.commander-mission.labels.code', {
      values: { code: $pageData?.mission?.code },
    })}</span>
  <Switch name="show-spread" class="col-span-12 md:col-span-3 order-1 self-center" bind:checked={toggleSpread}
    >{$t('pages.commander-mission.labels.spread')}</Switch>

  <Button class="col-span-12 md:col-span-3 order-3 md:order-2 self-center variant-ringed" on:click={updateMap} disabled={toggleUpdate}>
    <div class="flex justify-center">
      <SolidRefresh class="h-5 w-5 mr-4" />
      {$t('pages.commander-mission.labels.update-manual')}
    </div>
  </Button>
  <Switch name="enable-update" class="col-span-12 md:col-span-3 order-2 md:order-3 self-center" bind:checked={toggleUpdate}>
    {$t('pages.commander-mission.labels.update-auto')}</Switch>
  <div class="row-start-6 md:row-start-3 col-span-12 md:col-start-1 md:col-end-10 h-[20rem] md:h-[37rem] order-4">
    <!-- map -->
    {#if loaded || document.readyState === 'complete'}
      <Leaflet bind:map view={initialView} zoom={14}>
        {#if toggleSpread}
          {#each lines as line (line.id)}
            <Polyline latLngs={line.latLngs} color={line.color} />
          {/each}
          {#if markerLocation}
            <Marker latLng={markerLocation} width={40} height={40} class="text-primary-500 flex items-center flex-col">
              <SolidLocationMarker class="w-full h-full relative -top-[19px]" />
              <small class="w-max h-full relative -top-[19px] block bg-white p-0.5 rounded border border-primary-500">Start</small>
            </Marker>
          {/if}
        {/if}
        {#each unitMeasures as measure}
          {@const lastVehicle = measure.lines[measure.lines.length - 1]?.latLngs[1]}
          {#if lastVehicle}
            <Marker latLng={lastVehicle} height={30} width={30} class="text-primary-500 flex items-center flex-col">
              <SolidTruck class="w-full h-full relative -top-[14px]" />
              <small class="w-max h-full relative -top-[14px] block bg-white p-0.5 rounded border border-primary-500"
                >{$pageData?.mission?.units.find((unit) => unit.unitUuid == measure.unitUuid).radio}</small>
            </Marker>
          {/if}
          {#each measure.lines as line (line.id)}
            <Polyline latLngs={line.latLngs} color={line.color} />
          {/each}
        {/each}
      </Leaflet>
    {/if}
  </div>

  <div class="row-start-7 md:row-start-3 col-span-12 md:col-start-10 md:col-end-13 relative order-5">
    <!-- units -->
    <h4 class="text-lg">{$t('pages.commander-mission.labels.units')}</h4>
    <Button class="!absolute top-0 right-0" on:click={onRefreshUnitClick}>
      <SolidRefresh class="h-5 w-5" />
    </Button>
    <div class="flex flex-col">
      {#key $pageData?.mission?.units}
        {#each $pageData?.mission?.units as unit}
          <div class="mt-4 grid grid-cols-5 gap-2 items-center border-2 border-tertiary-500 rounded py-2 px-2">
            <div>
              <Checkbox bind:checked={$unitFilter[unit.unitUuid]} />
            </div>
            <div class="col-span-3">
              <h3>
                {unit.radio}
              </h3>
              <h6>{unit.vehicle}</h6>
              <small>{unit.crew}</small>
            </div>
            <div>
              <Button on:click={() => onDelUnitClick(unit.unitUuid)}>
                <SolidTrash class="h-5 w-5" />
              </Button>
            </div>
          </div>
        {/each}
      {/key}
    </div>
  </div>
  <Button class="col-span-12 md:col-span-2 md:col-start-8 order-last variant-filled-error self-end" on:click={onDelMissionClick}
    >{$t('pages.commander-mission.labels.delete-mission')}</Button>
</ContentGrid>
