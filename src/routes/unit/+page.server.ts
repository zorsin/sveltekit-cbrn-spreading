import * as logger from '$lib/util/logger';

import type { Actions, PageServerLoad } from './$types';
import { close, connect } from '$lib/logic/mongo';

import { redirect } from '@sveltejs/kit';

const TAG = 'unit/index.ts';
export const ssr = false;

/**
 * Load the initial page data
 * Get the data from the cookie and check if mission still exisit before returning the data
 */
export const load: PageServerLoad = async ({ locals, url }) => {
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
      await locals.session.update(() => ({ unit: null }));
    }
  }
  logger.debug(TAG, `unitUuid::${unitUuid}::missionUuid::${missionUuid}`);
  logger.timeEnd(TAG, logData);
  return {
    unitUuid,
    missionUuid,
    notify: url.searchParams.get('notify'),
  };
};

export const actions: Actions = {
  /**
   *
   */
  register: async ({ request, fetch, locals }) => {
    const formData = await request.formData();
    const code = formData.get('code');
    console.log(code);

    const res = await fetch(`/api/mission?code=${code}`);
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      if (data?.mission?.uuid) {
        // TODO: remove only redirect with the code
        const sessionData = locals.session.data;
        await locals.session.set({ ...sessionData, missionUuid: data.mission.uuid });

        throw redirect(301, `/unit/register?id=${data.mission.uuid}`);
      }
      return { success: false };
    }

    return { success: false };
  },
};
