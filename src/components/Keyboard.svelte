<script>
    import { gameState, word } from '../stores'
    import { words } from '../words'
 
    let currentGuess = ''
    let guessNumber = 0

    const validateGuess = guess => {
        if (guess.length == 4 && words.includes(guess)) return true
        return false
    }

    const submitGuess = (guess) => {
        for (let i=0; i<guess.length; i++) {
            if ($word.includes(guess[i])) {
                if ($word[i] == guess[i]) {
                    $gameState[guessNumber][i][1] = '#538d4e'
                } else {
                    $gameState[guessNumber][i][1] = '#b59f3b'
                }
            } else {
                $gameState[guessNumber][i][1] = '#353537'
            }
        }
        currentGuess = ''
        if (guessNumber < 6) guessNumber += 1
    }
    
    const handleLetterPressed = letter => {
        if (letter == 'ENTER') {
            if (validateGuess(currentGuess)) {
                submitGuess(currentGuess)
            }
        } else if (letter == 'DEL') {
            currentGuess = currentGuess.slice(0, -1)
            $gameState[guessNumber][currentGuess.length][0] = ''
        } else if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(letter) && currentGuess.length < 5) {
            currentGuess += letter
            $gameState[guessNumber][currentGuess.length - 1][0] = letter
        }
    }
</script>

<main class="keyboard">
    <div class="row" id="row-one">
        <p on:click|preventDefault={() => handleLetterPressed('Q')} class="key">Q</p>
        <p on:click|preventDefault={() => handleLetterPressed('W')} class="key">W</p>
        <p on:click|preventDefault={() => handleLetterPressed('E')} class="key">E</p>
        <p on:click|preventDefault={() => handleLetterPressed('R')} class="key">R</p>
        <p on:click|preventDefault={() => handleLetterPressed('T')} class="key">T</p>
        <p on:click|preventDefault={() => handleLetterPressed('Y')} class="key">Y</p>
        <p on:click|preventDefault={() => handleLetterPressed('U')} class="key">U</p>
        <p on:click|preventDefault={() => handleLetterPressed('I')} class="key">I</p>
        <p on:click|preventDefault={() => handleLetterPressed('O')} class="key">O</p>
        <p on:click|preventDefault={() => handleLetterPressed('P')} class="key">P</p>
    </div>

    <div class="row" id="row-two">
        <p on:click|preventDefault={() => handleLetterPressed('A')} class="key">A</p>
        <p on:click|preventDefault={() => handleLetterPressed('S')} class="key">S</p>
        <p on:click|preventDefault={() => handleLetterPressed('D')} class="key">D</p>
        <p on:click|preventDefault={() => handleLetterPressed('F')} class="key">F</p>
        <p on:click|preventDefault={() => handleLetterPressed('G')} class="key">G</p>
        <p on:click|preventDefault={() => handleLetterPressed('H')} class="key">H</p>
        <p on:click|preventDefault={() => handleLetterPressed('J')} class="key">J</p>
        <p on:click|preventDefault={() => handleLetterPressed('K')} class="key">K</p>
        <p on:click|preventDefault={() => handleLetterPressed('L')} class="key">L</p>
    </div>

    <div class="row" id="row-three">
        <p on:click|preventDefault={() => handleLetterPressed('ENTER')} class="key" id="enter">ENTER</p>
        <p on:click|preventDefault={() => handleLetterPressed('Z')} class="key">Z</p>
        <p on:click|preventDefault={() => handleLetterPressed('X')} class="key">X</p>
        <p on:click|preventDefault={() => handleLetterPressed('C')} class="key">C</p>
        <p on:click|preventDefault={() => handleLetterPressed('V')} class="key">V</p>
        <p on:click|preventDefault={() => handleLetterPressed('B')} class="key">B</p>
        <p on:click|preventDefault={() => handleLetterPressed('N')} class="key">N</p>
        <p on:click|preventDefault={() => handleLetterPressed('M')} class="key">M</p>
        <p on:click|preventDefault={() => handleLetterPressed('DEL')} class="key" id="del">
            <svg xmlns="http://www.w3.org/2000/svg" class="backspace" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
        </p>
    </div>

</main>
<svelte:window 
    on:keydown={e => {
        if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(e.key) && currentGuess.length < 5) handleLetterPressed(e.key.toUpperCase())
        else if (e.key == 'Enter') handleLetterPressed('ENTER')
        else if (e.key == 'Backspace') handleLetterPressed('DEL')
    }} />

<style>
    .keyboard {
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
        background-color: #818384;
        border-radius: 4px;
        margin-top: 4px;
        margin-bottom: 4px;
    }

    .key:hover {
        cursor: pointer;
        background-color: #737779;
    }

    .backspace {
        height: 35px;
    }

    #del, #enter {
        width: 64.5px;
    }
</style>