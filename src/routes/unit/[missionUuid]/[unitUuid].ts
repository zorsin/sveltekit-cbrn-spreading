import type { RequestHandler } from './__types/[unitUuid]';
import { connect, close } from '$lib/logic/mongo';
import * as logger from '$lib/util/logger';
const TAG = 'unit/missionUuid/unitUuid.ts';

export const get: RequestHandler = async ({ params, locals }) => {
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
      logger.warn(
        TAG,
        `get(${missionUuid}, ${unitUuid})::unit-not-found::result::${JSON.stringify(result)}`,
      );
      return {
        status: 404,
      };
    }
    logger.info(TAG, `get(${missionUuid}, ${unitUuid})::successful::${result.uuid}`);
    return {
      status: 200,
      body: {
        unit,
        mission: { uuid: result.uuid },
      },
    };
  } catch (e) {
    console.error(e);
  }
};
