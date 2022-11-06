import * as logger from '$lib/util/logger';

import type { RequestHandler } from './$types';
import { Spread } from '$lib/model';
import type { SpreadRing } from '$lib/model/spread';

const TAG = 'api/spread/calc.ts';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  logger.info(TAG, `post(${JSON.stringify(body)})`);
  logger.time(TAG, `post(${JSON.stringify(body)})`);
  const spread = new Spread(body.start, body.width, body.length, body.angle, body.strength);
  let lines = [];
  if (body.showStrength) {
    const linesColor: SpreadRing[] = spread.getSpreadStrengthLight();
    lines = linesColor.map((ring) => {
      return { id: ring.id, latLngs: ring.latLngs, color: ring.color };
    });
  } else {
    const latLngs = spread.toCoordnates();
    lines = [
      {
        id: '0',
        latLngs,
        color: '#000',
      },
    ];
  }
  const bodyRes = { lines };
  logger.timeEnd(TAG, `post(${JSON.stringify(body)})`);
  logger.debug(TAG, `post(${JSON.stringify(body)})::result::${JSON.stringify(bodyRes)}`);
  return new Response(JSON.stringify(bodyRes));
};
