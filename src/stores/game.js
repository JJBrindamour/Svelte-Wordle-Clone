import { writable } from 'svelte/store';
import { words } from '../words'


export const gameState = writable([
  [['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],	
	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
]);

export const currentGuess = writable('');
export const guessNumber = writable(0);

export const letterColors = writable(['#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384'])

export const word = writable(words[Math.floor(Math.random() * (words.length - 1))])