<script lang="ts">
  import { t } from 'svelte-intl-precompile';
  import { Leaflet, Polyline, Marker } from '$lib/comps';
  import { goto } from '$app/navigation';
  import { sleep } from '$lib/logic/util';
  import { superForm } from 'sveltekit-superforms/client';
  import { convertInputToLatLng } from '$lib/util/converter';
  import { Button, ContentGrid, PageTitle, Switch, TextField, NumberField, Select, ModalSaveSpread } from '$lib/skeleton';

  import { SpreadModes } from './spread-schema';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
  import type { Snapshot } from './$types';
  import { SolidLocationMarker } from '$lib/heroicons';
  import { modalStore, toastStore, type ModalComponent, type ModalSettings, type ToastSettings } from '@skeletonlabs/skeleton';
  import { onDestroy } from 'svelte';

  export let data;
  let formData;
  export { formData as form };
  const { form, errors, enhance, capture, restore, tainted } = superForm(data.form);
  const { form: saveForm, errors: saveErrors, enhance: saveEnhance, tainted: saveTainted } = superForm(data.saveForm);
  export const snapshot: Snapshot = {
    capture,
    restore,
  };

  let map;
  let loaded = false;
  let isViewed = false;
  let lines = [];
  let selectStart = false;
  let markerLocation;
  $: console.log('formData PAGE', formData);
  $: if (formData?.view && formData.view.success) {
    isViewed = true;
    lines = formData.view.lines;
    markerLocation = formData.view.markerLocation;
  } else {
    isViewed = false;
    lines = [];
    markerLocation = undefined;
  }

  $: if (formData?.saveForm && formData.saveForm.valid && formData?.save && formData.save.success) {
    modalStore.close();
    formData.save.name;
    const toast: ToastSettings = {
      message: $t('pages.commander-create.notification', { values: { name: formData.save.name, id: formData.save.id } }),
      timeout: 5000,
    };
    toastStore.trigger(toast);
    goto('/commander');
  }

  //#region Leaflet

  const initialView = !$errors.start && convertInputToLatLng($form.start);

  function resizeMap() {
    if (map) {
      map.invalidateSize();
    }
  }

  function resetMapView() {
    map.setView(initialView, 13);
  }

  const onMapClick = () => {
    selectStart = false;
    markerLocation = convertInputToLatLng($form.start);
  };
  const onMapMouseMove = (event) => {
    if (selectStart) {
      markerLocation = event.detail.latlng;
      $form.start = `${event.detail.latlng.lat}, ${event.detail.latlng.lng}`;
    }
  };

  const onLayerAdd = (event) => {
    const newLayer = event.detail.layer;
    if (newLayer.getBounds) {
      map.fitBounds(newLayer.getBounds());
    }
  };

  //#endregion Leaflet

  const handelError = (errors: string[] | undefined): string | undefined => {
    if (errors && errors.length > 0) {
      return $t(`pages.commander-create.${errors[0]}`);
    }
    return undefined;
  };

  $: disableSave = (function () {
    if (Object.keys($errors).length > 0) {
      return true;
    }
    if ($tainted) {
      return true;
    }
    if (isViewed === false) {
      return true;
    }
    return false;
  })();

  const spreadModes = [
    {
      value: 'ellipse',
      text: $t('common.spreadmodes.ellipse'),
    },
    {
      value: 'triangle',
      text: $t('common.spreadmodes.triangle'),
    },
  ];

  const showSaveModal = () => {
    const modalComponent: ModalComponent = {
      // Pass a reference to your custom component
      ref: ModalSaveSpread,
      // Add the component properties as key/value pairs
      props: { form: saveForm, errors: saveErrors, enhance: saveEnhance, tainted: saveTainted },
    };
    const d: ModalSettings = {
      type: 'component',
      component: modalComponent,
      title: $t('pages.commander-create.dialog.title'),
      body: $t('pages.commander-create.dialog.descr'),
    };
    modalStore.trigger(d);
  };

  const unsubFrom = form.subscribe((value) => {
    $saveForm = {
      ...$saveForm,
      ...value,
    };
  });
  onDestroy(() => {
    unsubFrom();
  });
