import { fail, redirect } from '@sveltejs/kit';
import { noErrors, superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';
import { registerUnitSchema } from './register-unit-schema';

export const load: PageServerLoad = async (event) => {
  const { locals, url } = event;
  const missionUuid = locals.session.data.missionUuid || url.searchParams.get('id');

  const form = await superValidate(
    {
      missionUuid,
    },
    registerUnitSchema,
  );

  // TODO: validate ID
  return { form: noErrors(form) };
};

export const actions: Actions = {
  register: async (event) => {
    const { fetch } = event;
    const form = await superValidate(event, registerUnitSchema);

    if (!form.valid) {
      return fail(400, { form });
    }
    const res = await fetch('/api/mission/units', {
      method: 'POST',
      body: JSON.stringify({
        missionUuid: form.data.missionUuid,
        radio: form.data.radio,
        vehicle: form.data.vehicle,
        crew: form.data.crew,
      }),
    });
    if (res.ok) {
      const dataRes = await res.json();
      throw redirect(301, `/unit/${dataRes.missionUuid}/${dataRes.uuid}`);
    }
    return { form };
  },
};
