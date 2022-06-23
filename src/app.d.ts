/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference types="@sveltejs/kit" />

interface SessionData {
  // Your session data
  recentSpreads?: Record<string, string>[];
  mission?: { code: string; uuid: string };
  unit?: { uuid: string; missionId?: string };
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
  interface Locals {
    session: import('svelte-kit-cookie-session').Session<SessionData>;
    cookies: Record<string, string>; // all parsed cookies are automatically set from handleSession to avoid overhead
  }

  //interface Platform {}

  interface Session extends SessionData {
    acceptedLanguage: string; // used for translations
    missionUuid?: string; // used by unit for registrarion
  }

  //interface Stuff {}
}
