import { Spread } from '$lib/model';

export const post = async ({ request }) => {
  const body = await request.json();
  const spread = new Spread(body.start, body.width, body.length, body.angle, body.strength);
  // TODO: save to data base
  // TODO: generate a token for the user

  return {
    status: 200,
  };
};
