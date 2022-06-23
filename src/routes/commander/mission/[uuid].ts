import type { RequestHandler } from './__types/[uuid]';
import { connect, close } from '$lib/logic/mongo';

// units checks if the token for the mission is correct
export const get: RequestHandler = async ({ locals, params }) => {
  const uuid = params.uuid;
  try {
    const collection = await connect('mission');
    const findResult = await collection.findOne({
      uuid,
    });
    close();

    if (!findResult?._id) {
      return {
        status: 503,
        body: { msg: 'errors.save-not-successful' },
      };
    }
    return {
      status: 200,
      body: {
        mission: findResult,
      },
    };
  } catch (e) {
    console.error('Error while find mission', e);
    return {
      status: 503,
      body: { msg: 'errors.save-not-successful' },
    };
  }
};
