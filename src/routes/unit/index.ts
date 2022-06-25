import type { RequestHandler } from './__types/index';
import { connect, close } from '$lib/logic/mongo';
import * as logger from '$lib/util/logger';
const TAG = 'unit/index.ts';

export const get: RequestHandler = async ({ locals }) => {
  let missionUuid = null;
  let unitUuid = locals.session.data?.unit?.uuid;
  const logData = `get(${locals.session.data?.unit?.missionId},${unitUuid})`;
  logger.info(TAG, logData);
  logger.time(TAG, logData);
  // check if the mission is available in the db
  if (locals.session.data?.unit?.missionId) {
    const cookieMission = locals.session.data.unit.missionId;
    const collMission = await connect('mission');
    const resMission = await collMission.findOne({ uuid: cookieMission });
    close();
    if (resMission) {
      missionUuid = cookieMission;
    } else {
      unitUuid = null;
      await locals.session.update(() => ({ unit: { uuid: null, missionId: null } }));
    }
  }
  logger.debug(TAG, `unitUuid::${unitUuid}::missionUuid::${missionUuid}`);
  logger.timeEnd(TAG, logData);
  return {
    status: 200,
    body: {
      unitUuid,
      missionUuid,
    },
  };
};
