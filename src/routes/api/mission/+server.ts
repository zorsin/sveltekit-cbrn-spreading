import { v4 as uuidv4 } from 'uuid';
import { error } from '@sveltejs/kit';

import { connect, close } from '$lib/logic/mongo';
import { Spread } from '$lib/model';
import * as logger from '$lib/util/logger';

import type { RequestHandler } from './$types';
const TAG = 'api/mission/index.ts';

// units checks if the token for the mission is correct
export const GET: RequestHandler = async ({ url }) => {
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
    throw error(503, JSON.stringify({ msg: 'errors.find-not-successful' }));
  }
  logger.timeEnd(TAG, `get(${code})`);
  return new Response(JSON.stringify({ mission: result?.[0] }));
};

// commander creates new mission
export const POST: RequestHandler = async ({ locals, request }) => {
  const reqBody = await request.json();
  logger.info(TAG, `post(${JSON.stringify(reqBody)})`);
  logger.time(TAG, `post(${JSON.stringify(reqBody)})`);
  const spread = new Spread({
    startCoordinate: reqBody.start,
    width: reqBody.width,
    length: reqBody.length,
    angle: reqBody.angle,
    strength: reqBody.strength,
    mode: reqBody.mode,
    openingAngle: reqBody.openingAngle,
  });
  spread.toCoordnates();
  const dataLight = spread.getSpreadStrengthLight();
  const uuid = <string>uuidv4();
  try {
    const collection = await connect('mission');

    // check if code already exists
    const findResult = await collection.findOne({ code: reqBody.code });
    if (findResult) {
      close();
      logger.timeEnd(TAG, `post(${JSON.stringify(reqBody)})`);
      logger.warn(TAG, `post(${JSON.stringify(reqBody)})::code-already-exists::${findResult.uuid}`);
      throw error(400, JSON.stringify({ msg: 'errors.already-exists' }));
    }
    const insertResult = await collection.insertOne({
      uuid,
      code: reqBody.code,
      spread: {
        start: reqBody.start,
        width: reqBody.width,
        length: reqBody.length,
        angle: reqBody.angle,
        strength: reqBody.strength,
        mode: reqBody.mode,
        openingAngle: reqBody.openingAngle,
      },
      spreadLight: dataLight,
      units: [],
    });
    close();
    if (!insertResult?.acknowledged) {
      logger.warn(TAG, `post(${JSON.stringify(reqBody)})::insert-not-successful::${JSON.stringify(insertResult)}`);
      logger.timeEnd(TAG, `post(${JSON.stringify(reqBody)})`);
      throw error(503, JSON.stringify({ msg: 'errors.save-not-successful' }));
    }
  } catch (e) {
    logger.timeEnd(TAG, `post(${JSON.stringify(reqBody)})`);
    logger.error(TAG, `post(${JSON.stringify(reqBody)})::save-mission::${e}`);

    throw error(503, JSON.stringify({ msg: 'errors.save-not-successful' }));
  }
  await locals.session.update(() => ({ mission: { uuid, code: reqBody.code } }));
  logger.timeEnd(TAG, `post(${JSON.stringify(reqBody)})`);
  return new Response(JSON.stringify({ uuid, code: reqBody.code }));
};

// commander can delete the mission
export const DELETE: RequestHandler = async ({ request }) => {
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

    throw error(503, JSON.stringify({ msg: 'errors.delete-not-successful' }));
  }
  logger.timeEnd(TAG, `del(${uuid})`);
  return new Response('', { status: 200 });
};
