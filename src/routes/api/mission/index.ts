import type { RequestHandler } from './__types/index';
import { connect, close } from '$lib/logic/mongo';
import { Spread } from '$lib/model';
import { v4 as uuidv4 } from 'uuid';

// units checks if the token for the mission is correct
export const get: RequestHandler = async ({ url }) => {
  const code = url.searchParams.get('code');
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
    console.error('Error while find mission', e);
    return {
      status: 503,
      body: { msg: 'errors.find-not-successful' },
    };
  }

  return {
    status: 200,
    body: { mission: result?.[0] },
  };
};

// commander creates new mission
export const post: RequestHandler = async ({ locals, request }) => {
  const reqBody = await request.json();
  const spread = new Spread(
    reqBody.start,
    reqBody.width,
    reqBody.length,
    reqBody.angle,
    reqBody.strength,
  );
  spread.toCoordnates();
  const dataLight = spread.getColoredSpreadLight();
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
      return {
        status: 503,
        body: { msg: 'errors.save-not-successful' },
      };
    }
  } catch (e) {
    console.error('Error while saveing mission', e);
    return {
      status: 503,
      body: { msg: 'errors.save-not-successful' },
    };
  }
  close();
  await locals.session.update(() => ({ mission: { uuid, code: reqBody.code } }));
  return {
    status: 201,
    body: { uuid, code: reqBody.code },
  };
};
