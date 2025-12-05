import { useEffect, useRef, useState } from "react";
import { incrementGamesWon } from "../utils/gameCounter";
import './Slido.css';

import shrek0 from "../assets/1.png";
import shrek1 from "../assets/2.png";
import shrek2 from "../assets/3.png";
import shrek3 from "../assets/4.png";
import shrek4 from "../assets/5.png";
import shrek5 from "../assets/6.png";
import shrek6 from "../assets/7.png";
import shrek7 from "../assets/8.png";

const TILES = [shrek0, shrek1, shrek2, shrek3, shrek4, shrek5, shrek6, shrek7];
const SOLVED_BOARD = [0, 1, 2, 3, 4, 5, 6, 7, null];

function Slido() {
	// board[i] is either a tile index (0–7) or null for blank
  const [board, setBoard] = useState(SOLVED_BOARD);
	// For where the blank tile is (index of blank tile)
  const [blankIndex, setBlankIndex] = useState(8);
  const [hasMoved, setHasMoved] = useState(false); // used for Reset disabled state
  const [isSolved, setIsSolved] = useState(false); // used for Solve disabled, block moves

  // For keyboard controls – we focus this container when clicked
  const containerRef = useRef(null);
	
	// Helper function which checks two arrays contain exactly the same values,
	// in same order (checking current and solved board arrays)
  const arraysEqual = (a, b) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

  /**
   * Start a new random game:
   *  - Randomly place 8 tiles and 1 blank
   *  - Ensure it's not already in the solved arrangement
   *  - Reset move/solved flags
   */
  const setupNewGame = () => {
    let newBoard;
    let newBlankIndex; //Blank tile index

		// do x ... repeat while condition, only does once then checks while condition
		// if while is true it does do again.
    do {
      // Fisher–Yates shuffle of tile indices 0–7
			// Starts at end of array, picks random index from beginning to current
			// Swaps the values and moves left and repeats till at the start of array
      const tiles = [0, 1, 2, 3, 4, 5, 6, 7];
      for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
      }

      newBlankIndex = Math.floor(Math.random() * 9);
      newBoard = Array(9).fill(null);
      let tileIdx = 0;

      for (let i = 0; i < 9; i++) {
        if (i === newBlankIndex) continue;
        newBoard[i] = tiles[tileIdx++];
      }
    } while (arraysEqual(newBoard, SOLVED_BOARD)); // must not start solved

    setBoard(newBoard);
    setBlankIndex(newBlankIndex);
    setHasMoved(false);
    setIsSolved(false);
  };

  // Game starts automatically when the screen mounts
  useEffect(() => {
    setupNewGame();
  }, []);

  /**
   * Swap a clicked/target tile with the blank, if adjacent.
   * Used by both mouse clicks and arrow key moves.
   */
  const attemptMove = (targetIndex) => {
    if (isSolved) return;
    if (targetIndex == null || targetIndex < 0 || targetIndex > 8) return;

		//  converting index to row and column (e.g. 5 -> 8/3=2.66 => 3, 8%3=2 so tile 8 is [3,2]) 
    const blankRow = Math.floor(blankIndex / 3);
    const blankCol = blankIndex % 3;
    const targetRow = Math.floor(targetIndex / 3);
    const targetCol = targetIndex % 3;

    const manhattanDistance =
      Math.abs(blankRow - targetRow) + Math.abs(blankCol - targetCol);

    // Must be immediately adjacent (up/down/left/right) if dist = 1 its adjacent
    if (manhattanDistance !== 1) return;

		// switching blank tile with target tile (target becomes null for blank)
    const newBoard = [...board];
    newBoard[blankIndex] = newBoard[targetIndex];
    newBoard[targetIndex] = null;

    setBoard(newBoard);
    setBlankIndex(targetIndex);
    setHasMoved(true);

    // Check for solved only after a move (click or arrow)
    if (arraysEqual(newBoard, SOLVED_BOARD)) {
      setIsSolved(true);
      incrementGamesWon();
      alert("Correct!");
      setupNewGame();
    }
  };

  const handleCellClick = (index) => {
    attemptMove(index);
  };

  /**
   * Keyboard controls:
   * When the grid is "active" (this container has focus),
   * Arrow keys move the tile adjacent to the blank, per spec:
   *  - ArrowDown moves the tile above the blank down, etc.
   */
  const handleKeyDown = (e) => {
    if (isSolved) return;

    const row = Math.floor(blankIndex / 3);
    const col = blankIndex % 3;

    if (e.key === "ArrowUp") {
      // Move tile below blank up
      e.preventDefault();
      if (row < 2) attemptMove(blankIndex + 3);
    } else if (e.key === "ArrowDown") {
      // Move tile above blank down
      e.preventDefault();
      if (row > 0) attemptMove(blankIndex - 3);
    } else if (e.key === "ArrowLeft") {
      // Move tile to the right of blank left
      e.preventDefault();
      if (col < 2) attemptMove(blankIndex + 1);
    } else if (e.key === "ArrowRight") {
      // Move tile to the left of blank right
      e.preventDefault();
      if (col > 0) attemptMove(blankIndex - 1);
    }
  };

  // Clicking the grid focuses it so arrow keys work ("active" state)
  const handleGridClick = () => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  const handleSolve = () => {
    // Jump straight to solved state; no alert / increment per spec
    setBoard(SOLVED_BOARD);
    setBlankIndex(8);
    setIsSolved(true);
    setHasMoved(true); // allow Reset while in win state
  };

  const handleReset = () => {
    setupNewGame();
  };

  // Reset disabled until at least one move has been made
  const resetDisabled = !hasMoved;
  // Solve disabled in win state
  const solveDisabled = isSolved;

  return (
    <div
      className="slido-container"
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="slido-grid" onClick={handleGridClick}>
        {board.map((tileIndex, idx) => (
          <div
            key={idx}
            className="slido-cell"
            onClick={() => handleCellClick(idx)}
          >
            {tileIndex !== null && (
              <img
                src={TILES[tileIndex]}
                alt={`Shrek piece ${tileIndex + 1}`}
                className="slido-image"
              />
            )}
          </div>
        ))}
      </div>

      <div className="slido-controls">
        <button
          className="slido-button"
          onClick={handleSolve}
          disabled={solveDisabled}
        >
          Solve
        </button>
        <button
          className="reset-button"
          onClick={handleReset}
          disabled={resetDisabled}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Slido;