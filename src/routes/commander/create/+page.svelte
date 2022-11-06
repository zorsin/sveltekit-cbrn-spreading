<script lang="ts">
  import {
    PageTitle,
    Button,
    TextField,
    Switch,
    SolidLocationMarker,
    Dialog,
    notifier,
  } from '$lib/smelte';
  import { createForm } from 'felte';
  import { t } from 'svelte-intl-precompile';
  import { Leaflet, Polyline, Marker } from '$lib/comps';
  import { goto } from '$app/navigation';
  import { sleep } from '$lib/logic/util';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { convertInputToLatLng } from '$lib/util/converter';
  import { writable } from 'svelte/store';
  import Select from '$lib/smelte/components/Select/Select.svelte';

  const regexp = /^\d+$/;
  const regexpPoint = /^(-?\d{1,3}\.\d+)(\,?\s?)(-?\d{1,3}\.\d+)$/;
  let map;
  let loaded = false;
  let isViewed = false;
  let lines = [];
  let selectStart = false;
  let markerLocation;

  const initialValues = writable({
    start: '',
    width: '200',
    length: '1000',
    angle: '0',
    strength: '50000',
    showStrength: false,
    mode: 'ellipse',
  });

  $: if ($page.form) {
    markerLocation = $page.form.markerLocation;
    isViewed = $page.form.isViewed;
    lines = $page.form.lines;
    initialValues.set({
      start: $page.form.start,
      width: $page.form.width,
      length: $page.form.length,
      angle: $page.form.angle,
      strength: $page.form.strength,
      showStrength: $page.form.showStrength,
      mode: $page.form.mode,
    });
    setFields('start', $page.form.start, true);
    setFields('width', $page.form.width, true);
    setFields('length', $page.form.length, true);
    setFields('angle', $page.form.angle, true);
    setFields('strength', $page.form.strength, true);
    setFields('showStrength', $page.form.showStrength, true);
    setFields('mode', $page.form.mode, true);
    selectStart = false;
  }
  const { form, errors, setFields, data, isValid, interacted } = createForm({
    validate: (values) => {
      const errors: Record<string, string[] | boolean> = {
        width: false,
        length: false,
        angle: false,
        strength: false,
      };

      if (!regexpPoint.test(<string>values.start)) {
        errors.start = [$t('pages.commander-create.errors.start')];
      }
      if (!regexp.test('' + values.width)) {
        errors.width = [$t('pages.commander-create.errors.width')];
      }
      if (!regexp.test('' + values.length)) {
        errors.length = [$t('pages.commander-create.errors.length')];
      }
      if (!regexp.test('' + values.angle)) {
        errors.angle = [$t('pages.commander-create.errors.angle')];
      }
      if (!regexp.test('' + values.strength)) {
        errors.strength = [$t('pages.commander-create.errors.strength')];
      }

      return errors;
    },
  });

  //#region Leaflet

  const initialView = [49.1273755, 9.2176877];

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
    markerLocation = convertInputToLatLng($data.start);
  };
  const onMapMouseMove = (event) => {
    if (selectStart) {
      setFields('start', `${event.detail.latlng.lat}, ${event.detail.latlng.lng}`, true);
      $initialValues.start = `${event.detail.latlng.lat}, ${event.detail.latlng.lng}`;
    }
  };

  const onLayerAdd = (event) => {
    const newLayer = event.detail.layer;
    if (newLayer.getBounds) {
      map.fitBounds(newLayer.getBounds());
    }
  };

  //#endregion Leaflet

  let showDialog = false;
  let nameValue = '';
  let nameError = null;
  let saving = false;
  // let showStrength = false;

  const onBtnSave = async () => {
    saving = true;
    const result = await fetch('/api/spread/save', {
      method: 'POST',
      body: JSON.stringify({
        name: nameValue,
        start: convertInputToLatLng($data.start),
        width: parseInt($data.width),
        length: parseInt($data.length),
        angle: parseInt($data.angle),
        strength: parseInt($data.strength),
      }),
    });
    const resp = await result.json();
    if (result.ok) {
      notifier.success(
        $t('pages.commander-create.notification', { values: { name: resp.name, id: resp.id } }),
      );
      // showDialog = false;
      await sleep(20);
      goto('/commander');
    } else {
      if (result.status === 400) {
        saving = false;
        nameError = $t('pages.commander-create.errors.name-exists');
        notifier.alert(
          $t('pages.commander-create.notification-exists', { values: { name: nameValue } }),
        );
      } else {
        notifier.error($t(resp.msg));
        showDialog = false;
      }
    }
  };

  $: if (nameValue) {
    nameError = null;
  }

  const closeDialog = () => {
    showDialog = false;
    nameValue = '';
  };

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
</script>

