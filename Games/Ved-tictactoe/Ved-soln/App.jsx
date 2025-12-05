import { useState } from "react";
import "./App.css";

/**
 * Simple Tic-Tac-Toe game using React functional components and hooks.
 *
 * High-level structure:
 * 1. CONSTANTS / INITIAL STATE
 * 2. STATE HOOKS
 * 3. GAME LOGIC (turnHandler, checkWin, setGameWinner)
 * 4. UI HELPERS (boardIsFull, checkWinningTile, printWinner)
 * 5. RESET / PLAY AGAIN HANDLERS
 * 6. RENDER (building a 3x3 grid from a 2D array with .map)
 */

function App() {
	/* -------------------------------------------------------------
	 * 1. CONSTANTS / INITIAL STATE
	 * ----------------------------------------------------------- */
	// Represents an empty 3x3 board.
	// Each inner array is a row, each string is a cell value: "", "X" or "O".
	const emptyBoard = [
		["", "", ""],
		["", "", ""],
		["", "", ""],
	];

	/* -------------------------------------------------------------
	 * 2. STATE HOOKS
	 * ----------------------------------------------------------- */
	// board: 2D array representing the game board.
	// Starts as emptyBoard (all cells empty).
	const [board, setBoard] = useState(emptyBoard);

	// turn: which player's turn it currently is ("X" or "O").
	const [turn, setTurn] = useState("X");

	// winningTiles: list of coordinate pairs [[row, col], ...] that form the
	// winning line. Used to apply a special CSS class to those tiles.
	const [winningTiles, setWinningTiles] = useState([]);

	// winner: "X" or "O" when someone has won, otherwise undefined.
	const [winner, setWinner] = useState();

	/* -------------------------------------------------------------
	 * 3. GAME LOGIC
	 * ----------------------------------------------------------- */

	/**
	 * turnHandler(x, y)
	 * Called when a cell (x, y) is clicked.
	 *
	 * Responsibilities:
	 * - Ignore clicks if:
	 *   - The game already has a winner.
	 *   - The clicked cell is not empty.
	 * - Place the current player's mark ("X" or "O") in that cell.
	 * - Toggle the turn to the other player.
	 * - Check if this move caused a win.
	 */
	function turnHandler(x, y) {
		// Only allow moves if:
		// - There is no winner yet, AND
		// - The chosen cell is currently empty.
		if (!winner && board[x][y] === "") {
			// NOTE: This line mutates the existing board state.
			// In "proper" React style, you'd copy the board first:
			// const newBoard = board.map(row => [...row]);
			// newBoard[x][y] = turn;
			//
			// But for this small example, we keep your approach, with a comment.
			let newBoard = board;
			newBoard[x][y] = turn;

			// Toggle the turn: if it was X, make it O; otherwise make it X.
			if (turn === "X") {
				setTurn("O");
			} else {
				setTurn("X");
			}

			// After updating the board, check if this move created a winning line.
			// (checkWin reads from the current board state.)
			checkWin();
		}
	}

	/**
	 * checkWin()
	 *
	 * Checks the current board for a win condition.
	 * Win conditions:
	 * - 3 in a row horizontally
	 * - 3 in a row vertically
	 * - 3 in a row diagonally
	 *
	 * If a win is detected, calls setGameWinner() with:
	 * - The coordinates of the winning tiles
	 * - The player symbol ("X" or "O") who won
	 */
	function checkWin() {
		// Check diagonal (top-left to bottom-right): (0,0), (1,1), (2,2)
		if (
			board[0][0] !== "" &&
			board[0][0] === board[1][1] &&
			board[1][1] === board[2][2]
		) {
			setGameWinner(
				[
					[0, 0],
					[1, 1],
					[2, 2],
				],
				board[0][0]
			);
			return true;
		}

		// Check diagonal (top-right to bottom-left): (0,2), (1,1), (2,0)
		if (
			board[0][2] !== "" &&
			board[0][2] === board[1][1] &&
			board[1][1] === board[2][0]
		) {
			setGameWinner(
				[
					[0, 2],
					[1, 1],
					[2, 0],
				],
				board[0][2]
			);
			return true;
		}

		// Check all rows and columns
		for (let i = 0; i < 3; i++) {
			// Horizontal win: row i
			// Cells: (i,0), (i,1), (i,2)
			if (
				board[i][0] !== "" &&
				board[i][0] === board[i][1] &&
				board[i][1] === board[i][2]
			) {
				setGameWinner(
					[
						[i, 0],
						[i, 1],
						[i, 2],
					],
					board[i][0]
				);
				return true;
			}

			// Vertical win: column i
			// Cells: (0,i), (1,i), (2,i)
			if (
				board[0][i] !== "" &&
				board[0][i] === board[1][i] &&
				board[1][i] === board[2][i]
			) {
				setGameWinner(
					[
						[0, i],
						[1, i],
						[2, i],
					],
					board[0][i]
				);
				return true;
			}
		}

		// No win found
		return false;
	}

	/**
	 * setGameWinner(winningCombo, player)
	 *
	 * Called when a win is detected.
	 * - Stores the winning tiles so they can be highlighted.
	 * - Stores the winner ("X" or "O").
	 * - Updates localStorage to increment the win count for that player.
	 */
	function setGameWinner(winningCombo, player) {
		// Update the coordinates of the winning tiles (for CSS highlighting).
		setWinningTiles(winningCombo);

		// Store the winner so the UI can display it.
		setWinner(player);

		// Update win count in localStorage.
		// Key format: "X_WIN" or "O_WIN".
		let winCount = localStorage.getItem(`${player}_WIN`);
		localStorage.setItem(
			`${player}_WIN`,
			winCount ? parseInt(winCount, 10) + 1 : 1
		);
	}

	/* -------------------------------------------------------------
	 * 4. UI HELPERS
	 * ----------------------------------------------------------- */

	/**
	 * checkWinningTile(x, y)
	 *
	 * Determines which CSS class to apply to a cell:
	 * - "winning-tiles" if (x, y) is part of the winning combination.
	 * - "normal-tiles" otherwise.
	 *
	 * Uses Array.prototype.some to check if [x, y] matches any stored pair
	 * in winningTiles.
	 */
	function checkWinningTile(x, y) {
		const isWinningTile = winningTiles.some(([wx, wy]) => wx === x && wy === y);

		if (isWinningTile) {
			return "winning-tiles";
		}

		return "normal-tiles";
	}

	/**
	 * boardIsFull()
	 *
	 * Returns true if there are no empty cells ("") left on the board.
	 * Used to detect a tie when no winner and the board is full.
	 */
	function boardIsFull() {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j] === "") {
					return false; // Found at least one empty cell -> board is not full.
				}
			}
		}

		return true; // No empty cells -> board is full.
	}

	/**
	 * printWinner()
	 *
	 * Chooses what status text to display:
	 * - If there is a winner, show "<winner> Wins!"
	 * - Else if no winner but board is full, show "Tie!"
	 * - Else show nothing (undefined).
	 */
	function printWinner() {
		if (winner) {
			return winner + " Wins!";
		} else if (!winner && boardIsFull()) {
			return "Tie!";
		} else {
			return;
		}
	}

	/* -------------------------------------------------------------
	 * 5. RESET / PLAY AGAIN HANDLERS
	 * ----------------------------------------------------------- */

	/**
	 * handleReset()
	 *
	 * Fully resets the game:
	 * - Clears the board
	 * - Clears winning tiles
	 * - Clears winner
	 * - Resets turn to "X"
	 * - Clears localStorage (win history)
	 */
	function handleReset() {
		setBoard(emptyBoard);
		setWinningTiles([]);
		setWinner();
		setTurn("X");
		localStorage.clear();
	}

	/**
	 * handlePlayAgain()
	 *
	 * Resets just the board state for another round, but:
	 * - Keeps the scores stored in localStorage.
	 */
	function handlePlayAgain() {
		setBoard(emptyBoard);
		setWinningTiles([]);
		setWinner();
		setTurn("X");
	}

	/* -------------------------------------------------------------
	 * 6. RENDER
	 * ----------------------------------------------------------- */

	/**
	 * Rendering the grid:
	 *
	 * board is a 2D array:
	 *   [
	 *     ["", "", ""],
	 *     ["", "", ""],
	 *     ["", "", ""],
	 *   ]
	 *
	 * We turn this into JSX like:
	 *   <div class="row">
	 *     <button>cell 0</button>
	 *     <button>cell 1</button>
	 *     <button>cell 2</button>
	 *   </div>
	 *
	 * using nested .map:
	 *   - Outer .map: iterates rows (x index)
	 *   - Inner .map: iterates cells in each row (y index)
	 *
	 * This is the general React pattern to build a grid from a 2D array.
	 */
	return (
		<div className="boardClass">
			{/* Build the 3x3 board grid */}
			{board.map((row, x) => {
				return (
					// Each row is wrapped in a div
					<div className="row" key={`row ${x}`}>
						{row.map((value, y) => {
							return (
								<button
									// Dynamic class: highlight if part of winningTiles
									className={checkWinningTile(x, y)}
									// When clicked, attempt to make a move at (x, y)
									onClick={() => turnHandler(x, y)}
									// Key for React list rendering
									key={`col ${y}`}
								>
									{/* Display "X", "O", or "" */}
									{value}
								</button>
							);
						})}
					</div>
				);
			})}

			{/* Winner / Tie message */}
			<div>
				<h3>{printWinner()}</h3>
			</div>

			{/* Scoreboard, using localStorage for persistence */}
			<div className="score">
				<h2>Score</h2>
				{/* Fallback to "Zero" if there is no stored value yet */}
				<h3>X: {localStorage.getItem("X_WIN") || "Zero"}</h3>
				<h3>O: {localStorage.getItem("O_WIN") || "Zero"}</h3>
			</div>

			{/* Action buttons */}
			<div className="action-bar">
				<button onClick={handlePlayAgain} className="play-again">
					Play Again
				</button>

				<button onClick={handleReset} className="reset">
					Reset
				</button>
			</div>
		</div>
	);
}

export default App;
