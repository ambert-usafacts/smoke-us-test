import { derived, writable } from 'svelte/store';

export const location = writable({value: '42660', label: 'Seattle-Tacoma-Bellevue, WA Metro Area'});