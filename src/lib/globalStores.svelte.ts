import { writable } from 'svelte/store';

export const globalIsPlaying = writable(false);
export const globalPlayPause = writable<(() => void)[]>([]);
