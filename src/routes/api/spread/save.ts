import { connect, close } from '$lib/logic/mongo';
import { v4 as uuidv4 } from 'uuid';
import type { RequestHandler } from './__types/save';

import * as logger from '$lib/util/logger';
const TAG = 'api/spread/save.ts';

export const post: RequestHandler = async ({ request, locals }) => {
  const body = await request.json();
  const uuid = uuidv4();
  logger.info(TAG, `post(${JSON.stringify(body)})`);
  logger.time(TAG, `post(${JSON.stringify(body)})`);
  try {
    const collection = await connect('spread');
    // check if name already exists
    const findResult = await collection.findOne({ name: body.name });
    if (findResult) {
      close();
      logger.timeEnd(TAG, `post(${JSON.stringify(body)})`);
      logger.warn(
        TAG,
        `post(${JSON.stringify(body)})::name-already-exists::${JSON.stringify(findResult)}`,
      );

      return {
        status: 400,
        body: { msg: 'errors.already-exists' },
      };
    }

    const insertResult = await collection.insertOne({
      uuid,
      name: body.name,
      start: body.start,
      width: body.width,
      length: body.length,
      angle: body.angle,
      strength: body.strength,
    });
    close();
    if (!insertResult?.acknowledged) {
      logger.timeEnd(TAG, `post(${JSON.stringify(body)})`);
      return {
        status: 503,
        body: { msg: 'errors.save-not-successful' },
      };
    }
  } catch (e) {
    logger.timeEnd(TAG, `post(${JSON.stringify(body)})`);
    logger.error(TAG, `while saving. ${e}`);
    console.error('while saving', e);
    return {
      status: 503,
      body: { msg: 'errors.save-not-successful' },
    };
  }
  await locals.session.update(({ recentSpreads }) => {
    const currentSpread = recentSpreads;
    // keep max
    if (currentSpread.length > 9) {
      currentSpread.shift();
    }
    return {
      recentSpreads: [
        ...currentSpread,
        {
          name: body.name,
          id: uuid,
        },
      ],
    };
  });
  logger.timeEnd(TAG, `post(${JSON.stringify(body)})`);
  return {
    status: 201,
    body: {
      name: body.name,
      id: uuid,
    },
  };
};
