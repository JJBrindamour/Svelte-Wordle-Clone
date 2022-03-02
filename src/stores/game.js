import { writable } from 'svelte/store';
import { words } from '../words'


export const gameState = writable(localStorage.wordle_clone_gameState ? JSON.parse(localStorage.wordle_clone_gameState) : [
  [['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],	
	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
]);
gameState.subscribe(value => localStorage.wordle_clone_gameState = JSON.stringify(value))

export const currentGuess = writable(localStorage.wordle_clone_currentGuess || '');
currentGuess.subscribe(value => localStorage.wordle_clone_currentGuess = value)

export const guessNumber = writable(parseInt(localStorage.wordle_clone_guessNumber) || 0);
guessNumber.subscribe(value => localStorage.wordle_clone_guessNumber = String(value))

export const letterColors = writable(localStorage.wordle_clone_letterColors ? JSON.parse(localStorage.wordle_clone_letterColors) : ['#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384'])
letterColors.subscribe(value => localStorage.wordle_clone_letterColors = JSON.stringify(value))

export const word = writable(localStorage.wordle_clone_word || words[Math.floor(Math.random() * (words.length - 1))])
word.subscribe(value => localStorage.wordle_clone_word = value)
