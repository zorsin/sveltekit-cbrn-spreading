<script lang="ts">
  import { Leaflet, Polyline, Marker } from '$lib/comps';
  import { t } from 'svelte-intl-precompile';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import { Button, PageTitle, ContentGrid } from '$lib/skeleton';
  import { SolidLocationMarker } from '$lib/heroicons';
  import { modalStore, toastStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
  import { superForm } from 'sveltekit-superforms/client';
  import ModalStartSpread from '$lib/skeleton/modals/ModalStartSpread.svelte';

  export let data: PageData;
  const { form, errors, enhance, tainted } = superForm(data.form);
  const { spreadId, spread, lines } = data;

  let displayText = spreadId;
  if (spread) {
    displayText = spread.name;
    $form = { ...(spread as any), start: `${spread.start[0]},${spread.start[1]}` };
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
  //#endregion leaflet

  const showDelModal = () => {
    modalStore.trigger({
      type: 'confirm',
      title: $t('pages.commander-view.dialog.title'),
      body: $t('pages.commander-view.dialog.descr'),
      response: async (r: boolean) => {
        console.log('del', r);
        if (r) {
          const resp = await fetch(`/api/spread?id=${spread.uuid}`, {
            method: 'delete',
          });
          if (resp.ok) {
            toastStore.trigger({
              background: 'variant-filled-success',
              message: $t('pages.commander-view.delete-success'),
              timeout: 2000,
            });
            goto('/commander');
          } else {
            const msgResp = await resp.json();
            toastStore.trigger({
              background: 'variant-filled-error',
              message: $t(msgResp.msg),
            });
          }
        }
      },
      buttonTextConfirm: $t('common.delete'),
      buttonTextCancel: $t('common.back'),
    });
  };

  const showStartModal = () => {
    const modalComponent: ModalComponent = {
      ref: ModalStartSpread,
      props: { form, errors, enhance, tainted },
    };
    const d: ModalSettings = {
      type: 'component',
      component: modalComponent,
      title: $t('pages.commander-view.dialog.start-title'),
      body: $t('pages.commander-view.dialog.start-descr'),
    };
    modalStore.trigger(d);
  };
</script>

<svelte:window on:resize={resizeMap} on:load={() => (loaded = true)} />

<ContentGrid>
  <PageTitle>{$t('pages.commander-view.title', { values: { id: displayText } })}</PageTitle>
  <div class="col-span-12 h-[20rem] md:h-[37rem]">
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
  <Button class="col-span-12 md:col-span-2 variant-filled-error" on:click={() => showDelModal()}>{$t('pages.commander-view.delte')}</Button>
  <Button class="col-span-12  md:col-span-2 variant-filled-primary" on:click={() => showStartModal()}
    >{$t('pages.commander-view.start')}</Button>
</ContentGrid>
