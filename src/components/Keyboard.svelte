<script>
    import { gameState, word, letterColors, currentGuess, guessNumber } from '../stores/game'
    import { words } from '../words'

    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    $: won = $currentGuess == word

    const validateGuess = guess => {
        if (guess.length == 5 && words.includes(guess.toLowerCase())) return true
        else if (guess.length == 5) {
            dispatch('alert', {msg: 'Not in Word List'})
        } else if (guess.length < 5) {
            dispatch('alert', {msg: 'Not Enough Letters'})
        }

        return false
    }

    const submitGuess = (guess) => {
        guess = guess.toLowerCase()
        let qwertyLets = 'qwertyuiopasdfghjklzxcvbnm'
        for (let i=0; i<guess.length; i++) {
            let indices = []
            let idx = $word.indexOf(guess[i])
            while (idx != -1) {
                indices.push(idx)
                idx = $word.indexOf(guess[i], idx + 1)
            }
            
            if (indices.length > 0) {
                if (indices.includes(i)) $letterColors[qwertyLets.indexOf(guess[i])] = $gameState[$guessNumber][i][1] = '#538d4e'
                else if(guess.indexOf(guess[i]) == i) $letterColors[qwertyLets.indexOf(guess[i])] = $gameState[$guessNumber][i][1] = '#b59f3b'
                else $letterColors[qwertyLets.indexOf(guess[i])] = $gameState[$guessNumber][i][1] = '#353537'
            } else $letterColors[qwertyLets.indexOf(guess[i])] = $gameState[$guessNumber][i][1] = '#353537'
        }


        if (won) {
            dispatch('alert', {text: 'Splendid'})
        }
        if ($guessNumber < 5) $guessNumber += 1
        else {
            dispatch('alert', {msg: `The Word Was: ${$word.toUpperCase()}`, time: 5000})
            dispatch('toggle-overlay')
            console.log(won)
        }
        $currentGuess = ''
    }
    
    const handleLetterPressed = letter => {
        if (!won) {
            if (letter == 'ENTER') {
                if (validateGuess($currentGuess)) {
                    submitGuess($currentGuess)
                }
            } else if (letter == 'DEL') {
                $currentGuess = $currentGuess.slice(0, -1)
                $gameState[$guessNumber][$currentGuess.length][0] = ''
            } else if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(letter) && $currentGuess.length < 5) {
                $currentGuess += letter
                $gameState[$guessNumber][$currentGuess.length - 1][0] = letter
            }
        }
    }
</script>

<main class="keyboard">
    <div class="row" id="row-one">
        <p on:click|preventDefault={() => handleLetterPressed('Q')} class="key" style={'background-color: ' + $letterColors[0]}>Q</p>
        <p on:click|preventDefault={() => handleLetterPressed('W')} class="key" style={'background-color: ' + $letterColors[1]}>W</p>
        <p on:click|preventDefault={() => handleLetterPressed('E')} class="key" style={'background-color: ' + $letterColors[2]}>E</p>
        <p on:click|preventDefault={() => handleLetterPressed('R')} class="key" style={'background-color: ' + $letterColors[3]}>R</p>
        <p on:click|preventDefault={() => handleLetterPressed('T')} class="key" style={'background-color: ' + $letterColors[4]}>T</p>
        <p on:click|preventDefault={() => handleLetterPressed('Y')} class="key" style={'background-color: ' + $letterColors[5]}>Y</p>
        <p on:click|preventDefault={() => handleLetterPressed('U')} class="key" style={'background-color: ' + $letterColors[6]}>U</p>
        <p on:click|preventDefault={() => handleLetterPressed('I')} class="key" style={'background-color: ' + $letterColors[7]}>I</p>
        <p on:click|preventDefault={() => handleLetterPressed('O')} class="key" style={'background-color: ' + $letterColors[8]}>O</p>
        <p on:click|preventDefault={() => handleLetterPressed('P')} class="key" style={'background-color: ' + $letterColors[9]}>P</p>
    </div>

    <div class="row" id="row-two">
        <p on:click|preventDefault={() => handleLetterPressed('A')} class="key" style={'background-color: ' + $letterColors[10]}>A</p>
        <p on:click|preventDefault={() => handleLetterPressed('S')} class="key" style={'background-color: ' + $letterColors[11]}>S</p>
        <p on:click|preventDefault={() => handleLetterPressed('D')} class="key" style={'background-color: ' + $letterColors[12]}>D</p>
        <p on:click|preventDefault={() => handleLetterPressed('F')} class="key" style={'background-color: ' + $letterColors[13]}>F</p>
        <p on:click|preventDefault={() => handleLetterPressed('G')} class="key" style={'background-color: ' + $letterColors[14]}>G</p>
        <p on:click|preventDefault={() => handleLetterPressed('H')} class="key" style={'background-color: ' + $letterColors[15]}>H</p>
        <p on:click|preventDefault={() => handleLetterPressed('J')} class="key" style={'background-color: ' + $letterColors[16]}>J</p>
        <p on:click|preventDefault={() => handleLetterPressed('K')} class="key" style={'background-color: ' + $letterColors[17]}>K</p>
        <p on:click|preventDefault={() => handleLetterPressed('L')} class="key" style={'background-color: ' + $letterColors[18]}>L</p>
    </div>

    <div class="row" id="row-three">
        <p on:click|preventDefault={() => handleLetterPressed('ENTER')} class="key" style='background-color: #818384' id="enter">ENTER</p>
        <p on:click|preventDefault={() => handleLetterPressed('Z')} class="key" style={'background-color: ' + $letterColors[19]}>Z</p>
        <p on:click|preventDefault={() => handleLetterPressed('X')} class="key" style={'background-color: ' + $letterColors[20]}>X</p>
        <p on:click|preventDefault={() => handleLetterPressed('C')} class="key" style={'background-color: ' + $letterColors[21]}>C</p>
        <p on:click|preventDefault={() => handleLetterPressed('V')} class="key" style={'background-color: ' + $letterColors[22]}>V</p>
        <p on:click|preventDefault={() => handleLetterPressed('B')} class="key" style={'background-color: ' + $letterColors[23]}>B</p>
        <p on:click|preventDefault={() => handleLetterPressed('N')} class="key" style={'background-color: ' + $letterColors[24]}>N</p>
        <p on:click|preventDefault={() => handleLetterPressed('M')} class="key" style={'background-color: ' + $letterColors[25]}>M</p>
        <p on:click|preventDefault={() => handleLetterPressed('DEL')} class="key" style='background-color: #818384' id="del">
            <svg xmlns="http://www.w3.org/2000/svg" class="backspace" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
        </p>
    </div>

</main>
<svelte:window
    on:keydown={e => {
        if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(e.key) && $currentGuess.length < 5) handleLetterPressed(e.key.toUpperCase())
        else if (e.key == 'Enter') handleLetterPressed('ENTER')
        else if (e.key == 'Backspace') handleLetterPressed('DEL')
    }} 
/>

<style>
    .keyboard {
        display: flex;
        flex-direction: column;
        gap: 6px;
        width: 500px;
    }

    .row {
        display: flex;
        justify-content: center;
        gap: 6px;
        align-items: center;
    }

    .key {
        user-select: none;
        color: white;
        height: 58px;
        width: 43px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        margin: 0;
    }

    .key:hover {
        cursor: pointer;
    }

    .backspace {
        height: 35px;
    }

    #del, #enter {
        width: 64.5px;
    }
</style>