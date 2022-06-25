import type { RequestHandler } from './__types/index';
import { connect, close } from '$lib/logic/mongo';
import { Spread } from '$lib/model';
import { v4 as uuidv4 } from 'uuid';
import * as logger from '$lib/util/logger';
const TAG = 'api/mission/index.ts';

// units checks if the token for the mission is correct
export const get: RequestHandler = async ({ url }) => {
  const code = url.searchParams.get('code');
  logger.info(TAG, `get(${code})`);
  logger.time(TAG, `get(${code})`);
  let result;
  try {
    const collection = await connect('mission');
    result = await collection
      .find({
        code,
      })
      .project({ uuid: 1, _id: 0 })
      .toArray();
    close();
  } catch (e) {
    logger.timeEnd(TAG, `get(${code})`);
    logger.error(TAG, `get(${code})::find-mission::${e}`);
    console.error('while find mission', e);
    return {
      status: 503,
      body: { msg: 'errors.find-not-successful' },
    };
  }
  logger.timeEnd(TAG, `get(${code})`);
  return {
    status: 200,
    body: { mission: result?.[0] },
  };
};

// commander creates new mission
export const post: RequestHandler = async ({ locals, request }) => {
  const reqBody = await request.json();
  logger.info(TAG, `post(${JSON.stringify(reqBody)})`);
  logger.time(TAG, `post(${JSON.stringify(reqBody)})`);
  const spread = new Spread(
    reqBody.start,
    reqBody.width,
    reqBody.length,
    reqBody.angle,
    reqBody.strength,
  );
  spread.toCoordnates();
  const dataLight = spread.getSpreadStrengthLight();
  const uuid = <string>uuidv4();
  try {
    const collection = await connect('mission');
    const insertResult = await collection.insertOne({
      uuid,
      code: reqBody.code,
      spread: {
        start: reqBody.start,
        width: reqBody.width,
        length: reqBody.length,
        angle: reqBody.angle,
        strength: reqBody.strength,
      },
      spreadLight: dataLight,
      units: [],
    });
    if (!insertResult?.acknowledged) {
      logger.warn(
        TAG,
        `post(${JSON.stringify(reqBody)})::insert-not-successful::${JSON.stringify(insertResult)}`,
      );
      logger.timeEnd(TAG, `post(${JSON.stringify(reqBody)})`);
      return {
        status: 503,
        body: { msg: 'errors.save-not-successful' },
      };
    }
  } catch (e) {
    logger.timeEnd(TAG, `post(${JSON.stringify(reqBody)})`);
    logger.error(TAG, `post(${JSON.stringify(reqBody)})::save-mission::${e}`);
    console.error('while saveing mission', e);
    return {
      status: 503,
      body: { msg: 'errors.save-not-successful' },
    };
  }
  close();
  await locals.session.update(() => ({ mission: { uuid, code: reqBody.code } }));
  logger.timeEnd(TAG, `post(${JSON.stringify(reqBody)})`);
  return {
    status: 201,
    body: { uuid, code: reqBody.code },
  };
};

// commander can delete the mission
export const del: RequestHandler = async ({ request }) => {
  const { uuid } = await request.json();
  logger.info(TAG, `del(${uuid})`);
  logger.time(TAG, `del(${uuid})`);
  try {
    const collection = await connect('mission');
    await collection.deleteOne({
      uuid,
    });
    close();
  } catch (e) {
    logger.timeEnd(TAG, `del(${uuid})`);
    logger.error(TAG, `del(${uuid})::delete-mission::${e}`);
    console.error('while delete mission', e);
    return {
      status: 503,
      body: { msg: 'errors.delete-not-successful' },
    };
  }
  logger.timeEnd(TAG, `del(${uuid})`);
  return {
    status: 200,
  };
};
