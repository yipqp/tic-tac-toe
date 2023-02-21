const Player = (symbol, name) => {
  const getSymbol = () => symbol;
  const getName = () => name;
  return { getSymbol, getName };
};

const Gameboard = (function () {
  const board = [];
  const player1 = Player("x", "Player 1");
  const player2 = Player("o", "Player 2");
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
      if (tempSymbol === winningSymbol && winningSymbol !== 0)
        return symbolToPlayer(winningSymbol);
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
      if (tempSymbol === winningSymbol && winningSymbol !== 0)
        return symbolToPlayer(winningSymbol);
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
      if (tempSymbol === winningSymbol && winningSymbol !== 0)
        return symbolToPlayer(winningSymbol);
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
      if (tempSymbol === winningSymbol && winningSymbol !== 0)
        return symbolToPlayer(winningSymbol);
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

  const getCurrentPlayer = () => currentPlayer;

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
    getCurrentPlayer,
    switchTurn,
    getPlayer1,
    getPlayer2,
    resetBoard,
  };
})();

const DisplayController = (function () {
  const blurContainer = document.querySelector(".blur-container");
  const endBanner = document.querySelector(".end-banner");
  const endMessage = document.querySelector(".end-message");
  const restartButton = document.querySelector(".restart-button");
  const startScreen = document.querySelector(".start-screen");
  const playButton = document.querySelector(".play-button");
  const startScreenButton = document.querySelector(".start-screen-button");
  const gameboard = document.querySelector(".gameboard");

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

  const showEndBanner = () => {
    blurContainer.style.display = "block";
    endBanner.style.display = "flex";
  };

  const hideEndBanner = () => {
    blurContainer.style.display = "none";
    endBanner.style.display = "none";
  };

  const toggleStartScreen = () => {
    startScreen.classList.toggle("hide");
  };

  const toggleGameboard = () => {
    gameboard.classList.toggle("no-display");
  };

  const squares = document.querySelectorAll(".gameboard-square");
  squares.forEach((square) => {
    square.addEventListener("click", (e) => {
      const {
        dataset: { row, col },
      } = e.target;

      if (
        !Gameboard.makeMove(Gameboard.getCurrentPlayer().getSymbol(), row, col)
      ) {
        return;
      }

      updateDisplay();

      const winner = Gameboard.checkWin();

      if (winner) {
        endMessage.textContent = `${winner.getName()} won!`;
        showEndBanner();
      } else if (Gameboard.checkDraw()) {
        endMessage.textContent = `No one won`;
        showEndBanner();
      }

      Gameboard.switchTurn();
    });
  });

  restartButton.addEventListener("click", () => {
    Gameboard.resetBoard();
    updateDisplay();
    hideEndBanner();
  });

  playButton.addEventListener("click", () => {
    toggleStartScreen();
    toggleGameboard();
  });

  startScreenButton.addEventListener("click", () => {
    Gameboard.resetBoard();
    updateDisplay();
    hideEndBanner();
    toggleGameboard();
    toggleStartScreen();
  });

  return { updateDisplay };
})();
