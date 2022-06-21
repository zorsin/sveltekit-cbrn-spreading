/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
  // interface Locals {  }

  //interface Platform {}

  interface Session {
    acceptedLanguage: string; // used for translations
  }

  //interface Stuff {}
}
