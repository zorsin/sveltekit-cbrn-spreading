import type { RequestHandler } from './__types/units';
import { connect, close } from '$lib/logic/mongo';

import { v4 as uuidv4 } from 'uuid';

// units register them to missions
export const post: RequestHandler = async ({ locals, request }) => {
  const { missionUuid, radio, vehicle, crew } = await request.json();
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
      return {
        status: 503,
        body: { msg: 'errors.register-not-successful' },
      };
    }
  } catch (e) {
    console.error('Error while register an unit to a mission', e);
    return {
      status: 503,
      body: { msg: 'errors.register-not-successful' },
    };
  }
  close();

  return {
    status: 201,
    body: { uuid },
  };
};

// unregister a unit from a mission
export const del: RequestHandler = async ({ locals, request }) => {
  const { missionUuid, unitUuid } = await request.json();
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
    if (!result?.acknowledged) {
      return {
        status: 503,
        body: { msg: 'errors.delete-not-successful' },
      };
    }
  } catch (e) {
    console.error('Error while deleting an unit from a mission', e);
    return {
      status: 503,
      body: { msg: 'errors.delete-not-successful' },
    };
  }
  return {
    status: 201,
  };
};
