<script lang="ts">
  import { PageTitle, SolidLocationMarker, notifier, Button, Dialog } from '$lib/smelte';
  import { Leaflet, Polyline, Marker } from '$lib/comps';
  import { Spread } from '$lib/model';

  import { t } from 'svelte-intl-precompile';
  import { goto } from '$app/navigation';

  export let spreadId;
  export let spread;
  export let lines = [];

  let displayText = spreadId;
  if (spread) {
    displayText = spread.name;
  }

  //#region leaflet
  let map;
  let loaded = false;
  let markerLocation = spread?.start;
  const initialView = spread?.start;

  function resizeMap() {
    if (map) {
      map.invalidateSize();
    }
  }

  function resetMapView() {
    map.setView(initialView, 13);
  }

  // const onLayerAdd = (event) => {
  //   const newLayer = event.detail.layer;
  //   if (newLayer.getBounds) {
  //     map && map.fitBounds(newLayer.getBounds());
  //   }
  // };
  //#endregion leaflet

  let showDelDialog = false;
  let loadingDel = false;
  const onDeleteClick = async () => {
    const resp = await fetch(`/api/spread?id=${spread.uuid}`, {
      method: 'delete',
    });
    console.log(resp);
    if (resp.ok) {
      notifier.success($t('pages.commander-view.delete-success'));
      goto('/commander');
    } else {
      const msgResp = await resp.json();
      notifier.success($t(msgResp.msg));
    }
  };
</script>

<svelte:window on:resize={resizeMap} on:load={() => (loaded = true)} />

<PageTitle>{$t('pages.commander-view.title', { values: { id: displayText } })}</PageTitle>

<div class="grid(& cols-12) gap-4">
  <div class="col-span-12 h-[40rem] z-20">
    {#if (loaded || document.readyState === 'complete') && window}
      <Leaflet bind:map view={initialView} zoom={13}>
        {#each lines as line (line.id)}
          <Polyline latLngs={line.latLngs} color={line.color} />
        {/each}
        {#if markerLocation}
          <Marker latLng={markerLocation} width={40} height={40} class="text-black">
            <SolidLocationMarker class="w-full h-full relative -top-[19px]" />
          </Marker>
        {/if}
      </Leaflet>
    {:else}
      <span>{$t('pages.commander-view.not-found')}</span>
    {/if}
  </div>
  <Dialog bind:value={showDelDialog} persistent progresscolor="white" loading={loadingDel}>
    <h5 slot="title">{$t('pages.commander-view.dialog.title')}</h5>
    <div>{@html $t('pages.commander-view.dialog.descr')}</div>
    <div slot="actions">
      <Button on:click={() => (showDelDialog = false)}>{$t('common.back')}</Button>
      <Button on:click={onDeleteClick}>{$t('common.delete')}</Button>
    </div>
  </Dialog>
  <Button class="col-span-4" on:click={() => (showDelDialog = true)}
    >{$t('pages.commander-view.delte')}</Button
  >
</div>
