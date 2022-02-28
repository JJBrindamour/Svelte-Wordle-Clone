<script>
	import Header from "./components/Header.svelte"
	import Keyboard from "./components/Keyboard.svelte"
	import { gameState } from "./stores"

	let active = false
	let message = ''
	const setAlert = msg => {
		active = true
		message = msg

		setTimeout(() => active = false, 2000);
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
	<div class="keyboard-container"><Keyboard alert /></div>
</main> 

<style>
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
		margin-top: 45px;
	}
	.item {
		background-color: transparent;
		border: 2px solid #353537;
		font-size: 32px;
		font-weight: bold;
		color: whitesmoke;
		text-align: center;
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.container {
		display: grid;
		grid-template-rows: repeat(6, 58px);
		grid-template-columns: repeat(5, 58px);
		grid-gap: 10px;
		justify-content: center;
		align-content: center;
	}
</style>