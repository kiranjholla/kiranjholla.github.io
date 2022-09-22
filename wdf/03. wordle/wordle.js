let activeRow = 1;
let activeColumn = 1;
let targetWord;
let charCounts;

const allowedKeys = ['Backspace', 'Enter'];
const messageEl = document.getElementById('message-content');
const spinnerEl = document.getElementById('spinner');

/**
 * initialize() : Function retrieves the word of the day from the server
 * and sets up the game
 */
function initialize() {
  activeRow = 1;
  activeColumn = 1;

  startSpinner();
  fetch('https://words.dev-apis.com/word-of-the-day')
    .then(response => response.json())
    .then(({ word }) => {
      targetWord = word;
      charCounts = countCharacters(targetWord);
      document.addEventListener('keyup', handleKeyup);
      stopSpinner();
    });
}

/**
 * countCharacters() : Count characters within a word and return a map of characters
 * and their respective counts within that word
 *
 * @param {string} word
 * @returns Object containing character counts
 */
function countCharacters(word) {
  const charCount = {};
  for (let i = 0; i < word.length; i++) {
    if (word[i] in charCount) {
      charCount[word[i]]++;
    } else {
      charCount[word[i]] = 1;
    }
  }
  return charCount;
}

/**
 * handleKeyup() : Event handler for key-up event to check the character
 * entered by the user and take appropriate action based on the type of
 * character that has been entered.
 *
 * Only English alphabets, Backspace key, and Enter key are supported.
 *
 * @param {Event} event
 */
function handleKeyup(event) {
  if ((/^[a-zA-Z]$/.test(event.key) || allowedKeys.includes(event.code)) && activeRow <= 6) {
    switch (event.code) {
      case 'Backspace':
        if (activeColumn > 1) {
          --activeColumn;
          document.getElementById(`r${activeRow}c${activeColumn}-front`).innerText = '';
          document.getElementById(`r${activeRow}c${activeColumn}-back`).innerText = '';
        }
        break;
      case 'Enter':
        if (activeColumn === 6) {
          validateEnteredWord();
        }
        break;
      default:
        if (activeColumn < 6) {
          document.getElementById(`r${activeRow}c${activeColumn}-front`).innerText = event.key;
          document.getElementById(`r${activeRow}c${activeColumn}-back`).innerText = event.key;
          activeColumn++;
        }
    }
  }
}

/**
 * showMessage() : Utility function to show any toast message
 *
 * @param {string} message
 */
function showMessage(message) {
  messageEl.innerText = message;
  messageEl.classList.remove('hidden');
  setTimeout(function () {
    messageEl.classList.add('hidden');
  }, 3000);
}

/**
 * markCharPositions() : Function is responsible for checking each character
 * tile and marking whether the tile is green, yellow, or grey based on the
 * character chosen in that position.
 *
 * This function also adds the 'flip' class which provides the tile-flip
 * animation.
 *
 */
function markCharPositions() {
  for (let i = 1; i < 6; i++) {
    document.getElementById(`r${activeRow}c${i}-front`).classList.add('flip');
    document.getElementById(`r${activeRow}c${i}-back`).classList.add('flip');
  }
  activeRow++;
  activeColumn = 1;
}

/**
 * validateEnteredWord() : This function is responsible for checking the entered
 * word-guess to verify if it is a valid word, and then invoke appropriate follow-up
 * action -- either to show a message for invalid words, or to mark the char positions
 * for valid words.
 */
function validateEnteredWord() {
  let word = '';
  for (let i = 1; i < 6; i++) {
    word = `${word}${document.getElementById(`r${activeRow}c${i}-front`).innerText}`;
  }

  startSpinner();
  fetch('https://words.dev-apis.com/validate-word', {
    method: 'POST',
    body: JSON.stringify({ word }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        return Promise.reject(response.statusText);
      } else {
        return response.json();
      }
    })
    .then(value => {
      stopSpinner();
      if (value.validWord) {
        markCharPositions();
      } else {
        showMessage('Not a valid word!');
      }
    })
    .catch(error => {
      stopSpinner();
      showMessage('There was an error!');
      console.error(error);
    });
}

/**
 * startSpinner() : Displays the spinner animation
 */
function startSpinner() {
  spinnerEl.classList.add('spinning');
}

/**
 * stopSpinner() : Hides the spinner animation
 */
function stopSpinner() {
  spinnerEl.classList.remove('spinning');
}

initialize();
