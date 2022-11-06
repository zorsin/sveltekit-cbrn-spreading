import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { connect, close } from '$lib/logic/mongo';
import { Spread } from '$lib/model';
import * as turf from '@turf/turf';
import { v4 as uuidv4 } from 'uuid';
import * as logger from '$lib/util/logger';
const TAG = 'api/mission/measure.ts';

// get all messures as commander
export const GET: RequestHandler = async ({ url }) => {
  const missionUuid = url.searchParams.get('mission');
  const filter = url.searchParams.getAll('filter');
  logger.info(TAG, `get(${missionUuid},${JSON.stringify(filter)})`);
  logger.time(TAG, `get(${missionUuid},${JSON.stringify(filter)})`);
  try {
    const orFilter = filter?.map((value) => ({ unitUuid: value }));

    // add a none filter to recieve nothing if no unit is selected
    orFilter.push({ unitUuid: 'none' });

    const collection = await connect('measure');
    // check if exists
    const findResult = await collection
      .find({
        $and: [{ missionUuid }, { $or: orFilter }],
      })
      .toArray();
    close();
    logger.timeEnd(TAG, `get(${missionUuid},${JSON.stringify(filter)})`);
    logger.info(
      TAG,
      `get(${missionUuid},${JSON.stringify(filter)})::successful::${JSON.stringify(findResult)}`,
    );
    return new Response(JSON.stringify({ measures: findResult }));
    // return {
    //   status: 200,
    //   body: {
    //     measures: findResult,
    //   },
    // };
  } catch (e) {
    logger.error(
      TAG,
      `get(${missionUuid},${JSON.stringify(filter)})::find-mission-measurement::${e}`,
    );
  }
  close();
  logger.timeEnd(TAG, `get(${missionUuid},${JSON.stringify(filter)})`);
  throw error(500);
  // return {
  //   status: 500,
  // };
};

// creates measure to store point per unit
export const POST: RequestHandler = async ({ request }) => {
  const { missionUuid, unitUuid } = await request.json();
  logger.info(TAG, `post(${missionUuid},${unitUuid})`);
  logger.time(TAG, `post(${missionUuid},${unitUuid})`);
  try {
    const collection = await connect('measure');
    // check if exists
    const findResult = await collection.findOne(
      {
        missionUuid,
        unitUuid,
      },
      { projection: { missionUuid: 1, unitUuid: 1, uuid: 1, lines: 1 } },
    );
    let uuid = findResult?.uuid;
    let lines = findResult?.lines;
    // if no uuid exists
    if (!uuid) {
      uuid = uuidv4();
      lines = [];
      const result = await collection.insertOne({
        uuid,
        missionUuid,
        unitUuid,
        lines: [],
      });

      if (!result.acknowledged || !result.insertedId) {
        logger.timeEnd(TAG, `post(${missionUuid},${unitUuid})`);
        logger.warn(
          TAG,
          `post(${missionUuid},${unitUuid})::insert-failed::${JSON.stringify(result)}`,
        );
        close();
        throw error(503, JSON.stringify({ msg: 'errors.save-not-successful' }));
        // return {
        //   status: 503,
        //   body: { msg: 'errors.save-not-successful' },
        // };
      }
    }

    close();
    logger.timeEnd(TAG, `post(${missionUuid},${unitUuid})`);
    logger.info(
      TAG,
      `post(${missionUuid},${unitUuid})::successful::${uuid},length:${lines.length}`,
    );
    return new Response(JSON.stringify({ uuid, lines }));
    // return {
    //   status: 200,
    //   body: { uuid, lines },
    // };
  } catch (e) {
    logger.error(TAG, `post(${missionUuid},${unitUuid})::find-or-create-measure::${e}`);
    console.error('while insert or finde measure', e);
  }
  close();
  logger.timeEnd(TAG, `post(${missionUuid},${unitUuid})`);
  throw error(404);
  // return {
  //   status: 404,
  // };
};

export const PATCH: RequestHandler = async ({ request }) => {
  const { missionUuid, unitUuid, latLng, lastLatLng, id } = await request.json();
  logger.info(TAG, `patch(${missionUuid},${unitUuid},${latLng},${lastLatLng},${id})`);
  logger.time(TAG, `patch(${missionUuid},${unitUuid},${latLng},${lastLatLng},${id})`);
  try {
    const collection = await connect('mission');
    const { spread: dbSpread } = await collection.findOne(
      {
        uuid: missionUuid,
      },
      {
        projection: {
          spread: 1,
          uuid: 1,
        },
      },
    );
    close();

    const spread = new Spread(
      dbSpread.start,
      dbSpread.width,
      dbSpread.length,
      dbSpread.angle,
      dbSpread.strength,
    );

    spread.toCoordnates();
    const curerntPosition = turf.points([latLng]);
    const spreadData = spread.getSpreadStrength();
    const dataLength = spreadData.length;
    let resValue = 0;
    let resColor = '#fff';
    for (let i = 0; i < dataLength; i++) {
      const value = spreadData[i]?.value;
      if (!value) continue;
      const spreadPoints = spreadData[i].latLngs;
      if (spreadPoints.length < 4) continue;
      const searchWithin = turf.polygon([spreadPoints]);
      const ptsWithin = turf.pointsWithinPolygon(curerntPosition, searchWithin);
      if (ptsWithin?.features?.length > 0) {
        // point is inside spread
        resValue = value;
        resColor = spreadData[i].color;
        break;
      }
    }

    const collectionMeasure = await connect('measure');
    const result = await collectionMeasure.updateOne(
      {
        missionUuid: missionUuid,
        unitUuid,
      },
      {
        $push: { lines: { id, color: resColor, value: resValue, latLngs: [lastLatLng, latLng] } },
      },
    );
    close();
    if (!result?.acknowledged || result.modifiedCount === 0) {
      logger.timeEnd(TAG, `patch(${missionUuid},${unitUuid},${latLng},${lastLatLng},${id})`);
      logger.warn(
        TAG,
        `patch(${missionUuid},${unitUuid},${latLng},${lastLatLng},${id})::update-measure::${JSON.stringify(
          result,
        )}`,
      );
      throw error(503, JSON.stringify({ msg: 'errors.update-not-successful' }));
      // return {
      //   status: 503,
      //   body: { msg: 'errors.update-not-successful' },
      // };
    }

    logger.timeEnd(TAG, `patch(${missionUuid},${unitUuid},${latLng},${lastLatLng},${id})`);
    logger.info(
      TAG,
      `patch(${missionUuid},${unitUuid},${latLng},${lastLatLng},${id})::successful::${resColor},${resValue}`,
    );
    return new Response(
      JSON.stringify({
        color: resColor,
        value: resValue,
      }),
    );
    // return {
    //   status: 200,
    //   body: {
    //     color: resColor,
    //     value: resValue,
    //   },
    // };
  } catch (e) {
    logger.error(
      TAG,
      `patch(${missionUuid},${unitUuid},${latLng},${lastLatLng},${id})::update-measure::${e}`,
    );
    console.error('while updating measure', e);
  }
  logger.timeEnd(TAG, `patch(${missionUuid},${unitUuid},${latLng},${lastLatLng},${id})`);
  throw error(404);
  // return {
  //   status: 404,
  // };
};
