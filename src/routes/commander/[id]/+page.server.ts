import * as logger from '$lib/util/logger';

import { close, connect } from '$lib/logic/mongo';

import type { PageServerLoad } from './$types';
import { Spread } from '$lib/model';

const TAG = 'commander/id/index.ts';
export const ssr = false;

export const load: PageServerLoad = async ({ params }) => {
  logger.info(TAG, `get(${params.id})`);
  logger.time(TAG, `get(${params.id})`);
  try {
    const collection = await connect('spread');
    const dbSpread = await collection.findOne({
      $or: [{ name: params.id }, { uuid: params.id }],
    });
    close();

    const spread = new Spread(
      dbSpread.start,
      dbSpread.width,
      dbSpread.length,
      dbSpread.angle,
      dbSpread.strength,
    );
    // NOTE: a colored spread can be > 70MB, this is to much to transmit
    // const lines = spread.getSpreadStrength();
    const lines = spread.getSpreadStrengthLight();
    logger.timeEnd(TAG, `get(${params.id})`);
    logger.info(TAG, `get(${params.id})::successful::${JSON.stringify(dbSpread)}`);

    delete dbSpread._id;
    return {
      spreadId: params.id,
      spread: dbSpread,
      lines,
    };
  } catch (e) {
    logger.timeEnd(TAG, `get(${params.id})`);
    logger.error(TAG, `while saving. ${e}`);
    console.error('while getting a spread', e);
    return {
      status: 503,
      body: { msg: 'errors.no-query' },
    };
  }
};
