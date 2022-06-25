import { Spread } from '$lib/model';
import * as logger from '$lib/util/logger';
const TAG = 'api/spread/calc.ts';

export const post = async ({ request }) => {
  const body = await request.json();
  logger.info(TAG, `post(${JSON.stringify(body)})`);
  logger.time(TAG, `post(${JSON.stringify(body)})`);
  const spread = new Spread(body.start, body.width, body.length, body.angle, body.strength);
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
  logger.timeEnd(TAG, `post(${JSON.stringify(body)})`);
  logger.debug(TAG, `post(${JSON.stringify(body)})::result::${JSON.stringify(bodyRes)}`);
  return {
    status: 200,
    body: bodyRes,
  };
};
