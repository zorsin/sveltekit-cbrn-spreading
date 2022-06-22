import { connect, close } from '$lib/logic/mongo';
import { Spread } from '$lib/model';

export const get = async ({ params }) => {
  const collection = await connect('spread');
  // TODO: catch invalid names
  // TODO: also support id
  const dbSpread = await collection.findOne({ name: `${params.id}` });
  close();
  const spread = new Spread(
    dbSpread.start,
    dbSpread.width,
    dbSpread.length,
    dbSpread.angle,
    dbSpread.strength,
  );
  spread.calculateEllipse();
  const latLngs = spread.toCoordnates();
  // TODO: change to colored view
  const lines = [
    {
      id: '0',
      latLngs,
      color: '#000',
    },
  ];

  return {
    status: 200,
    body: {
      spreadId: params.id,
      spread: dbSpread,
      lines,
    },
  };
};
