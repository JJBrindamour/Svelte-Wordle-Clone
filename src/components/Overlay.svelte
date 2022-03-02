<script>
  import { games, wonCount, currentStreak, highestStreak } from '../stores/user'
  import { currentGuess, word } from '../stores/game'

  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  export let overlayActive
  export let won

  const handleNewWord = () => {
    if (!won) {dispatch('alert', {msg: `The Word Was: ${$word.toUpperCase()}`, time: 3000})}
    dispatch('toggle')
    dispatch('reset-game')
  }
</script>

<main style={`display: ${overlayActive ? 'block' : 'none'};`}>
  <div class="container">
    <div class="res">
      <svg on:click={() => dispatch('toggle')} xmlns="http://www.w3.org/2000/svg" class="x" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>

      <p class="stats-head">Statistics</p>

      <div class="stats">
        <div class="stat">
          <p class="big">{Object.keys($games).length}</p>
          <p class="small">Played</p>
        </div>

        <div class="stat">
          <p class="big">{Math.floor($wonCount / Object.keys($games).length || 0)}</p>
          <p class="small">Win %</p>
        </div>

        <div class="stat">
          <p class="big">{$currentStreak}</p>
          <p class="small">Current<br>Streak</p>
        </div>

        <div class="stat">
          <p class="big">{$highestStreak}</p>
          <p class="small">Max<br>Streak</p>
        </div>
      </div>
      <p on:click={handleNewWord} class='btn'>New Word</p>
    </div>
  </div>
</main>

<style>
  .x {
    position: absolute;
    top: 4vh;
    right: 4vh;
    height: 4vh;
    width: 4vh;
    cursor: pointer;
    color: rgb(255, 23, 23);
  }

  .stats-head {
    margin: 0;
    font-size: 1.5em;
  }

  .btn {
    background-color: #538d4e;
    margin-top: 6vh;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
  }

  .big {
    font-size: 8vh;
    margin: 0;
  }

  .small {
    font-size: 0.65em;
    font-weight: 300;
    margin: 0;
  }

  .stats {
    display: flex;
    justify-content: center;
    align-items: baseline;
  }

  .stat {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0.75em;
    text-align: center;
  }

  .res {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background-color: #121213;
    color: white;
    padding: 32px;
    padding-left: 70px;
    padding-right: 70px;
  }

  .container {
    position: absolute;
    right: 0px;
    top: 0;
    width: 100%;
    height: 94.8vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.25);
    font-size: 3vh;
    padding: 16px;
  }
</style>