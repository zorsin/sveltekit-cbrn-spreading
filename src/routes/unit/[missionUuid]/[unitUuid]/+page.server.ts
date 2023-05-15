import { redirect } from '@sveltejs/kit';

import * as logger from '$lib/util/logger';
import { close, connect } from '$lib/logic/mongo';

import type { PageServerLoad } from './$types';

const TAG = 'unit/missionUuid/unitUuid.ts';
export const ssr = false;

export const load: PageServerLoad = async ({ params, locals, url }) => {
  const missionUuid = params.missionUuid;
  const unitUuid = params.unitUuid;
  await locals.session.update(() => ({ unit: { uuid: unitUuid, missionId: missionUuid } }));
  logger.info(TAG, `get(${missionUuid}, ${unitUuid})`);
  logger.time(TAG, `get(${missionUuid}, ${unitUuid})`);
  try {
    const collection = await connect('mission');
    const result = await collection.findOne(
      {
        uuid: missionUuid,
      },
      {
        projection: {
          units: 1,
          code: 1,
          uuid: 1,
        },
      },
    );

    close();
    const unit = result?.units?.filter((entry) => entry.unitUuid == unitUuid)?.[0];
    logger.timeEnd(TAG, `get(${missionUuid}, ${unitUuid})`);
    if (!result || !unit) {
      logger.warn(TAG, `get(${missionUuid}, ${unitUuid})::unit-not-found::result::${JSON.stringify(result)}`);
      throw redirect(300, `/unit`);
    }
    logger.info(TAG, `get(${missionUuid}, ${unitUuid})::successful::${result.uuid}`);
    return {
      unit,
      mission: { uuid: result.uuid },
      notify: url.searchParams.get('notify'),
    };
  } catch (e) {
    logger.error(TAG, `get(${missionUuid}, ${unitUuid})::error::${typeof e === 'object' ? JSON.stringify(e) : e}`);
    if (e?.status && e?.body) {
      throw e;
    } else if (e?.status && e?.location) {
      throw e;
    }
    // eslint-disable-next-line no-console
    console.error(e);
  }
};
