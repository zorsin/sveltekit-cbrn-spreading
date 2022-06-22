<script lang="ts">
  import { PageTitle, Button, TextField, Switch, SolidLocationMarker, Dialog } from '$lib/smelte';
  import { createForm } from 'felte';
  import { t } from 'svelte-intl-precompile';
  import { Leaflet, Polyline, Marker } from '$lib/comps';
  import { goto } from '$app/navigation';
  import { sleep } from '$lib/logic/util';

  const regexp = /^\d+$/;
  const regexpPoint = /^(-?\d{1,3}\.\d+)(\,?\s?)(-?\d{1,3}\.\d+)$/;
  const initialValues = {
    start: '',
    width: '200',
    length: '1000',
    angle: '0',
    strength: '50000',
  };
  const { form, errors, setFields, data, isValid, interacted } = createForm({
    onSubmit: async ({ start, width, length, angle, strength }) => {
      lines = [];
      markerLocation = null;
      const result = await fetch('/api/spread/calc', {
        method: 'POST',
        body: JSON.stringify({
          start: convertInputToLatLng(start),
          width: parseInt(width),
          length: parseInt(length),
          angle: parseInt(angle),
          strength: parseInt(strength),
        }),
      });
      const data = await result.json();
      lines = data.lines;
      isViewed = true;
      markerLocation = convertInputToLatLng(start);
    },
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
  let map;
  let loaded = false;
  let isViewed = false;
  let lines = [];
  let selectStart = false;
  let markerLocation;
  const initialView = [49.1273755, 9.2176877];

  function resizeMap() {
    if (map) {
      map.invalidateSize();
    }
  }

  function resetMapView() {
    map.setView(initialView, 13);
  }

  const convertInputToLatLng = (input) => {
    if (input && typeof input === 'string') {
      const stringLatLon = input.split(',');
      return [parseFloat(stringLatLon[0]), parseFloat(stringLatLon[1])];
    }
  };

  const onMapClick = () => {
    selectStart = false;
    markerLocation = convertInputToLatLng($data.start);
  };
  const onMapMouseMove = (event) => {
    if (selectStart) {
      setFields('start', `${event.detail.latlng.lat}, ${event.detail.latlng.lng}`, true);
      initialValues.start = `${event.detail.latlng.lat}, ${event.detail.latlng.lng}`;
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

  const onBtnSave = async () => {
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
    if (result.ok) {
      showDialog = false;
      await sleep(10);
      goto('/commander');
    }
  };

  const closeDialog = () => {
    showDialog = false;
    nameValue = '';
  };
</script>

<svelte:window on:resize={resizeMap} on:load={() => (loaded = true)} />

<PageTitle>{$t('pages.commander-create.title')}</PageTitle>

<Dialog bind:value={showDialog} persistent>
  <h5 slot="title">{$t('pages.commander-create.dialog.title')}</h5>
  <div>{$t('pages.commander-create.dialog.descr')}</div>
  <TextField label={$t('pages.commander-create.dialog.label-name')} bind:value={nameValue} />
  <div slot="actions">
    <Button on:click={closeDialog}>{$t('common.back')}</Button>
    <Button on:click={onBtnSave}>{$t('common.save')}</Button>
  </div>
</Dialog>
<div class="grid(& cols-4) gap-4">
  <div class="col-span-3 h-[40rem] bg-error-500 z-20">
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
  <div>
    <form use:form>
      <div>
        <TextField
          name="start"
          label={$t('pages.commander-create.labels.start')}
          error={!!$errors.start}
          hint={$errors.start?.[0]}
          bind:value={initialValues.start}
        />
        <Switch label={$t('pages.commander-create.labels.select-start')} bind:value={selectStart} />
      </div>
      <TextField
        name="length"
        label={$t('pages.commander-create.labels.length')}
        error={!!$errors.length}
        hint={$errors.length?.[0]}
        bind:value={initialValues.length}
      />
      <TextField
        name="width"
        label={$t('pages.commander-create.labels.width')}
        error={!!$errors.width}
        hint={$errors.width?.[0]}
        bind:value={initialValues.width}
      />
      <TextField
        name="angle"
        label={$t('pages.commander-create.labels.angle')}
        error={!!$errors.angle}
        hint={$errors.angle?.[0]}
        bind:value={initialValues.angle}
      />
      <TextField
        name="strength"
        label={$t('pages.commander-create.labels.strength')}
        error={!!$errors.strength}
        hint={$errors.strength?.[0]}
        bind:value={initialValues.strength}
      />
      <div class="flex gap-6">
        <Button type="submit" disabled={!$isValid}>{$t('common.view')}</Button>
        {#if isViewed && $interacted === null}
          <Button disabled={!$isValid} on:click={() => (showDialog = true)}
            >{$t('common.save')}</Button
          >
        {/if}
      </div>
    </form>
  </div>
</div>
