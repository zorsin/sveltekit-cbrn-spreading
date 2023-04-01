import { superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';

import { convertInputToLatLng } from '$lib/util/converter';

import type { Actions, PageServerLoad } from './$types';
import { spreadSchema } from './spread-schema';

export const ssr = false;

export const load: PageServerLoad = async (event) => {
  const form = await superValidate(event, spreadSchema);
  return { form };
};

export const actions: Actions = {
  view: async (event) => {
    const form = await superValidate(event, spreadSchema);
    console.log('POST', form);

    if (!form.valid) {
      return fail(400, { form });
    }

    // TODO: Do something with the validated data

    return { form };
    // const requestBody = await request.formData();

    // const start = requestBody.get('start') as string;
    // const width = requestBody.get('width') as string;
    // const length = requestBody.get('length') as string;
    // const angle = requestBody.get('angle') as string;
    // const strength = requestBody.get('strength') as string;
    // const showStrength = requestBody.get('showStrength') as string;
    // const mode = requestBody.get('mode') as string;
    // const openingAngle = requestBody.get('openingAngle') as string;
    // let lines = [];
    // const markerLocation = convertInputToLatLng(start);

    // const body = {
    //   start: markerLocation,
    //   width: parseInt(width),
    //   length: parseInt(length),
    //   angle: parseInt(angle),
    //   strength: parseInt(strength),
    //   showStrength: !!showStrength,
    //   mode,
    //   openingAngle: parseInt(openingAngle),
    // };

    // const result = await fetch('/api/spread/calc', {
    //   method: 'POST',
    //   body: JSON.stringify(body),
    // });
    // const data = await result.json();
    // lines = data.lines;

    // return { success: true, markerLocation, lines, isViewed: true, ...body };
  },
};
