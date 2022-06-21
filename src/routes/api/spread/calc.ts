import { Spread } from '$lib/model';

export const post = async ({ request }) => {
  const body = await request.json();
  const spread = new Spread(body.start, body.width, body.length, body.angle, body.strength);
  spread.calculateEllipse();
  const latLngs = spread.toCoordnates();
  return {
    status: 200,
    body: {
      lines: [
        {
          id: '0',
          latLngs,
          color: '#000',
        },
      ],
    },
  };
};
