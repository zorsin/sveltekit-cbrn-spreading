import type { RequestHandler } from './__types/[unitUuid]';
import { connect, close } from '$lib/logic/mongo';

export const get: RequestHandler = async ({ params, locals }) => {
  const missionUuid = params.missionUuid;
  const unitUuid = params.unitUuid;
  await locals.session.update(() => ({ unit: { uuid: unitUuid, missionId: missionUuid } }));

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

    if (!result || !unit) {
      return {
        status: 404,
      };
    }

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
