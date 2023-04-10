import { noErrors, superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';

import * as logger from '$lib/util/logger';
import { close, connect } from '$lib/logic/mongo';
import { Spread } from '$lib/model';

import type { Actions, PageServerLoad } from './$types';
import { startSchema } from './start-schema';

const TAG = 'commander/id/index.ts';
export const ssr = false;

export const load: PageServerLoad = async (event) => {
  const { params } = event;
  logger.info(TAG, `get(${params.id})`);
  logger.time(TAG, `get(${params.id})`);
  try {
    const collection = await connect('spread');
    const dbSpread = await collection.findOne({
      $or: [{ name: params.id }, { uuid: params.id }],
    });
    close();

    const spread = new Spread({
      startCoordinate: dbSpread.start,
      width: dbSpread.width,
      length: dbSpread.length,
      angle: dbSpread.angle,
      strength: dbSpread.strength,
      mode: dbSpread.mode,
      openingAngle: dbSpread.openingAngle,
    });
    // NOTE: a colored spread can be > 70MB, this is to much to transmit
    // const lines = spread.getSpreadStrength();
    const lines = spread.getSpreadStrengthLight();
    logger.timeEnd(TAG, `get(${params.id})`);
    logger.info(TAG, `get(${params.id})::successful::${JSON.stringify(dbSpread)}`);
    const form = await superValidate(
      {
        uuid: dbSpread.uuid,
        name: dbSpread.name,
        code: dbSpread.code,
        start: dbSpread.start,
        width: dbSpread.width,
        length: dbSpread.length,
        angle: dbSpread.angle,
        strength: dbSpread.strength,
        mode: dbSpread.mode,
        openingAngle: dbSpread.openingAngle,
      },
      startSchema,
    );
    delete dbSpread._id;

    return {
      spreadId: params.id,
      spread: dbSpread,
      lines,
      form: noErrors(form),
    };
  } catch (e) {
    logger.timeEnd(TAG, `get(${params.id})`);
    logger.error(TAG, `while querying. ${e}`);

    return {
      status: 503,
      body: { msg: 'errors.no-query' },
    };
  }
};

export const actions: Actions = {
  start: async (event) => {
    const form = await superValidate(event, startSchema);

    if (!form.valid) {
      return fail(400, { form, start: { success: false, error: 'errors.invalidForm' } });
    }

    const resp = await event.fetch(`/api/mission`, {
      method: 'post',
      body: JSON.stringify({
        code: form.data.code,
        angle: form.data.angle,
        length: form.data.length,
        name: form.data.name,
        start: form.data.start,
        strength: form.data.strength,
        uuid: form.data.uuid,
        width: form.data.width,
        mode: form.data.mode,
        openingAngle: form.data.openingAngle,
      }),
    });

    if (resp.ok) {
      return { form, start: { success: true } };
    } else {
      form.errors = { ...form.errors, code: ['errors.codeExists'] };
      return fail(400, { form, start: { success: false, error: 'errors.codeExists' } });
    }
    return { form };
  },
};