</script>

<svelte:window on:resize={resizeMap} on:load={() => (loaded = true)} />

<ContentGrid>
  <PageTitle>{$t('pages.commander-create.title')}</PageTitle>
  <div class="col-span-9 z-20 pr-4">
    {#if loaded || document.readyState === 'complete'}
      <Leaflet bind:map view={initialView} zoom={13} on:click={onMapClick} on:mousemove={onMapMouseMove} on:layeradd={onLayerAdd}>
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
  <form class="col-span-3 grid grid-cols-1 gap-2" method="POST" action="?/view" use:enhance>
    <!-- controles -->
    <div class="flex gap-2 flex-col">
      <TextField
        label={$t('pages.commander-create.labels.start')}
        bind:value={$form.start}
        name="start"
        error={handelError($errors.start)} />
      <Switch name="select-point" bind:checked={selectStart}>{$t('pages.commander-create.labels.select-start')}</Switch>
    </div>
    <Select label={$t('pages.commander-create.labels.mode')} name="mode" options={spreadModes} bind:value={$form.mode} />
    <NumberField
      label={$t('pages.commander-create.labels.length')}
      bind:value={$form.length}
      name="length"
      error={handelError($errors.length)} />
    {#if $form.mode === SpreadModes.ellipse}
      <NumberField
        label={$t('pages.commander-create.labels.width')}
        bind:value={$form.width}
        name="width"
        error={handelError($errors.width)} />
    {:else if $form.mode === SpreadModes.triangle}
      <NumberField
        label={$t('pages.commander-create.labels.openingAngle')}
        bind:value={$form.openingAngle}
        name="openingAngle"
        error={handelError($errors.openingAngle)} />
    {/if}
    <NumberField
      label={$t('pages.commander-create.labels.angle')}
      bind:value={$form.angle}
      name="angle"
      error={handelError($errors.angle)} />
    <NumberField
      label={$t('pages.commander-create.labels.strength')}
      bind:value={$form.strength}
      name="strength"
      error={handelError($errors.strength)} />
    <Switch name="showStrength" bind:checked={$form.showStrength}>{$t('pages.commander-create.labels.show-strength')}</Switch>
    <div class="flex flex-col lg:flex-row gap-4">
      <Button class="flex-1 variant-filled" type="submit">{$t('common.view')}</Button>
      <Button class="flex-1 variant-filled" on:click={() => showSaveModal()} disabled={disableSave} type="button"
        >{$t('common.save')}</Button>
    </div>
  </form>
  <h3 class="col-span-12 mt-4">{$t('pages.commander-create.labels.winddirections')}</h3>
  <div class="hidden col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-y-1.5 mt-4">
    <span>{$t('common.directions.n', { values: { angle: 0 } })}</span>
    <span>{$t('common.directions.nno', { values: { angle: 22.5 } })}</span>
    <span>{$t('common.directions.no', { values: { angle: 45 } })}</span>
    <span>{$t('common.directions.ono', { values: { angle: 67.5 } })}</span>
    <span>{$t('common.directions.o', { values: { angle: 90 } })}</span>
    <span>{$t('common.directions.oso', { values: { angle: 112.5 } })}</span>
    <span>{$t('common.directions.so', { values: { angle: 135 } })}</span>
    <span>{$t('common.directions.sso', { values: { angle: 157.5 } })}</span>
    <span>{$t('common.directions.s', { values: { angle: 180 } })}</span>
    <span>{$t('common.directions.ssw', { values: { angle: 202.5 } })}</span>
    <span>{$t('common.directions.sw', { values: { angle: 225 } })}</span>
    <span>{$t('common.directions.wsw', { values: { angle: 247.5 } })}</span>
    <span>{$t('common.directions.w', { values: { angle: 270 } })}</span>
    <span>{$t('common.directions.wnw', { values: { angle: 292.5 } })}</span>
    <span>{$t('common.directions.nw', { values: { angle: 315 } })}</span>
    <span>{$t('common.directions.nnw', { values: { angle: 337.5 } })}</span>
  </div>
</ContentGrid>
<SuperDebug data={{ $form, $saveForm }} />
