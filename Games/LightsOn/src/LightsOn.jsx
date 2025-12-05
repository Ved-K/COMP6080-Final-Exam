import { useEffect, useState } from "react";
import './LightsOn.css';

const SIZE = 5;           // 5x5 grid
const OFF = 0;
const ON = 1;

function generateRandomBoard() {
  let board;
  do {
    board = Array.from({ length: SIZE * SIZE }, () =>
      Math.random() < 0.5 ? OFF : ON
			// could also do Math.round(Math.random()) which gives 1 or 0
    );
  } while (isSolved(board)); // must not start solved
  return board;
}

// Check if all lights are OFF (win condition)
function isSolved(board) {
  return board.every((cell) => cell === OFF);
}

// Toggle a single cell in-place on a copy of the board
function toggleCell(board, index) {
  board[index] = board[index] === OFF ? ON : OFF;
}


function LightsOn() {
	const [board, setBoard] = useState(() => generateRandomBoard());
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const setupNewGame = () => {
    setBoard(generateRandomBoard());
    setMoves(0);
    setWon(false);
  };

  useEffect(() => {
    // to re-init or setup when first loading
    setupNewGame();
  }, []);

  const handleCellClick = (index) => {
    if (won) return;

    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];

      const row = Math.floor(index / SIZE);
      const col = index % SIZE;

      // Helper to toggle by row/col safely
      const toggleByRowCol = (r, c) => {
				//  ignore if row or column is ourtside the bounds (less than 0 or more than length)
        if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return;
				// 2D to 1D flattening
        const idx = r * SIZE + c;
        toggleCell(newBoard, idx);
      };

      // Toggle clicked cell
      toggleByRowCol(row, col);
      // Toggle neighbours
      toggleByRowCol(row - 1, col); // up
      toggleByRowCol(row + 1, col); // down
      toggleByRowCol(row, col - 1); // left
      toggleByRowCol(row, col + 1); // right

      // After updating board, check for win
      if (isSolved(newBoard)) {
        setWon(true);
        // optional: alert("You win!");
      }

      return newBoard;
    });

    // Correct way to update moves based on previous state
    setMoves((m) => m + 1);
  };

  return (
    <div className="lights-on">
      <h1>Lights On</h1>

      <div className="controls">
        <button onClick={setupNewGame}>New Game</button>
        <span>Moves: {moves}</span>
      </div>

      <div className="board">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`cell ${cell === ON ? "cell-on" : "cell-off"}`}
            onClick={() => handleCellClick(index)}
          >
          </button>
        ))}
      </div>

      {won && <p className="win-message">You turned off all the lights! 🎉</p>}
    </div>
	)
}

export default LightsOn;