const Gameboard = (function () {
  let board = [];

  for (let row = 0; row < 3; row++) {
    board[row] = [];
    for (let col = 0; col < 3; col++) {
      board[row][col] = 0;
    }
  }

  const getBoard = () => board;

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
      if (tempSymbol === winningSymbol) return winningSymbol;
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
      if (tempSymbol === winningSymbol) return winningSymbol;
    }
    // diag left-right win
    for (let i = 0; i < 1; i++) {
      const winningSymbol = board[0][0];
      let tempSymbol = winningSymbol;
      for (let j = 1; j < 3; j++) {
        if (board[j][j] !== winningSymbol) {
          tempSymbol = board[j][j];
          break;
        }
      }
      if (tempSymbol === winningSymbol) return winningSymbol;
    }
    // diag right-left win
    for (let i = 0; i < 1; i++) {
      const winningSymbol = board[2][0];
      let tempSymbol = winningSymbol;
      for (let j = 1; j >= 0; j--) {
        if (board[2 - j][j] !== winningSymbol) {
          tempSymbol = board[2 - j][j];
          break;
        }
      }
      if (tempSymbol === winningSymbol) return winningSymbol;
    }
    return false;
  };

  return { getBoard, checkWin };
})();
