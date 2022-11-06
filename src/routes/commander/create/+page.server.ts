import type { Actions, PageServerLoad } from './$types';

import { convertInputToLatLng } from '$lib/util/converter';

export const ssr = false;

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  show: async ({ fetch, request }) => {
    const requestBody = await request.formData();
    const start = requestBody.get('start') as string;
    const width = requestBody.get('width') as string;
    const length = requestBody.get('length') as string;
    const angle = requestBody.get('angle') as string;
    const strength = requestBody.get('strength') as string;
    const showStrength = requestBody.get('showStrength') as string;
    let lines = [];
    const markerLocation = convertInputToLatLng(start);

    const body = {
      start: markerLocation,
      width: parseInt(width),
      length: parseInt(length),
      angle: parseInt(angle),
      strength: parseInt(strength),
      showStrength: !!showStrength,
    };

    const result = await fetch('/api/spread/calc', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const data = await result.json();
    lines = data.lines;

    return { success: true, markerLocation, lines, isViewed: true, ...body };
  },
};
