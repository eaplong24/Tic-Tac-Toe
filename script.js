document.addEventListener('DOMContentLoaded', function () {
    const section1 = document.getElementById('section1');
    const section2 = document.getElementById('section2');
    const section3 = document.getElementById('section3');
    const gameModeSelect = document.getElementById('game-mode');
    const player1NameInput = document.getElementById('player1-name');
    const player2Input = document.getElementById('player2-input');
    const player2NameInput = document.getElementById('player2-name');
    const raceModeSelect = document.getElementById('race-mode');
    const playBtn = document.getElementById('play-btn');
    const scoreboard = document.getElementById('scoreboard');
    const col1 = document.getElementById('col1');
    const col3 = document.getElementById('col3');
    const gameboard = document.getElementById('gameboard');
    const winnerText = document.getElementById('winner-text');
    const restartBtn = document.getElementById('restart-btn');
    const turnMessage = document.getElementById('turnMessage');

    let currentPlayer;
    let currentPlayerName;
    let player1Name;
    let player2Name;
    let player1GameScore = 0;
    let player2GameScore = 0;
    let raceToScore;
    let cells = [];

    playBtn.addEventListener('click', function () {
        const gameMode = gameModeSelect.value;
        player1Name = player1NameInput.value.trim();

        if (gameMode === 'bot') {
            if (player1Name === '') {
                alert('Please enter Player 1 name.');
                return;
            }

        currentPlayer = 'player1';
        currentPlayerName = player1Name;

        } else if (gameMode === 'multiplayer') {
            player2Name = player2NameInput.value.trim();

        if (player1Name === '' || player2Name === '') {
            alert('Please enter both Player 1 and Player 2 names.');
            return;
        }

        currentPlayer = 'player1';
        currentPlayerName = player1Name + ' vs ' + player2Name;
        }

        raceToScore = parseInt(raceModeSelect.value);

        section1.style.display = 'none';
        section2.style.display = 'block';

        if (gameMode === 'bot') {
            col1.textContent = `${player1Name}: ${player1GameScore}` ;
            col3.textContent = ` Bot: ${player2GameScore}`;
        } else if (gameMode === 'multiplayer') {
            col1.textContent = `${player1Name}: ${player1GameScore}`
            col3.textContent = `${player2Name}: ${player2GameScore}`;
        }

        createGameboard();
    });

    function createGameboard() {
        gameboard.innerHTML = '';
        cells = [];
      
        for (let i = 0; i < 9; i++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.addEventListener('click', handleCellClick); // Attach the event listener
          gameboard.appendChild(cell);
          cells.push(cell);
        }
      }

    function cellClicked(index) {
        const cell = cells[index];

        if (cell.textContent !== '') {
            return;
        }

        cell.textContent = currentPlayer === 'player1' ? 'X' : 'O';

        if (checkWin()) {
            tallyScore();
            clearGameboard();

            if (checkGameWin()) {
                declareGameWinner();
            }
            return;
        }

        if (checkDraw()) {
            clearGameboard();
            return;
        }

        currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
        currentPlayerName = currentPlayer === 'player1' ? player1Name : player2Name;

        if (gameModeSelect.value === 'bot' && currentPlayer === 'player2') {
            botMove();
        }
    }

    function checkWin() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (
                cells[a].textContent === cells[b].textContent &&
                cells[b].textContent === cells[c].textContent &&
                cells[a].textContent !== ''
            ) {
                return true;
            }
        }

        return false;
    }

    function checkDraw() {
        const isDraw = cells.every(cell => cell.textContent !== '');

        if (isDraw) {
            if (checkGameWin()) {
                declareGameWinner();
            } else {
                clearGameboard();
            }
            return true;
        }

        return false;
    }

  // function checkDraw() {
  //     const isDraw = cells.every(cell => cell.textContent !== '');

  //     if (isDraw) {
  //         declareDraw();
  //         return true;
  //     }

  //     return false;
  // }

    function declareGameWinner() {
        section2.style.display = 'none';
        section3.style.display = 'block';

        if (currentPlayer === 'player1') {
            winnerText.textContent = `${player1Name} wins the game!`;
        } else if (currentPlayer === 'player2') {
            winnerText.textContent = `${player2Name} wins the game!`;
        } else {
            winnerText.textContent = 'Bot wins the game!';
        }
    }

  // function declareDraw() {
  //     section2.style.display = 'none';
  //     section3.style.display = 'block';
  //     winnerText.textContent = 'It\'s a draw!';
  // }

    function restartGame() {
        section3.style.display = 'none';
        section1.style.display = 'block';

        player1NameInput.value = '';
        player2NameInput.value = '';

        currentPlayer = '';
        currentPlayerName = '';
        player1GameScore = 0;
        player2GameScore = 0;
        raceToScore = 0;

        updateScoreboard();
    }

    restartBtn.addEventListener('click', restartGame);

    function botMove() {
        const emptyCells = cells.filter(cell => cell.textContent === '');
        if (emptyCells.length === 0) {
            return;
        }

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        emptyCells[randomIndex].textContent = 'O';

        if (checkWin()) {
            tallyScore();
            clearGameboard();
            if (checkGameWin()) {
                declareGameWinner();
            }
            return;
        }

        if (checkDraw()) {
            if (checkGameWin()) {
                declareGameWinner();
            } else {
                clearGameboard();
            }
            return;
        }

      // if (checkDraw()) {
      //     clearGameboard();
      //     return;
      // }

        currentPlayer = 'player1';
        currentPlayerName = player1Name;
    }

    function updateScoreboard() {
        if (gameModeSelect.value === 'bot') {
            scoreboard.textContent = `${player1Name}: ${player1GameScore} vs Bot: ${player2GameScore}`;
        } else if (gameModeSelect.value === 'multiplayer') {
            scoreboard.textContent = `${player1Name}: ${player1GameScore} vs ${player2Name}: ${player2GameScore}`;
        }
    }

    function tallyScore() {
        if (currentPlayer === 'player1') {
            player1GameScore++;
        } else if (currentPlayer === 'player2') {
            player2GameScore++;
        }
        updateScoreboard();
    }

    function clearGameboard() {
        cells.forEach(cell => {
            cell.textContent = '';
        });
    }

    function checkGameWin() {
        if (player1GameScore === raceToScore || player2GameScore === raceToScore) {
            return true;
        }
        return false;
    }

    gameModeSelect.addEventListener('change', function () {
        if (gameModeSelect.value === 'multiplayer') {
            player2Input.style.display = 'block';
        } else {
            player2Input.style.display = 'none';
        }
    });

    function updateTurnMessage() {
        if (currentPlayer === 'player1') {
            turnMessage.textContent = `${player1Name}'s turn`;
        } else if (currentPlayer === 'player2') {
            turnMessage.textContent = `${player2Name}'s turn`;
        }
    }


    function switchPlayer() {
    currentPlayer = (currentPlayer === 'player1') ? 'player2' : 'player1';
    currentPlayerName = (currentPlayer === 'player1') ? player1Name : player2Name;
  updateTurnMessage(); // Call updateTurnMessage() after switching players
}

    
function handleCellClick(event) {
    const cell = event.target;

    if (cell.textContent !== '') {
        return;
    }

    cell.textContent = currentPlayer === 'player1' ? 'X' : 'O';

    if (checkWin()) {
        tallyScore();
        clearGameboard();

        if (checkGameWin()) {
        declareGameWinner();
    }
        return;
    }

    if (checkDraw()) {
        clearGameboard();
        return;
    }

    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
    currentPlayerName = currentPlayer === 'player1' ? player1Name : player2Name;

    if (gameModeSelect.value === 'bot' && currentPlayer === 'player2') {
        botMove();
    }

    updateTurnMessage(); // Update the turn message after each cell click
    }

  // Call updateTurnMessage() when the game starts
    updateTurnMessage();

});
