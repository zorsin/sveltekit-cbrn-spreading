import { connect, close } from '$lib/logic/mongo';
import { v4 as uuidv4 } from 'uuid';

export const post = async ({ request }) => {
  const body = await request.json();
  const uuid = uuidv4();
  try {
    const collection = await connect('spread');
    // TODO: check what happens if db not available
    const insertResult = await collection.insertOne({
      uuid,
      name: body.name,
      start: body.start,
      width: body.width,
      length: body.length,
      angle: body.angle,
      strength: body.strength,
    });

    if (!insertResult?.acknowledged) {
      return {
        status: 503,
        body: { msg: 'errors.save-not-successful' },
      };
    }
  } catch (e) {
    console.error('Error while saveing', e);
    return {
      status: 503,
      body: { msg: 'errors.save-not-successful' },
    };
  }

  close();
  return {
    status: 201,
    body: {
      name: body.name,
      id: uuid,
    },
  };
};
