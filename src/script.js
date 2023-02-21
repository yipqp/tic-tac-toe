const Player = (symbol) => {
  const getSymbol = () => symbol;
  return { getSymbol };
};

const Gameboard = (function () {
  const board = [];
  const player1 = Player("x");
  const player2 = Player("o");
  let currentPlayer = player1;

  const resetBoard = () => {
    for (let row = 0; row < 3; row++) {
      board[row] = [];
      for (let col = 0; col < 3; col++) {
        board[row][col] = 0;
      }
    }
  };
  resetBoard();

  const getBoard = () => board;

  const symbolToPlayer = (symbol) => {
    let winner;
    if (symbol === Gameboard.getPlayer1().getSymbol()) {
      winner = Gameboard.getPlayer1();
    } else if (symbol === Gameboard.getPlayer2().getSymbol()) {
      winner = Gameboard.getPlayer2();
    } else {
      winner = undefined;
    }
    return winner;
  };

  const checkWin = () => {
    // row win
    for (let row = 0; row < 3; row++) {
      const winningSymbol = board[row][0];
      let tempSymbol = winningSymbol;
      for (let col = 1; col < 3; col++) {
        if (board[row][col] !== winningSymbol) {
          tempSymbol = board[row][col];
          break;
        }
      }
      if (tempSymbol === winningSymbol) return symbolToPlayer(winningSymbol);
    }

    // col win
    for (let col = 0; col < 3; col++) {
      const winningSymbol = board[0][col];
      let tempSymbol = winningSymbol;
      for (let row = 1; row < 3; row++) {
        if (board[row][col] !== winningSymbol) {
          tempSymbol = board[row][col];
          break;
        }
      }
      if (tempSymbol === winningSymbol) return symbolToPlayer(winningSymbol);
    }
    // diag top left - bottom right win
    for (let i = 0; i < 1; i++) {
      const winningSymbol = board[0][0];
      let tempSymbol = winningSymbol;
      for (let j = 1; j < 3; j++) {
        if (board[j][j] !== winningSymbol) {
          tempSymbol = board[j][j];
          break;
        }
      }
      if (tempSymbol === winningSymbol) return symbolToPlayer(winningSymbol);
    }
    // diag top right - bottom left win
    for (let i = 0; i < 1; i++) {
      const winningSymbol = board[0][2];
      let tempSymbol = winningSymbol;
      for (let j = 1; j >= 0; j--) {
        if (board[2 - j][j] !== winningSymbol) {
          tempSymbol = board[2 - j][j];
          break;
        }
      }
      if (tempSymbol === winningSymbol) return symbolToPlayer(winningSymbol);
    }
    return false;
  };

  const checkDraw = () => {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] === 0) return false;
      }
    }
    return true;
  };

  const makeMove = (symbol, row, col) => {
    if (board[row][col] !== 0) return false;
    board[row][col] = symbol;
    return true;
  };

  const getTurn = () => currentPlayer.getSymbol();

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const getPlayer1 = () => player1;
  const getPlayer2 = () => player2;

  return {
    getBoard,
    checkWin,
    checkDraw,
    makeMove,
    getTurn,
    switchTurn,
    getPlayer1,
    getPlayer2,
    resetBoard,
  };
})();

const DisplayController = (function () {
  const updateDisplay = () => {
    const board = Gameboard.getBoard();
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const boardSquare = document.querySelector(
          `[data-row="${r}"][data-col="${c}"]`
        );

        boardSquare.textContent = board[r][c] !== 0 ? board[r][c] : " ";
      }
    }
  };

  const squares = document.querySelectorAll(".gameboard-square");
  squares.forEach((square) => {
    square.addEventListener("click", (e) => {
      const {
        dataset: { row, col },
      } = e.target;

      if (!Gameboard.makeMove(Gameboard.getTurn(), row, col)) return;

      updateDisplay();

      const winner = Gameboard.checkWin();

      if (winner) {
        // do something
        console.log(`${winner.getSymbol()} won!`);
        Gameboard.resetBoard();
        updateDisplay();
      } else if (Gameboard.checkDraw()) {
        console.log(`No one won.`);
        Gameboard.resetBoard();
        updateDisplay();
      }

      Gameboard.switchTurn();
    });
  });

  return { updateDisplay };
})();
