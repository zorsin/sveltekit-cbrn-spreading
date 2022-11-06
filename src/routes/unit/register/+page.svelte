<script lang="ts">
  import { PageTitle, Button, Dialog, TextField, notifier } from '$lib/smelte';
  import { navigating, page } from '$app/stores';
  import { goto, prefetch } from '$app/navigation';
  import { t } from 'svelte-intl-precompile';
  import { createForm } from 'felte';
  import type { PageData } from './$types';
  import { enhance } from '$app/forms';

  export let data: PageData;

  const { form, errors } = createForm({
    onSubmit: () => {},
    validate: ({ radio, vehicle, crew }) => {
      const errors: Record<string, string[] | boolean> = {
        radio: false,
        vehicle: false,
        crew: false,
      };
      if (!radio) {
        errors.radio = [$t('pages.unit-register.errors.radio')];
      }
      if (!vehicle) {
        errors.vehicle = [$t('pages.unit-register.errors.vehicle')];
      }
      if (!crew) {
        errors.crew = [$t('pages.unit-register.errors.crew')];
      }

      return errors;
    },
  });
</script>

<PageTitle>{$t('pages.unit-register.title')}</PageTitle>
<span>{$t('pages.unit-register.descr')}</span>
<form class="w-full md:w-1/2 mt-16" use:form use:enhance method="POST" action="?/register">
  <input class="hidden" value={data.missionUuid} name="id" />
  <TextField
    name="radio"
    label={$t('pages.unit-register.labels.radio')}
    error={!!$errors.radio}
    hint={$errors.radio}
  />
  <TextField
    name="vehicle"
    label={$t('pages.unit-register.labels.vehicle')}
    error={!!$errors.vehicle}
    hint={$errors.vehicle}
  />
  <TextField
    name="crew"
    label={$t('pages.unit-register.labels.crew')}
    error={!!$errors.crew}
    hint={$errors.crew}
  />
  <Button type="submit" replace={{ 'w-max': 'w-full md:w-max' }} add="mt-8"
    >{$t('common.register')}</Button
  >
</form>
