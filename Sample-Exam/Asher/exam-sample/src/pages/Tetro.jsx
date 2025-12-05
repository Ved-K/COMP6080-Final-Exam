import { useEffect, useRef, useState } from "react";
import { incrementGamesWon } from "../utils/gameCounter";
import './Tetro.css';

const ROWS = 12;
const COLS = 10;

// Shape definitions as offsets from the block's top-left cell
const SHAPES = [
  // 1x1 block
  [{ r: 0, c: 0 }],
  // 2 (high) x 1 (wide) vertical block
  [
    { r: 0, c: 0 },
    { r: 1, c: 0 },
  ],
  // 2x2 block
  [
    { r: 0, c: 0 },
    { r: 0, c: 1 },
    { r: 1, c: 0 },
    { r: 1, c: 1 },
  ],
];

// Helper to make an empty locked-cell board
function createEmptyBoard() {
  // 0 = empty, 1 = locked, 2 = locked + green row
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

// Check if all cells in a row are filled (non-zero)
function isRowFull(row) {
  return row.every((cell) => cell !== 0);
}


function Tetro() {
	const [locked, setLocked] = useState(() => createEmptyBoard());
  const [currentBlock, setCurrentBlock] = useState(null); // { shapeIndex, row, col }
  const [active, setActive] = useState(false);
  const [greenRows, setGreenRows] = useState(Array(ROWS).fill(false)); // which rows are green
  const boardRef = useRef(null);

  // Spawn a new random shape at the top-left of the board
  const spawnBlock = () => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    return { shapeIndex, row: 0, col: 0 };
  };

  // Check if a block can move by (dr, dc) without collisions/bounds issues
  const canMove = (block, dr, dc, lockedBoard) => {
    if (!block) return false;

    const shape = SHAPES[block.shapeIndex];

    for (const { r, c } of shape) {
      const newRow = block.row + r + dr;
      const newCol = block.col + c + dc;

      // Out of bounds?
      if (
        newRow < 0 ||
        newRow >= ROWS ||
        newCol < 0 ||
        newCol >= COLS
      ) {
        return false;
      }

      // Collision with locked cells?
      if (lockedBoard[newRow][newCol] !== 0) {
        return false;
      }
    }

    return true;
  };

  // Lock the current block into the board and return info about
  // green rows + losing condition.
  const lockBlock = (block, lockedBoard, greenRowsState) => {
    const newLocked = lockedBoard.map((row) => [...row]);
    const newGreenRows = [...greenRowsState];

    const shape = SHAPES[block.shapeIndex];
    let hitTopArea = false;

    // Place the block cells as "1" (locked)
    for (const { r, c } of shape) {
      const row = block.row + r;
      const col = block.col + c;

      if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
        newLocked[row][col] = 1;
        // Losing condition: any locked cell in rows 0..7 (top 8 rows)
        if (row < 8) {
          hitTopArea = true;
        }
      }
    }

    // Any fully filled rows? Turn them green (value 2)
    for (let r = 0; r < ROWS; r++) {
      if (isRowFull(newLocked[r]) && !newGreenRows[r]) {
        newGreenRows[r] = true;
        for (let c = 0; c < COLS; c++) {
          newLocked[r][c] = 2; // mark row as green
        }
      }
    }

    const totalGreen = newGreenRows.filter(Boolean).length;

    return {
      newLocked,
      newGreenRows,
      totalGreen,
      hitTopArea,
    };
  };

  // Game reset: clear everything, back to "waiting for click"
  const resetGame = () => {
    setLocked(createEmptyBoard());
    setCurrentBlock(null);
    setGreenRows(Array(ROWS).fill(false));
    setActive(false);
  };

  // Start game when board clicked
  const handleBoardClick = () => {
    setActive(true);
    // Focus board for accessibility (not strictly required for key events,
    // but nice if you ever swap to onKeyDown)
    if (boardRef.current) {
      boardRef.current.focus();
    }
    setCurrentBlock((prev) => prev || spawnBlock());
  };

  // Handle reset button
  const handleResetClick = () => {
    resetGame();
  };

  // Keyboard controls: left/right arrow move the current block
  useEffect(() => {
    if (!active || !currentBlock) return;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        setCurrentBlock((prev) => {
          if (!prev) return prev;
          if (canMove(prev, 0, -1, locked)) {
            return { ...prev, col: prev.col - 1 };
          }
          return prev;
        });
      } else if (event.key === "ArrowRight") {
        setCurrentBlock((prev) => {
          if (!prev) return prev;
          if (canMove(prev, 0, 1, locked)) {
            return { ...prev, col: prev.col + 1 };
          }
          return prev;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, currentBlock, locked]);

  // Falling logic: every 1 second move block down, or lock + spawn new one
  useEffect(() => {
    if (!active || !currentBlock) return;

    const timerId = setInterval(() => {
      setCurrentBlock((prevBlock) => {
        if (!prevBlock) return prevBlock;

        // Can the block move down?
        if (canMove(prevBlock, 1, 0, locked)) {
          return { ...prevBlock, row: prevBlock.row + 1 };
        }

        // Can't move down → lock the block in place
        const {
          newLocked,
          newGreenRows,
          totalGreen,
          hitTopArea,
        } = lockBlock(prevBlock, locked, greenRows);

        setLocked(newLocked);
        setGreenRows(newGreenRows);

        if (hitTopArea) {
          // Losing condition
          alert("Failed");
          resetGame();
          return null;
        }

        if (totalGreen >= 5) {
          // Win condition
          alert("Congrats!");
          incrementGamesWon();
          resetGame();
          return null;
        }

        // Otherwise spawn a new block at the top-left
        return spawnBlock();
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [active, currentBlock, locked, greenRows]);

  // Compute which cells are currently occupied by the falling block
  const currentBlockCells = new Set();
  if (currentBlock) {
    const shape = SHAPES[currentBlock.shapeIndex];
    for (const { r, c } of shape) {
      const row = currentBlock.row + r;
      const col = currentBlock.col + c;
      if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
        currentBlockCells.add(`${row}-${col}`);
      }
    }
  }

  return (
    <div className="tetro-container">
      <div
        className="tetro-board"
        onClick={handleBoardClick}
        ref={boardRef}
        tabIndex={0}
        aria-label="Tetro game board"
      >
        {Array.from({ length: ROWS }).map((_, rowIdx) =>
          Array.from({ length: COLS }).map((_, colIdx) => {
            const key = `${rowIdx}-${colIdx}`;
            const lockedVal = locked[rowIdx][colIdx];

            let className = "tetro-cell";
            if (lockedVal === 2) {
              className += " tetro-cell--green";
            } else if (lockedVal === 1) {
              className += " tetro-cell--filled";
            }

            if (currentBlockCells.has(key)) {
              className += " tetro-cell--current";
            }

            return <div key={key} className={className} />;
          })
        )}
      </div>

      <button
        className="reset-button"
        onClick={handleResetClick}
        style={{ marginBottom: "20px" }}
      >
        Reset Tetro
      </button>
    </div>
  );
}

export default Tetro;