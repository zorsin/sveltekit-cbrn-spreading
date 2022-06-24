import type { RequestHandler } from './__types/index';
import { connect, close } from '$lib/logic/mongo';

export const get: RequestHandler = async ({ locals }) => {
  let missionUuid = null;
  let unitUuid = locals.session.data?.unit?.uuid;
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

  return {
    status: 200,
    body: {
      unitUuid,
      missionUuid,
    },
  };
};
