import { useState, useEffect } from "react";
import "./Tetro.css";

// --- Shape definitions -------------------------------------------------------
// We represent shapes as 2D arrays of 1s and 0s (here only 1s).
// The "1" cells are the blocks that are actually part of the tetromino.

// 2x2 square
const shape1 = [
	[1, 1],
	[1, 1],
];

// 2-high vertical line
const shape2 = [[1], [1]];

// 1x1 single block
const shape3 = [[1]];

// List of possible shapes to randomly choose from
const shapes = [shape1, shape2, shape3];

function Tetro() {
	// --- Board setup ---------------------------------------------------------
	// 12 rows high, 10 columns wide.
	// Each cell is an object with a "state" string:
	//  - "blank"  → empty
	//  - "filled" → occupied by a locked-in piece
	//  - "green"  → row that was completed (for scoring / win condition)
	const emptyBoard = Array.from({ length: 12 }, () =>
		Array.from({ length: 10 }, () => ({ state: "blank" }))
	);

	// React state:
	const [board, setBoard] = useState(emptyBoard);
	// currentPiece = { shape, x, y }
	//  - shape: one of shape1/shape2/shape3 (2D array)
	//  - x: column index on the board where the piece's top-left is
	//  - y: row index on the board where the piece's top-left is
	const [currentPiece, setCurrentPiece] = useState(null);
	// Whether the game is currently running
	const [isGameActive, setIsGameActive] = useState(false);
	// How many rows have been turned green so far
	const [greenRows, setGreenRows] = useState(0);

	// --- Utility: pick a random element from an array ------------------------
	function getRandomElement(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	// --- Start game handler ---------------------------------------------------
	// Called when the board is clicked.
	function gameStart() {
		// Don't restart if it's already active
		if (isGameActive) return;

		setIsGameActive(true);
		spawnNewPiece();
	}

	// --- Spawn a new piece at the top-left of the board ----------------------
	function spawnNewPiece() {
		const shape = getRandomElement(shapes);
		// start in the top-left corner (0,0)
		const newPiece = { shape, x: 0, y: 0 };

		// If the spawn position is already colliding with something on the board,
		// that means there is no room to spawn → instant loss.
		if (checkCollision(shape, 0, 0, board)) {
			alert("Failed!");
			resetGame();
			return;
		}

		setCurrentPiece(newPiece);
	}

	// --- Collision detection --------------------------------------------------
	// Given:
	//  - shape: 2D array (e.g. shape1 / shape2 / shape3)
	//  - x, y: top-left position of that shape on the board
	//  - brd: a snapshot of the board to test against
	// Returns true if placing the shape there would:
	//  - go outside board bounds
	//  - or overlap a "filled" cell
	function checkCollision(shape, x, y, brd) {
		for (let r = 0; r < shape.length; r++) {
			for (let c = 0; c < shape[0].length; c++) {
				// If this cell of the shape is empty (0), skip
				if (!shape[r][c]) continue;

				const newY = y + r; // board row
				const newX = x + c; // board column

				// Out of vertical bounds (below bottom)
				if (newY >= 12) return true;

				// Out of horizontal bounds (left/right wall)
				if (newX < 0 || newX >= 10) return true;

				// Check if the target board cell is already filled
				if (brd[newY][newX].state === "filled") return true;
			}
		}
		return false;
	}

	// --- Merge (lock) the current piece into the board -----------------------
	// We take:
	//  - shape: 2D array
	//  - x, y: where to place top-left of the shape
	//  - state: what to set the cells to (default "filled")
	// Returns a NEW board (does not mutate original state directly).
	function mergePieceToBoard(shape, x, y, state = "filled") {
		// Deep copy board (copy each row, then each cell object)
		const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

		for (let r = 0; r < shape.length; r++) {
			for (let c = 0; c < shape[0].length; c++) {
				if (shape[r][c]) {
					const newY = y + r;
					const newX = x + c;
					// Extra safety bounds check (should already be safe)
					if (newY >= 0 && newY < 12 && newX >= 0 && newX < 10) {
						newBoard[newY][newX].state = state;
					}
				}
			}
		}
		return newBoard;
	}

	// --- Reset the entire game back to initial state -------------------------
	function resetGame() {
		setBoard(emptyBoard);
		setCurrentPiece(null);
		setIsGameActive(false);
		setGreenRows(0);
	}

	// --- Main falling logic (gravity) ----------------------------------------
	// This useEffect sets up an interval that runs every second,
	// as long as:
	//  - the game is active
	//  - there is a currentPiece
	useEffect(() => {
		if (!isGameActive || !currentPiece) return;

		const intervalId = setInterval(() => {
			let { shape, x, y } = currentPiece;

			const nextY = y + 1;

			// Check if moving the piece down one row would collide:
			if (checkCollision(shape, x, nextY, board)) {
				// If it collides, we "lock" the piece at its current position
				const newBoard = mergePieceToBoard(shape, x, y, "filled");

				// After locking, we check for any fully filled rows.
				let rowsNowGreen = greenRows;

				for (let r = 0; r < 12; r++) {
					// A row is full if every cell is "filled"
					if (newBoard[r].every((cell) => cell.state === "filled")) {
						// Turn that row green
						newBoard[r].forEach((c) => (c.state = "green"));
						rowsNowGreen++;
					}
				}

				// If 5 or more rows total have been turned green,
				// the player wins and we reset after showing an alert.
				if (rowsNowGreen >= 5) {
					alert("Congrats!");
					resetGame();
					return;
				}

				// Save updated board + updated green row count
				setBoard(newBoard);
				setGreenRows(rowsNowGreen);

				// Spawn the next piece at the top
				spawnNewPiece();
				return;
			}

			// If no collision, just move the piece one row down.
			setCurrentPiece({ shape, x, y: nextY });
		}, 1000); // 1000ms = 1 second per drop step

		// Cleanup: clear interval when effect dependencies change or unmounts
		return () => clearInterval(intervalId);
	}, [isGameActive, currentPiece, board, greenRows]);
	// NOTE: including board + greenRows here means the interval is reset when
	// they change, but we always recreate it with fresh values. That's OK here.

	// --- Keyboard movement (left / right arrows) -----------------------------
	useEffect(() => {
		function handleKey(e) {
			if (!currentPiece) return;

			let { shape, x, y } = currentPiece;

			// Move left if possible
			if (e.key === "ArrowLeft" && !checkCollision(shape, x - 1, y, board)) {
				setCurrentPiece({ shape, x: x - 1, y });
			}

			// Move right if possible
			if (e.key === "ArrowRight" && !checkCollision(shape, x + 1, y, board)) {
				setCurrentPiece({ shape, x: x + 1, y });
			}
		}

		// Attach listener on mount / whenever dependencies change
		window.addEventListener("keydown", handleKey);
		// Clean up listener on unmount or when dependencies change
		return () => window.removeEventListener("keydown", handleKey);
	}, [currentPiece, board]);

	// --- Render --------------------------------------------------------------
	return (
		<div className="tetro-viewport">
			{/* Clicking the board starts the game */}
			<div className="tetro-board-background" onClick={gameStart} tabIndex={0}>
				{board.map((row, y) =>
					row.map((cell, x) => {
						let active = false;

						// Figure out if this board cell is currently occupied
						// by the falling piece (currentPiece)
						if (currentPiece) {
							const { shape, x: px, y: py } = currentPiece;

							// Relative position of this board cell to the piece's origin
							const relY = y - py;
							const relX = x - px;

							// Check if (relY, relX) is inside the shape AND that
							// shape[relY][relX] is "1" → active part of piece.
							if (
								relY >= 0 &&
								relY < shape.length &&
								relX >= 0 &&
								relX < shape[0].length &&
								shape[relY][relX] === 1
							) {
								active = true;
							}
						}

						// Choose CSS classes based on:
						//  - active falling piece
						//  - locked filled cells
						//  - green rows
						const className = `normal-tiles ${
							active
								? "active"
								: cell.state === "filled"
								? "filled"
								: cell.state === "green"
								? "green"
								: ""
						}`;

						return <div key={`${y}-${x}`} className={className}></div>;
					})
				)}
			</div>
		</div>
	);
}

export default Tetro;
