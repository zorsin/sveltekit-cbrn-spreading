import type { RequestHandler } from './__types/[uuid]';
import { connect, close } from '$lib/logic/mongo';
import * as logger from '$lib/util/logger';
const TAG = 'mission/uuid.ts';
// units checks if the token for the mission is correct
export const get: RequestHandler = async ({ params }) => {
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
    return {
      status: 200,
      body: {
        mission: findResult,
      },
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
