import { Spread } from '$lib/model';

export const post = async ({ request }) => {
  const body = await request.json();
  const spread = new Spread(body.start, body.width, body.length, body.angle, body.strength);
  spread.calculateEllipse();
  const latLngs = spread.toCoordnates();
  const bodyRes = {
    lines: [
      {
        id: '0',
        latLngs,
        color: '#000',
      },
    ],
  };

  return {
    status: 200,
    body: bodyRes,
  };
};
