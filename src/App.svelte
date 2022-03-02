<script>
	import Header from "./components/Header.svelte"
	import Keyboard from "./components/Keyboard.svelte"
	import Overlay from "./components/Overlay.svelte";
	import Alert from "./components/Alert.svelte"
	import { gameState, guessNumber, currentGuess, letterColors, word } from "./stores/game"
	import { words } from "./words"

	import { onMount } from "svelte"

	let overlayActive = false

	const toggleOverlay = () => {
		overlayActive = !overlayActive
	}

	onMount(() => {if ($currentGuess == $word.toUpperCase()); setTimeout(toggleOverlay, 2500)})

	const resetGame = () => {
		$gameState = [
			[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],	
			[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
			[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
			[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
			[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
			[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
		]

		$letterColors = ['#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384', '#818384']
		$word = words[Math.floor(Math.random() * (words.length - 1))]
		$currentGuess = ''
  	$guessNumber = 0
	}

	let alertActive = false
	let alertMessage = ''
	const setAlert = (msg, time=2000) => {
		alertActive = true
		alertMessage = msg
		
		setTimeout(() => alertActive = false, time);
	}
</script>

<main>
	<Overlay on:alert={e => setAlert(e.detail.msg, e.detail.time)} on:reset-game={resetGame} on:toggle={toggleOverlay} {overlayActive} />
	<Header on:toggle-overlay={toggleOverlay} />
	<Alert {alertActive} {alertMessage} />

	<div class="game">
		<div class="container">
			{#each $gameState as row}
				{#each row as el}
					<p class="item" style='background-color: {el[1]}; border: 2px solid {el[1] != 'transparent' ? el[1] : '#353537'};'>{el[0]}</p>
				{/each}
			{/each}
		</div>
	</div>
	<div class="keyboard-container"><Keyboard on:disable-alert={() => alertActive = false} on:toggle-overlay={toggleOverlay} on:alert={e => setAlert(e.detail.msg, e.detail.time)} /></div>
</main> 

<style>
	main {
		height: 97.45vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.game {
		display: flex;
		justify-content: center;
	}

	.keyboard-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.item {
		background-color: transparent;
		border: 2px solid #353537;
		font-size: 4.75vh;
		min-height: 1.5em;
		min-width: 1.5em;
		font-weight: bold;
		color: whitesmoke;
		text-align: center;
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0;
	}

	.container {
		display: grid;
		grid-template-rows: repeat(6, 1fr);
		grid-template-columns: repeat(5, 1fr);
		grid-gap: 10px;
		justify-content: center;
		align-content: center;
		margin-bottom: 10px;
	}
</style>