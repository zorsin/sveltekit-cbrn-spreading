import * as logger from '$lib/util/logger';

import { close, connect } from '$lib/logic/mongo';

import type { PageServerLoad } from './$types';
const TAG = 'commander/index.ts';
export const ssr = false;

export const load: PageServerLoad = async ({ locals }) => {
  let recentSpreads = [];
  let mission = null;
  let unit = null;
  logger.info(TAG, `get(${JSON.stringify(locals.session?.data?.recentSpreads)})`);
  logger.time(TAG, `get(${JSON.stringify(locals.session?.data?.recentSpreads)})`);
  // check if the spread available in the db
  if (locals.session?.data?.recentSpreads && locals.session?.data?.recentSpreads.length > 0) {
    const cookieSpread = locals.session.data.recentSpreads;
    const filterSpreads = cookieSpread.map((spread) => {
      return { uuid: spread.id };
    });
    const collSpread = await connect('spread');
    const resSpread = await collSpread.find({ $or: filterSpreads }).toArray();
    close();
    if (resSpread.length == filterSpreads.length) {
      logger.info(TAG, `all-spreads-exists`);
      recentSpreads = cookieSpread;
    } else {
      const dbUuids = resSpread.map((spread) => spread.uuid);
      recentSpreads = cookieSpread.filter((spread) => dbUuids.includes(spread.id));
      logger.info(TAG, `only-few-spreads-exists`);
    }
  }
  // check if the mission is available in the db
  if (locals.session?.data?.mission) {
    logger.info(TAG, `check-missions::${JSON.stringify(locals.session?.data?.mission)}`);
    const cookieMission = locals.session.data.mission;
    const collMission = await connect('mission');
    const resMission = await collMission.findOne({ uuid: cookieMission.uuid });
    close();
    if (resMission) {
      mission = cookieMission;
      logger.info(TAG, `mission-exists`);
    }
  }
  if (locals.session?.data?.unit) {
    unit = locals.session?.data?.unit;
  }

  await locals.session.set({ recentSpreads, mission, unit });
  logger.timeEnd(TAG, `get(${JSON.stringify(locals.session?.data?.recentSpreads)})`);
  logger.info(TAG, `get(${JSON.stringify(locals.session?.data?.recentSpreads)})::successful`);
  return {
    recentSpreads,
    mission,
  };
};
