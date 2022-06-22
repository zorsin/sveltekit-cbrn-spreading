import { connect, close } from '$lib/logic/mongo';

/** @type {import('@sveltejs/kit').RequestHandler} */
export const get = async ({ locals }) => {
  let recentSpreads = [];
  if (locals.session?.data?.recentSpreads) {
    recentSpreads = locals.session?.data?.recentSpreads;
  } else {
    await locals.session.set({ recentSpreads });
  }

  return {
    status: 200,
    body: {
      recentSpreads,
    },
  };
};
