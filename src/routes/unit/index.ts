import type { RequestHandler } from './__types/index';

export const get: RequestHandler = async ({ locals }) => {
  return {
    status: 200,
    body: {
      unitUuid: locals.session.data?.unit?.uuid,
      missionUuid: locals.session.data?.unit?.missionId,
    },
  };
};
