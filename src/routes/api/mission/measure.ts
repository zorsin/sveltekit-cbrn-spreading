import type { RequestHandler } from './__types/measure';
import { connect, close } from '$lib/logic/mongo';
import { Spread } from '$lib/model';
import * as turf from '@turf/turf';
import { v4 as uuidv4 } from 'uuid';

// get all messures as commander
export const get: RequestHandler = async ({ url }) => {
  const missionUuid = url.searchParams.get('mission');
  const filter = url.searchParams.getAll('filter');
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
    return {
      status: 200,
      body: {
        measures: findResult,
      },
    };
  } catch (e) {
    //
  }
  return {
    status: 500,
  };
};

// creates measure to store point per unit
export const post: RequestHandler = async ({ request }) => {
  const { missionUuid, unitUuid } = await request.json();
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
        // TODO: do fallback
      }
    }

    close();

    return {
      status: 200,
      body: { uuid, lines },
    };
  } catch (e) {
    console.error(e);
  }
  return {
    status: 404,
  };
};

export const patch: RequestHandler = async ({ request }) => {
  const { missionUuid, unitUuid, latLng, lastLatLng, id } = await request.json();

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
    const result = await collectionMeasure.findOneAndUpdate(
      {
        missionUuid,
        unitUuid,
      },
      {
        $push: { lines: { id, color: resColor, value: resValue, latLngs: [lastLatLng, latLng] } },
      },
    );
    // TODO: handle invalid update

    close();

    return {
      status: 200,
      body: {
        color: resColor,
        value: resValue,
      },
    };
  } catch (e) {
    console.error(e);
  }
  return {
    status: 404,
  };
};
