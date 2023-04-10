import { superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';

import { convertInputToLatLng } from '$lib/util/converter';

import type { Actions, PageServerLoad } from './$types';
import { spreadSchema, saveSpreadSchema } from './spread-schema';

export const ssr = false;

export const load: PageServerLoad = async (event) => {
  const form = await superValidate(event, spreadSchema, { id: 'spread-form' });
  const saveForm = await superValidate(event, saveSpreadSchema, { id: 'save-spread-form' });
  return { form, saveForm };
};

export const actions: Actions = {
  view: async (event) => {
    const form = await superValidate(event, spreadSchema, { id: 'spread-form' });

    if (!form.valid) {
      return fail(400, { form, view: null });
    }

    // TODO: Do something with the validated data
    let lines = [];
    const markerLocation = convertInputToLatLng(form.data.start);

    const body = {
      start: markerLocation,
      width: form.data.width,
      length: form.data.length,
      angle: form.data.angle,
      strength: form.data.strength,
      showStrength: form.data.showStrength,
      mode: form.data.mode,
      openingAngle: form.data.openingAngle,
    };

    const result = await event.fetch('/api/spread/calc', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const data = await result.json();
    lines = data.lines;
    return { form, view: { success: true, markerLocation, lines, isViewed: true } };
  },
  save: async (event) => {
    const saveForm = await superValidate(event, saveSpreadSchema, { id: 'save-spread-form' });

    if (!saveForm.valid) {
      return fail(401, { saveForm });
    }
    const result = await event.fetch('/api/spread/save', {
      method: 'POST',
      body: JSON.stringify({
        name: saveForm.data.name,
        start: convertInputToLatLng(saveForm.data.start),
        width: saveForm.data.width,
        length: saveForm.data.length,
        angle: saveForm.data.angle,
        strength: saveForm.data.strength,
        mode: saveForm.data.mode,
        openingAngle: saveForm.data.openingAngle,
      }),
    });
    const resp = await result.json();
    if (result.ok) {
      return { saveForm, save: { success: true, id: resp.id, name: resp.name } };
    } else {
      if (result.status === 400) {
        saveForm.errors = { ...saveForm.errors, name: ['errors.nameExists'] };
        return fail(400, { saveForm, save: { success: false, error: 'errors.nameExists' } });
      } else {
        return fail(500, { saveForm, save: { success: false, error: 'errors.saveNotSuccessful' } });
      }
    }

    return { saveForm };
  },
};