<svelte:window on:resize={resizeMap} on:load={() => (loaded = true)} />

<PageTitle>{$t('pages.commander-create.title')}</PageTitle>

<Dialog bind:value={showDialog} persistent loading={saving} progresscolor="white">
  <h5 slot="title">{$t('pages.commander-create.dialog.title')}</h5>
  <div>{$t('pages.commander-create.dialog.descr')}</div>
  <TextField
    label={$t('pages.commander-create.dialog.label-name')}
    bind:value={nameValue}
    error={nameError}
    hint={nameError}
  />
  <div slot="actions">
    <Button on:click={closeDialog}>{$t('common.back')}</Button>
    <Button on:click={onBtnSave}>{$t('common.save')}</Button>
  </div>
</Dialog>
<div class="grid(& cols-4) gap-4">
  <div class="col-span(4 md:3) h-[20rem] md:h-[37rem] bg-error-500 z-20">
    {#if loaded || document.readyState === 'complete'}
      <Leaflet
        bind:map
        view={initialView}
        zoom={13}
        on:click={onMapClick}
        on:mousemove={onMapMouseMove}
        on:layeradd={onLayerAdd}
      >
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
  <form class="col-span(4 md:1)" use:form use:enhance action="?/show" method="POST">
    <div>
      <TextField
        name="start"
        label={$t('pages.commander-create.labels.start')}
        error={!!$errors.start}
        hint={$errors.start?.[0]}
        value={$initialValues.start}
      />
      <Switch label={$t('pages.commander-create.labels.select-start')} bind:checked={selectStart} />
    </div>
    <Select
      items={spreadModes}
      name="mode"
      label={$t('pages.commander-create.labels.mode')}
      value={$initialValues.mode}
    />
    <TextField
      name="length"
      label={$t('pages.commander-create.labels.length')}
      error={!!$errors.length}
      hint={$errors.length?.[0]}
      bind:value={$initialValues.length}
    />
    <TextField
      name="width"
      label={$t('pages.commander-create.labels.width')}
      error={!!$errors.width}
      hint={$errors.width?.[0]}
      bind:value={$initialValues.width}
    />
    <TextField
      name="angle"
      label={$t('pages.commander-create.labels.angle')}
      error={!!$errors.angle}
      hint={$errors.angle?.[0]}
      bind:value={$initialValues.angle}
    />
    <TextField
      name="strength"
      label={$t('pages.commander-create.labels.strength')}
      error={!!$errors.strength}
      hint={$errors.strength?.[0]}
      bind:value={$initialValues.strength}
    />
    <Switch
      label={$t('pages.commander-create.labels.show-strength')}
      bind:checked={$initialValues.showStrength}
      name="showStrength"
    />
    <div class="flex(& col md:row) gap-4 md:gap-6">
      <Button type="submit" disabled={!$isValid} replace={{ 'w-max': 'w-full md:w-max' }}
        >{$t('common.view')}</Button
      >
      {#if isViewed && $interacted === null}
        <Button
          disabled={!$isValid}
          on:click={() => (showDialog = true)}
          replace={{ 'w-max': 'w-full md:w-max' }}>{$t('common.save')}</Button
        >
      {/if}
    </div>
  </form>
</div>
