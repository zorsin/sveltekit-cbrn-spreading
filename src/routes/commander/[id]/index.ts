import { connect, close } from '$lib/logic/mongo';
import { Spread } from '$lib/model';

/** @type {import('@sveltejs/kit').RequestHandler} */
export const get = async ({ params }) => {
  try {
    const collection = await connect('spread');
    const dbSpread = await collection.findOne({
      $or: [{ name: params.id }, { uuid: params.id }],
    });
    close();

    const spread = new Spread(
      dbSpread.start,
      dbSpread.width,
      dbSpread.length,
      dbSpread.angle,
      dbSpread.strength,
    );
    spread.calculateEllipse();
    // NOTE: a colored spread can be > 70MB, this is to much to transmit
    const lines = spread.getColoredSpreadLight();
    return {
      status: 200,
      body: {
        spreadId: params.id,
        spread: dbSpread,
        lines,
      },
    };
  } catch (e) {
    console.error('Error while getting a spread', e);

    return {
      status: 503,
      body: { msg: 'errors.no-query' },
    };
  }
};
