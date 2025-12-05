import { useState } from "react";
import "./Minesweeper.css";

const ROWS = 9;
const COLS = 9;
const MINES = 10;

/**
 * Create a fresh, empty board.
 * Each cell is an object with:
 *  - hasMine: whether there's a bomb
 *  - revealed: whether it's been clicked
 *  - flagged: whether the user has flagged it
 *  - adjacent: number of neighboring mines (0–8)
 */
function createEmptyBoard() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      hasMine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  );
}

/**
 * Check if row/col is inside the 9x9 board.
 */
function inBounds(r, c) {
  return r >= 0 && r < ROWS && c >= 0 && c < COLS;
}

/**
 * Return all valid neighbor coordinates around (r, c)
 * including diagonals (up to 8 neighbors).
 */
function getNeighbors(r, c) {
  const neighbors = [];
  // dr = delta row, dc = delta col
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      // skip the cell itself
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (inBounds(nr, nc)) neighbors.push([nr, nc]);
    }
  }
  return neighbors;
}

/**
 * Randomly place MINES mines on the board.
 * We loop until we've placed all 10 mines in unique positions.
 */
function placeMines(board) {
  let minesPlaced = 0;
  while (minesPlaced < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    // Only place a mine if the cell doesn't already have one
    if (!board[r][c].hasMine) {
      board[r][c].hasMine = true;
      minesPlaced++;
    }
  }
}

/**
 * For each cell, count how many neighboring cells contain a mine.
 * Store the count in cell.adjacent.
 */
function calculateAdjacents(board) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      // Mines don't need adjacent counts (we can set them to 0 or ignore)
      if (board[r][c].hasMine) {
        board[r][c].adjacent = 0;
        continue;
      }
      const neighbors = getNeighbors(r, c);
      let count = 0;
      for (const [nr, nc] of neighbors) {
        if (board[nr][nc].hasMine) count++;
      }
      board[r][c].adjacent = count;
    }
  }
}

/**
 * Create a fully-initialised board:
 * 1. Empty board
 * 2. Place mines
 * 3. Compute adjacent mine counts
 */
function createNewBoard() {
  const board = createEmptyBoard();
  placeMines(board);
  calculateAdjacents(board);
  return board;
}

/**
 * Reveal an area of the board starting from (startR, startC).
 * If the tile has 0 adjacent mines, we also reveal its neighbors
 * (and repeat) — this is the classic “flood fill” behavior.
 *
 * We use an explicit stack instead of recursion to avoid deep call stacks.
 */
function floodReveal(board, startR, startC) {
  const stack = [[startR, startC]];

  while (stack.length > 0) {
    const [r, c] = stack.pop();
    const cell = board[r][c];

    // Skip if we've already revealed or flagged this cell
    if (cell.revealed || cell.flagged) continue;

    // Reveal the current cell
    cell.revealed = true;

    // If this cell has no adjacent mines (adjacent === 0),
    // we want to also reveal all its neighbors (that are safe).
    if (cell.adjacent === 0 && !cell.hasMine) {
      const neighbors = getNeighbors(r, c);
      for (const [nr, nc] of neighbors) {
        const neighbor = board[nr][nc];
        // Only push neighbors that are not revealed/flagged and not mines
        if (!neighbor.revealed && !neighbor.flagged && !neighbor.hasMine) {
          stack.push([nr, nc]);
        }
      }
    }
  }
}

