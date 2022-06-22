import type { RequestHandler } from './__types/index';

export const get: RequestHandler = async ({ locals }) => {
  let recentSpreads = [];
  let mission = null;
  if (locals.session?.data?.recentSpreads) {
    recentSpreads = locals.session?.data?.recentSpreads;
  }
  if (locals.session?.data?.mission) {
    mission = locals.session?.data?.mission;
  }
  await locals.session.set({ recentSpreads, mission });

  return {
    status: 200,
    body: {
      recentSpreads,
      mission,
    },
  };
};
