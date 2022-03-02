<script>
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
</script>

<main>
    <div class="head">
        <div style="width: 32px;"></div>
        <!-- <svg style="margin: 8px;" xmlns="http://www.w3.org/2000/svg" width="24px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg> -->
        <h1 class="title">Wordle Clone</h1>
        <svg on:click={() => dispatch('toggle-overlay')} style="margin: 8px;" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="white"><rect fill="none" height="24" width="24"/>
            <path d="M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z"/>
        </svg>
    </div>
    <hr>
</main>

<style>
    .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
        padding: 0;
        margin: 0;
    }

    hr {
        border: 0px;
        border-top: 1px solid #353537;
        margin: 4px;
    }

    .title {
        font-size: 32px;
        text-align: center;
        padding: 1px;
        margin: 0;
    }
</style>