<script>
	import Header from "./components/Header.svelte";
	import Keyboard from "./components/Keyboard.svelte";
	import { gameState } from "./stores"
</script>

<main>
	<Header></Header>
	<div class="game">
		<div class="container">
			<!-- {#each $gameState[0] as letter, i}
				<p class="item">{letter}</p>
			{/each}

			{#each $gameState[1] as letter, i}
				<p class="item">{letter}</p>
			{/each}

			{#each $gameState[2] as letter, i}
				<p class="item">{letter}</p>
			{/each}

			{#each $gameState[3] as letter, i}
				<p class="item">{letter}</p>
			{/each}

			{#each $gameState[4] as letter, i}
				<p class="item">{letter}</p>
			{/each}

			{#each $gameState[5] as letter, i}
				<p class="item">{letter}</p>
			{/each} -->

			{#each $gameState as row}
				{#each row as el}
					<p class="item" style='background-color: {el[1]}'></p>
				{/each}
			{/each}
		</div>
	</div>
	<div class="keyboard-container"><Keyboard gameEls /></div>
</main> 

<style>
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
		max-width: 350px;
	}
</style>