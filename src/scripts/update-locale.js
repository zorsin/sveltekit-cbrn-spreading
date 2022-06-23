import { readFileSync, writeFileSync } from 'node:fs';
(() => {
  const masterLocale = readFileSync('./locales/de.json').toString();
  const data = masterLocale.replace(/:\s?".+"/gim, ': ""');
  writeFileSync('./locales/en.json', data);
})();
