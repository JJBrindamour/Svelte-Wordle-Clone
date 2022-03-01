<script>
	import Header from "./components/Header.svelte"
	import Keyboard from "./components/Keyboard.svelte"
	import { gameState } from "./stores"

	let active
	let message = ''
	const setAlert = (msg, time=2000) => {
		active = true
		message = msg
		
		setTimeout(() => active = false, time);
	}
</script>

<main>
	<Header />
	
	<div class="alert-container">
		<p class="alert" style={`display: ${active ? 'block' : 'none'}`}>{message}</p>
	</div>

	<div class="game">
		<div class="container">
			{#each $gameState as row}
				{#each row as el}
					<p class="item" style='background-color: {el[1]}; border: 2px solid {el[1] != 'transparent' ? el[1] : '#353537'};'>{el[0]}</p>
				{/each}
			{/each}
		</div>
	</div>
	<div class="keyboard-container"><Keyboard setAlert={setAlert} /></div>
</main> 

<style>
	main {
		height: 97.45vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.alert-container {
    display: flex;
    justify-content: center;
  }
  
  .alert{
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: white;
    color: #121213;
    position: absolute;
    top: 54px;
    border-radius: 8px;
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