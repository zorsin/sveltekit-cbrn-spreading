import type { Actions, PageServerLoad } from './$types';
import { invalid, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
  // TODO: validate ID
  return { missionUuid: locals.session.data.missionUuid, id: url.searchParams.get('id') };
};

export const actions: Actions = {
  register: async ({ request, fetch }) => {
    const data = await request.formData();
    const radio = data.get('radio');
    const vehicle = data.get('vehicle');
    const crew = data.get('crew');
    const missionUuid = data.get('id');

    if (!missionUuid) {
      throw redirect(301, `/unit?notify=pages.unit-register.errors.uuid`);
    }
    const res = await fetch('/api/mission/units', {
      method: 'POST',
      body: JSON.stringify({ missionUuid, radio, vehicle, crew }),
    });
    if (res.ok) {
      const dataRes = await res.json();
      throw redirect(
        301,
        `/unit/${dataRes.missionUuid}/${dataRes.uuid}?notify=pages.unit-register.register-success`,
      );
    }

    return invalid(400, { radio, incorrect: true });
  },
};
