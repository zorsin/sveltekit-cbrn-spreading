<script lang="ts">
  import { t } from 'svelte-intl-precompile';
  import { Leaflet, Polyline, Marker } from '$lib/comps';
  import { goto } from '$app/navigation';
  import { sleep } from '$lib/logic/util';
  import { superForm } from 'sveltekit-superforms/client';
  import { convertInputToLatLng } from '$lib/util/converter';
  import { Button, ContentGrid, PageTitle, Switch, TextField } from '$lib/skeleton';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
  import NumberField from '$lib/skeleton/NumberField.svelte';
  import Select from '$lib/skeleton/Select.svelte';
  import { SpreadModes } from './spread-schema';

  export let data;
  const regexp = /^\d+$/;
  const regexpPoint = /^(-?\d{1,3}\.\d+)(\,?\s?)(-?\d{1,3}\.\d+)$/;
  let map;
  let loaded = false;
  let isViewed = false;
  let lines = [];
  let selectStart = false;
  let markerLocation;

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
    // markerLocation = convertInputToLatLng($data.start);
  };
  const onMapMouseMove = (event) => {
    if (selectStart) {
      // $initialValues.start = `${event.detail.latlng.lat}, ${event.detail.latlng.lng}`;
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
        // start: convertInputToLatLng($data.start),
        // width: parseInt($data.width),
        // length: parseInt($data.length),
        // angle: parseInt($data.angle),
        // strength: parseInt($data.strength),
      }),
    });
    const resp = await result.json();
    if (result.ok) {
      // notifier.success(
      //   $t('pages.commander-create.notification', { values: { name: resp.name, id: resp.id } }),
      // );
      // showDialog = false;
      await sleep(20);
      goto('/commander');
    } else {
      if (result.status === 400) {
        saving = false;
        nameError = $t('pages.commander-create.errors.name-exists');
        // notifier.alert(
        //   $t('pages.commander-create.notification-exists', { values: { name: nameValue } }),
        // );
      } else {
        // notifier.error($t(resp.msg));
        showDialog = false;
      }
    }
  };

  const { form, errors, enhance } = superForm(data.form);
  $: console.log('err', $errors);

  const handelError = (errors: string[] | undefined): string | undefined => {
    if (errors && errors.length > 0) {
      return $t(`pages.commander-create.${errors[0]}`);
    }
    return undefined;
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

<SuperDebug data={$form} />
<ContentGrid>
  <PageTitle>{$t('pages.commander-create.title')}</PageTitle>
  <div class="col-span-6">
    <!-- MAP -->
  </div>
  <form class="col-span-6 grid grid-cols-1 gap-2" method="POST" action="?/view" use:enhance>
    <!-- controles -->
    <div class="flex gap-2 flex-col">
      <TextField
        label={$t('pages.commander-create.labels.start')}
        bind:value={$form.start}
        name="start"
        error={handelError($errors.start)} />
      <Switch name="select-point">{$t('pages.commander-create.labels.select-start')}</Switch>
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
    <Button type="submit">{$t('common.view')}</Button>
  </form>
  <h3 class="col-span-12 mt-4">{$t('pages.commander-create.labels.winddirections')}</h3>
  <div class="hidden col-span-12 grid cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4) gap-y-4 gap-x-2 mt-4">
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
