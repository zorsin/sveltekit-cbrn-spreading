<script lang="ts">
  import { PageTitle, Button, Dialog, TextField, notifier } from '$lib/smelte';
  import { navigating, session } from '$app/stores';
  import { goto, prefetch } from '$app/navigation';
  import { t } from 'svelte-intl-precompile';
  import { createForm } from 'felte';

  const { form, errors } = createForm({
    onSubmit: async ({ radio, vehicle, crew }) => {
      if (!$session.missionUuid) {
        notifier.error($t('pages.unit-register.errors.uuid'));
        goto('/unit');
      }
      const res = await fetch('/api/mission/units', {
        method: 'POST',
        body: JSON.stringify({ missionUuid: $session.missionUuid, radio, vehicle, crew }),
      });
      if (res.ok) {
        const data = await res.json();
        notifier.success($t('pages.unit-register.register-success'));
        goto(`/unit/${data.missionUuid}/${data.uuid}`);
      }
    },
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
<form class="w-1/2 mt-16" use:form>
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
  <Button type="submit">{$t('common.register')}</Button>
</form>
