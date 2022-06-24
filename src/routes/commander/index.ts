import type { RequestHandler } from './__types/index';
import { connect, close } from '$lib/logic/mongo';

export const get: RequestHandler = async ({ locals }) => {
  let recentSpreads = [];
  let mission = null;
  let unit = null;
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
      recentSpreads = cookieSpread;
    } else {
      const dbUuids = resSpread.map((spread) => spread.uuid);
      recentSpreads = cookieSpread.filter((spread) => dbUuids.includes(spread.id));
    }
  }
  // check if the mission is available in the db
  if (locals.session?.data?.mission) {
    const cookieMission = locals.session.data.mission;
    const collMission = await connect('mission');
    const resMission = await collMission.findOne({ uuid: cookieMission.uuid });
    close();
    if (resMission) {
      mission = cookieMission;
    }
  }
  if (locals.session?.data?.unit) {
    unit = locals.session?.data?.unit;
  }

  await locals.session.set({ recentSpreads, mission, unit });

  return {
    status: 200,
    body: {
      recentSpreads,
      mission,
    },
  };
};