function MiniMinesweeper() {
  // Board is a 2D array of cell objects
  const [board, setBoard] = useState(() => createNewBoard());
  // gameOver: true when you hit a mine or win
  const [gameOver, setGameOver] = useState(false);
  // won: true only if all safe cells are revealed
  const [won, setWon] = useState(false);
  // flagMode: when true, left-click places/removes flags instead of revealing
  const [flagMode, setFlagMode] = useState(false);

  /**
   * Reset everything and start a new game.
   */
  const handleNewGame = () => {
    setBoard(createNewBoard());
    setGameOver(false);
    setWon(false);
    setFlagMode(false);
  };

  /**
   * Win condition:
   * Return true if every non-mine cell has been revealed.
   */
  const checkWinCondition = (boardToCheck) => {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = boardToCheck[r][c];
        // If there's a safe (non-mine) cell that is still hidden,
        // the game is not won yet.
        if (!cell.hasMine && !cell.revealed) {
          return false;
        }
      }
    }
    return true;
  };

  /**
   * Reveal all mines on the board.
   * Called after the player hits a mine so they can see where all were.
   */
  const revealAllMines = (boardToReveal) => {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = boardToReveal[r][c];
        if (cell.hasMine) cell.revealed = true;
      }
    }
  };

  /**
   * Handle left-click reveal (unless in flagMode, see below).
   * - If clicking a mine: game over + reveal all mines
   * - If clicking a 0-adjacent cell: flood fill reveal
   * - Else: just reveal this one cell
   * Then check if the win condition is satisfied.
   */
  const handleCellReveal = (row, col) => {
    if (gameOver || won) return;

    // Deep-ish clone the board so we don't mutate state directly
    const newBoard = board.map((rowArr) =>
      rowArr.map((cell) => ({ ...cell }))
    );

    const cell = newBoard[row][col];

    // Ignore if already revealed or flagged
    if (cell.revealed || cell.flagged) return;

    // If it's a mine: lose immediately
    if (cell.hasMine) {
      cell.revealed = true;
      revealAllMines(newBoard);
      setBoard(newBoard);
      setGameOver(true);
      setWon(false);
      return;
    }

    // If no adjacent mines, do flood fill reveal (open a whole area)
    if (cell.adjacent === 0) {
      floodReveal(newBoard, row, col);
    } else {
      // Otherwise just reveal this one cell
      cell.revealed = true;
    }

    // Check if this move caused us to win
    const didWin = checkWinCondition(newBoard);
    setBoard(newBoard);
    if (didWin) {
      setWon(true);
      setGameOver(true);
    }
  };

  /**
   * Toggle a flag on a cell.
   * - Only allowed if the cell is not already revealed.
   */
  const handleCellFlag = (row, col) => {
    if (gameOver || won) return;

    const newBoard = board.map((rowArr) =>
      rowArr.map((cell) => ({ ...cell }))
    );
    const cell = newBoard[row][col];

    // Can't flag something that's already revealed
    if (cell.revealed) return;

    // Toggle flag
    cell.flagged = !cell.flagged;
    setBoard(newBoard);
  };

  /**
   * Left-click handler:
   * - If flag mode is ON → treat left-click as a flag toggle
   * - Else → treat it as a reveal attempt
   */
  const handleCellClick = (row, col) => {
    if (flagMode) {
      handleCellFlag(row, col);
    } else {
      handleCellReveal(row, col);
    }
  };

  /**
   * Right-click handler (context menu):
   * Prevent the browser default menu and toggle flag.
   */
  const handleCellRightClick = (e, row, col) => {
    e.preventDefault();
    handleCellFlag(row, col);
  };

  /**
   * Rough count of mines "left":
   * We subtract the number of flagged cells from total mines.
   * (This isn't perfect info in real Minesweeper, but good enough here.)
   */
  const minesLeft =
    MINES -
    board.reduce(
      (sum, row) =>
        sum + row.filter((cell) => cell.flagged).length,
      0
    );

  // Display status text based on game state
  let statusText = "";
  if (won) statusText = "You win! 🎉 All safe cells revealed.";
  else if (gameOver) statusText = "Boom! 💥 You hit a mine.";
  else statusText = "Keep going...";

  return (
    <div className="minesweeper">
      <h1>Mini Minesweeper (9x9)</h1>

      <div className="ms-top-bar">
        {/* Reset button */}
        <button onClick={handleNewGame}>New Game</button>

        {/* Toggle between Reveal mode and Flag mode for left-click */}
        <button
          onClick={() => setFlagMode((f) => !f)}
          className={flagMode ? "flag-mode-on" : ""}
        >
          Mode: {flagMode ? "🚩 Flag" : "🔍 Reveal"}
        </button>

        {/* Approximate remaining mines counter */}
        <div>Mines left (approx): {minesLeft}</div>
      </div>

      <div className="ms-status">{statusText}</div>

      {/* Render the grid */}
      <div className="ms-board">
        {board.map((rowArr, r) => (
          <div key={r} className="ms-row">
            {rowArr.map((cell, c) => {
              let content = "";

              // What to display inside the cell
              if (cell.revealed) {
                if (cell.hasMine) content = "💣";
                else if (cell.adjacent > 0) content = cell.adjacent;
              } else if (cell.flagged) {
                content = "🚩";
              }

              // CSS classes for styling
              const classNames = ["ms-cell"];
              if (cell.revealed) classNames.push("revealed");
              if (cell.hasMine && gameOver) classNames.push("mine");

              return (
                <button
                  key={c}
                  className={classNames.join(" ")}
                  onClick={() => handleCellClick(r, c)}
                  onContextMenu={(e) => handleCellRightClick(e, r, c)}
                >
                  {content}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MiniMinesweeper;
