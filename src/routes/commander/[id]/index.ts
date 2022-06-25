import { connect, close } from '$lib/logic/mongo';
import { Spread } from '$lib/model';
import type { RequestHandler } from './__types/index';
import * as logger from '$lib/util/logger';
const TAG = 'commander/id/index.ts';

export const get: RequestHandler = async ({ params }) => {
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
    const lines = spread.getSpreadStrengthLight();
    logger.timeEnd(TAG, `get(${params.id})`);
    logger.info(TAG, `get(${params.id})::successful::${JSON.stringify(dbSpread)}`);
    return {
      status: 200,
      body: {
        spreadId: params.id,
        spread: dbSpread,
        lines,
      },
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
