import { writable } from 'svelte/store';

export const games = writable(
  localStorage.wordle_clone_games
    ? JSON.parse(localStorage.wordle_clone_games)
    : {}
);
games.subscribe(
  (value) => (localStorage.wordle_clone_games = JSON.stringify(value))
);

export const wonCount = writable(
  parseInt(localStorage.wordle_clone_wonCount) || 0
);
wonCount.subscribe(
  (value) => (localStorage.wordle_clone_wonCount = String(value))
);

export const currentStreak = writable(
  parseInt(localStorage.wordle_clone_currentStreak) || 0
);
currentStreak.subscribe(
  (value) => (localStorage.wordle_clone_currentStreak = String(value))
);

export const highestStreak = writable(
  parseInt(localStorage.wordle_clone_highestStreak) || 0
);
highestStreak.subscribe(
  (value) => (localStorage.wordle_clone_highestStreak = String(value))
);

export const won = writable(parseInt(localStorage.wordle_clone_won) || false);
won.subscribe((value) => (localStorage.wordle_clone_won = String(value)));
