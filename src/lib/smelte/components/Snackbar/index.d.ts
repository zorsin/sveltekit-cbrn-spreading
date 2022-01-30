import type { default as Snackbar_ } from './Snackbar.svelte';
import type { default as Notifications_, notifier } from './Notifications.svelte';

declare class Snackbar extends Snackbar_ {}
declare class Notifications extends Notifications_ {}

export { notifier, Notifications };
export default Snackbar;
