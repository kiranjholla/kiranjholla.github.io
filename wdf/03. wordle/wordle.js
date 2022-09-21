let activeRow = 1;
let activeColumn = 1;

const allowedKeys = ['Backspace', 'Enter'];

const messageEl = document.getElementById('message-content');

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

function showMessage(message) {
  messageEl.innerText = message;
  messageEl.classList.remove('hidden');
  setTimeout(function () {
    messageEl.classList.add('hidden');
  }, 3000);
}

function markCharPositions() {
  for (let i = 1; i < 6; i++) {
    document.getElementById(`r${activeRow}c${i}-front`).classList.add('flip');
    document.getElementById(`r${activeRow}c${i}-back`).classList.add('flip');
  }
  activeRow++;
  activeColumn = 1;
}

function validateEnteredWord() {
  let word = '';
  for (let i = 1; i < 6; i++) {
    word = `${word}${document.getElementById(`r${activeRow}c${i}-front`).innerText}`;
  }

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
      if (value.validWord) {
        markCharPositions();
      } else {
        showMessage('Not a valid word!');
      }
    })
    .catch(error => {
      showMessage('There was an error!');
      console.error(error);
    });
}

document.addEventListener('keyup', handleKeyup);
