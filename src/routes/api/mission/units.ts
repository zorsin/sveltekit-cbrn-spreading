import type { RequestHandler } from './__types/units';
import { connect, close } from '$lib/logic/mongo';
import { v4 as uuidv4 } from 'uuid';
import * as logger from '$lib/util/logger';
const TAG = 'api/mission/units.ts';

// units register them to missions
export const post: RequestHandler = async ({ request }) => {
  const { missionUuid, radio, vehicle, crew } = await request.json();
  logger.info(TAG, `post(${missionUuid},${radio},${vehicle},${crew})`);
  logger.time(TAG, `post(${missionUuid},${radio},${vehicle},${crew})`);
  const uuid = <string>uuidv4();
  try {
    const collection = await connect('mission');
    const result = await collection.updateOne(
      {
        uuid: missionUuid,
      },
      {
        $push: { units: { radio, vehicle, crew, unitUuid: uuid } },
      },
    );
    close();
    if (!result?.acknowledged) {
      logger.timeEnd(TAG, `post(${missionUuid},${radio},${vehicle},${crew})`);
      logger.warn(
        TAG,
        `post(${missionUuid},${radio},${vehicle},${crew})::register-unit::${JSON.stringify(
          result,
        )}`,
      );
      return {
        status: 503,
        body: { msg: 'errors.register-not-successful' },
      };
    }
  } catch (e) {
    logger.timeEnd(TAG, `post(${missionUuid},${radio},${vehicle},${crew})`);
    logger.error(TAG, `post(${missionUuid},${radio},${vehicle},${crew})::register-unit::${e}`);
    console.error('Error while register an unit to a mission', e);
    return {
      status: 503,
      body: { msg: 'errors.register-not-successful' },
    };
  }
  close();
  logger.timeEnd(TAG, `post(${missionUuid},${radio},${vehicle},${crew})`);
  logger.info(TAG, `post(${missionUuid},${radio},${vehicle},${crew})::successful::${uuid}`);
  return {
    status: 201,
    body: { uuid, missionUuid },
  };
};

// unregister a unit from a mission
export const del: RequestHandler = async ({ request }) => {
  const { missionUuid, unitUuid } = await request.json();
  logger.info(TAG, `del(${missionUuid},${unitUuid})`);
  logger.time(TAG, `del(${missionUuid},${unitUuid})`);
  try {
    const collection = await connect('mission');
    const result = await collection.updateOne(
      {
        uuid: missionUuid,
      },
      {
        $pull: { units: { unitUuid } },
      },
    );
    close();
    const collectionMeasure = await connect('measure');
    await collectionMeasure.deleteMany({
      missionUuid,
      unitUuid,
    });
    close();
    if (!result?.acknowledged) {
      logger.timeEnd(TAG, `del(${missionUuid},${unitUuid})`);
      logger.warn(
        TAG,
        `del(${missionUuid},${unitUuid})::deleting-unit-from-mission::${JSON.stringify(result)}`,
      );
      return {
        status: 503,
        body: { msg: 'errors.delete-not-successful' },
      };
    }
  } catch (e) {
    logger.timeEnd(TAG, `del(${missionUuid},${unitUuid})`);
    logger.error(TAG, `del(${missionUuid},${unitUuid})::deleting-unit-from-mission::${e}`);
    console.error('while deleting an unit from a mission', e);
    return {
      status: 503,
      body: { msg: 'errors.delete-not-successful' },
    };
  }
  logger.timeEnd(TAG, `del(${missionUuid},${unitUuid})`);
  logger.info(TAG, `del(${missionUuid},${unitUuid})::successful`);
  return {
    status: 201,
  };
};
