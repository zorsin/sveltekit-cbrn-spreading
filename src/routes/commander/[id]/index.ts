import { connect, close } from '$lib/logic/mongo';
import { Spread } from '$lib/model';

export const get = async ({ params }) => {
  const collection = await connect('spread');
  // TODO: catch invalid names
  // TODO: also support id
  const dbSpread = await collection.findOne({ name: `${params.id}` });
  close();
  // NOTE: a colored spread can be > 30MB, this is to much to transmit
  // change to colored view
  // const spread = new Spread(
  //   dbSpread.start,
  //   dbSpread.width,
  //   dbSpread.length,
  //   dbSpread.angle,
  //   dbSpread.strength,
  // );
  // spread.calculateEllipse();
  // const lines = spread.getColoredSpread();

  return {
    status: 200,
    body: {
      spreadId: params.id,
      spread: dbSpread,
      // lines,
    },
  };
};
