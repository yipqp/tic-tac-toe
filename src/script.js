const Player = (symbol, name) => {
  const getSymbol = () => symbol;
  const getName = () => name;

  const makeRandomMove = () => {
    const availableMoves = Gameboard.getAvailableSquares();

    if (availableMoves.length === 0) return false;

    const randomSquare =
      availableMoves[Math.floor(Math.random() * availableMoves.length)];

    Gameboard.makeMove(symbol, randomSquare.r, randomSquare.c);
  };

  const makeBestMove = () => {
    let bestMove = {};
    let bestScore = -100;

    const availableSquares = Gameboard.getAvailableSquares();

    availableSquares.forEach((moveset) => {
      Gameboard.makeMove(symbol, moveset.r, moveset.c);
      let score = Gameboard.minimax(0, false);
      Gameboard.undoMove(moveset.r, moveset.c);
      if (score > bestScore) {
        bestScore = score;
        bestMove = { r: moveset.r, c: moveset.c };
      }
    });
    Gameboard.makeMove(symbol, bestMove.r, bestMove.c);
  };

  return { getSymbol, getName, makeRandomMove, makeBestMove };
};

const Gameboard = (function () {
  const board = [];
  const player1 = Player("x", "Player 1");
  const player2 = Player("o", "Player 2");
  let currentPlayer = player1;
  let difficulty;

  const setDifficulty = (newDifficulty) => {
    difficulty = newDifficulty;
  };

  const getDifficulty = () => difficulty;

  const resetBoard = () => {
    for (let r = 0; r < 3; r++) {
      board[r] = [];
      for (let c = 0; c < 3; c++) {
        board[r][c] = 0;
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

  const getWinner = () => {
    // row win
    for (let r = 0; r < 3; r++) {
      const winningSymbol = board[r][0];
      let tempSymbol = winningSymbol;
      for (let c = 1; c < 3; c++) {
        if (board[r][c] !== winningSymbol) {
          tempSymbol = board[r][c];
          break;
        }
      }
      if (tempSymbol === winningSymbol && winningSymbol !== 0)
        return symbolToPlayer(winningSymbol);
    }

    // col win
    for (let c = 0; c < 3; c++) {
      const winningSymbol = board[0][c];
      let tempSymbol = winningSymbol;
      for (let r = 1; r < 3; r++) {
        if (board[r][c] !== winningSymbol) {
          tempSymbol = board[r][c];
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
    if (board[row][col] !== 0 || row === undefined || col === undefined) {
      return false;
    } else {
      board[row][col] = symbol;
      return true;
    }
  };

  const undoMove = (row, col) => {
    board[row][col] = 0;
  };

  const getCurrentPlayer = () => currentPlayer;

  const setCurrentPlayer = (newPlayer) => {
    currentPlayer = newPlayer;
  };

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const getPlayer1 = () => player1;

  const getPlayer2 = () => player2;

  const getAvailableSquares = () => {
    const arrayOfSquares = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] === 0) {
          arrayOfSquares.push({ r, c });
        }
      }
    }
    return arrayOfSquares;
  };

  const minimax = (depth, isMaximizing) => {
    let winner = getWinner();

    if (winner === getPlayer1()) {
      return -100 + depth;
    } else if (winner === getPlayer2()) {
      return 100 - depth;
    } else if (checkDraw()) {
      return 0;
    }

    if (isMaximizing) {
      const availableSquares = getAvailableSquares();
      let bestScore = -100;

      availableSquares.forEach((moveset) => {
        makeMove("o", moveset.r, moveset.c);
        let score = minimax(depth + 1, false);
        undoMove(moveset.r, moveset.c);
        bestScore = Math.max(bestScore, score);
      });

      return bestScore;
    } else {
      const availableSquares = getAvailableSquares();
      let bestScore = 100;

      availableSquares.forEach((moveset) => {
        makeMove("x", moveset.r, moveset.c);
        let score = minimax(depth + 1, true);
        undoMove(moveset.r, moveset.c);
        bestScore = Math.min(bestScore, score);
      });

      return bestScore;
    }
  };

  return {
    getBoard,
    getWinner,
    checkDraw,
    makeMove,
    undoMove,
    getCurrentPlayer,
    setCurrentPlayer,
    switchTurn,
    getPlayer1,
    getPlayer2,
    resetBoard,
    setDifficulty,
    getDifficulty,
    getAvailableSquares,
    minimax,
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
  const leftArrow = document.querySelector(".left");
  const rightArrow = document.querySelector(".right");
  const arrows = document.querySelectorAll(".arrow");

  let difficulty = "easy";
  Gameboard.setDifficulty(difficulty);

  let slideIndex = 1;

  const updateDisplay = () => {
    const board = Gameboard.getBoard();

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const boardSquare = document.querySelector(
          `[data-row="${r}"][data-col="${c}"]`
        );
        // if inner board array element is 0, just use an empty space in the DOM
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

  const displayEnding = () => {
    const winner = Gameboard.getWinner();
    if (!winner && !Gameboard.checkDraw()) return false;
    let message = winner ? `${winner.getName()} won!` : `No one won`;
    endMessage.textContent = message;
    showEndBanner();
    return true;
  };

  const gameEvent = (e) => {
    const {
      dataset: { row, col },
    } = e.target;

    // play self
    if (Gameboard.getDifficulty() === "player") {
      // don't switch turn if filled square is clicked
      if (
        !Gameboard.makeMove(Gameboard.getCurrentPlayer().getSymbol(), row, col)
      ) {
        return;
      }
    }

    // play AI
    if (Gameboard.getDifficulty() !== "player") {
      // do not click if not user's turn
      if (
        Gameboard.getCurrentPlayer() !== Gameboard.getPlayer1() ||
        !Gameboard.makeMove(Gameboard.getCurrentPlayer().getSymbol(), row, col)
      ) {
        return;
      } else {
        // do not allow computer move if player made winning move
        if (displayEnding()) {
          updateDisplay();
          return;
        }
        Gameboard.switchTurn();
      }
      // AI turn
      if (Gameboard.getCurrentPlayer() === Gameboard.getPlayer2()) {
        // easy: make random move
        if (Gameboard.getDifficulty() === "easy") {
          Gameboard.getPlayer2().makeRandomMove();
        }
        // hard: use minmax algorithm
        if (Gameboard.getDifficulty() === "hard") {
          Gameboard.getPlayer2().makeBestMove();
        }
      }
    }

    updateDisplay();
    displayEnding();

    Gameboard.switchTurn();
  };

  const squares = document.querySelectorAll(".gameboard-square");

  squares.forEach((square) => {
    square.addEventListener("click", gameEvent);
  });

  restartButton.addEventListener("click", () => {
    Gameboard.resetBoard();
    updateDisplay();
    hideEndBanner();
  });

  playButton.addEventListener("click", () => {
    Gameboard.setCurrentPlayer(Gameboard.getPlayer1());
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

  leftArrow.addEventListener("click", () => {
    slideIndex -= 1;
    if (slideIndex < 1) slideIndex = 3;
  });

  rightArrow.addEventListener("click", () => {
    slideIndex += 1;
    if (slideIndex > 3) slideIndex = 1;
  });

  arrows.forEach((arrow) => {
    arrow.addEventListener("click", () => {
      const active = document.querySelector(".active");
      active.classList.toggle("active");

      const nextActive = document.querySelector(
        `.slides div:nth-child(${slideIndex})`
      );
      nextActive.classList.toggle("active");

      difficulty = nextActive.dataset.difficulty;
      Gameboard.setDifficulty(difficulty);
    });
  });

  return { updateDisplay };
})();
