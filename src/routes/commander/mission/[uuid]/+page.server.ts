import * as logger from '$lib/util/logger';
import { close, connect } from '$lib/logic/mongo';

import type { PageServerLoad } from './$types';

const TAG = 'mission/uuid.ts';
export const ssr = false;
// units checks if the token for the mission is correct
export const load: PageServerLoad = async ({ params, depends }) => {
  depends('commander:mission');
  const uuid = params.uuid;
  logger.info(TAG, `get(${uuid})`);
  logger.time(TAG, `get(${uuid})`);
  try {
    const collection = await connect('mission');
    const findResult = await collection.findOne({
      uuid,
    });
    close();

    if (!findResult?._id) {
      logger.timeEnd(TAG, `get(${uuid})`);
      return {
        status: 503,
        body: { msg: 'errors.save-not-successful' },
      };
    }
    logger.timeEnd(TAG, `get(${uuid})`);

    delete findResult._id;
    return {
      mission: findResult,
    };
  } catch (e) {
    logger.timeEnd(TAG, `get(${uuid})`);
    logger.error(TAG, `While finding mission ${uuid}. ${e.msg}`);
    return {
      status: 503,
      body: { msg: 'errors.save-not-successful' },
    };
  }
};
