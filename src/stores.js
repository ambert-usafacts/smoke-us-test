import { derived, writable } from 'svelte/store';

export const location = writable({value: '42660', label: 'Seattle-Tacoma-Bellevue, WA'});
export const selected_age = writable()
export const hovered_year = writable()