let activeRow = 1;
let activeColumn = 1;

const allowedKeys = ['Backspace', 'Enter'];

const messageEl = document.getElementById('message-content');

function handleKeyup(event) {
  if (!/^[a-zA-Z]$/.test(event.key) && !allowedKeys.includes(event.code)) {
    event.preventDefault();
  } else {
    switch (event.code) {
      case 'Backspace':
        if (activeColumn > 0) {
          document.getElementById(`r${activeRow}c${--activeColumn}`).innerText = '';
        }
        break;
      case 'Enter':
        if (activeColumn === 6) {
          validateEnteredWord();
        }
        break;
      default:
        if (activeColumn < 6) {
          document.getElementById(`r${activeRow}c${activeColumn++}`).innerText = event.key.toUpperCase();
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

function validateEnteredWord() {
  let word = '';
  for (let i = 1; i < 6; i++) {
    word = `${word}${document.getElementById(`r${activeRow}c${i}`).innerText}`;
  }
}

document.addEventListener('keyup', handleKeyup);
