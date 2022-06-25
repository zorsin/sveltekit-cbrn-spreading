import type { RequestHandler } from './__types/index';
import { connect, close } from '$lib/logic/mongo';
import * as logger from '$lib/util/logger';
const TAG = 'api/spread/index.ts';

export const del: RequestHandler = async ({ locals, url }) => {
  const uuid = url.searchParams.get('id');
  logger.info(TAG, `del(${uuid})`);
  logger.time(TAG, `del(${uuid})`);
  try {
    const collection = await connect('spread');
    const deleteResult = await collection.deleteOne({
      uuid,
    });
    if (!deleteResult?.acknowledged) {
      logger.timeEnd(TAG, `del(${uuid})`);
      logger.warn(TAG, `del(${uuid})::dbresult::${JSON.stringify(deleteResult)}`);
      return {
        status: 503,
        body: { msg: 'errors.delete-not-successful' },
      };
    }
  } catch (e) {
    logger.timeEnd(TAG, `del(${uuid})`);
    logger.error(TAG, `while deleting::${e}`);
    console.error('while deleting::', e);
    return {
      status: 503,
      body: { msg: 'errors.delete-not-successful' },
    };
  }
  close();

  // delete also from cookie
  await locals.session.update(({ recentSpreads }) => {
    let currentSpread = recentSpreads;
    // keep max

    currentSpread = currentSpread.filter((value) => value.id !== uuid);

    return {
      recentSpreads: [...currentSpread],
    };
  });
  logger.info(TAG, `del(${uuid})::successful`);
  logger.timeEnd(TAG, `del(${uuid})`);
  return {
    status: 202,
  };
};
