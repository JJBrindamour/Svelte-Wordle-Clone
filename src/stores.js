import { writable } from 'svelte/store';
import { words } from './words'


export const gameState = writable([
    [['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],	
	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
]);

// export const word = writable(words[Math.floor(Math.random() * (list.length - 1))])
export const word = writable('CHANT')