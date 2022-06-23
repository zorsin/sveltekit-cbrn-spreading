import type { RequestHandler } from './__types/index';

export const get: RequestHandler = async ({ locals }) => {
  let recentSpreads = [];
  let mission = null;
  let unit = null;
  // TODO: check if they exist in DB if not clear values
  if (locals.session?.data?.recentSpreads) {
    recentSpreads = locals.session?.data?.recentSpreads;
  }
  if (locals.session?.data?.mission) {
    mission = locals.session?.data?.mission;
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
