import { useState } from "react";
import "./App.css";

const ROWS = 6;
const COLUMNS = 7;

// Create an empty 6x7 board (all cells start as null)
function createEmptyBoard() {
	// Outer array = rows, inner array = columns
	return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
}

function App() {
	// 2D array representing the board state
	const [board, setBoard] = useState(createEmptyBoard);

	// "R" = Red player, "Y" = Yellow player
	const [currentPlayer, setCurrentPlayer] = useState("R");

	// winner can be: "R", "Y", "draw", or null (no winner yet)
	const [winner, setWinner] = useState(null);

	/**
	 * Called when a column is clicked.
	 * We drop the current player's disc into that column.
	 */
	function handleColumnClick(columnIndex) {
		// If the game is already over, ignore any more clicks
		if (winner) return;

		// Make a copy of the board so we don't modify state directly
		const newBoard = board.map((row) => [...row]);

		// This will store which row we actually placed the disc in
		let placedRowIndex = null;

		// Start from the bottom row and look upwards for an empty cell
		for (let rowIndex = ROWS - 1; rowIndex >= 0; rowIndex--) {
			if (!newBoard[rowIndex][columnIndex]) {
				// Place the current player's disc here
				newBoard[rowIndex][columnIndex] = currentPlayer;
				placedRowIndex = rowIndex;
				break;
			}
		}

		// If placedRowIndex is still null, the column was full → do nothing
		if (placedRowIndex === null) return;

		// Check if this move caused the current player to win
		const didCurrentPlayerWin = checkWin(
			newBoard,
			placedRowIndex,
			columnIndex,
			currentPlayer
		);

		if (didCurrentPlayerWin) {
			setBoard(newBoard);
			setWinner(currentPlayer);
			return;
		}

		// If no one has won, check if the board is completely full (draw)
		const isFull = isBoardFull(newBoard);
		if (isFull) {
			setBoard(newBoard);
			setWinner("draw");
			return;
		}

		// Otherwise, no win and no draw → switch to the other player
		setBoard(newBoard);
		setCurrentPlayer((previousPlayer) => (previousPlayer === "R" ? "Y" : "R"));
	}

	/**
	 * Returns true if there are no empty cells on the board.
	 */
	function isBoardFull(boardToCheck) {
		// Every row must have every cell non-null
		return boardToCheck.every((row) => row.every((cell) => cell !== null));
	}

	/**
	 * Check if the player has 4 in a row after placing a piece at (rowIndex, columnIndex).
	 * We look in 4 directions:
	 * - horizontal (left-right)
	 * - vertical (up-down)
	 * - diagonal down-right / up-left
	 * - diagonal down-left / up-right
	 */
	function checkWin(boardToCheck, rowIndex, columnIndex, playerSymbol) {
		// Each direction is described by how the row and column change
		const directionsToCheck = [
			{ rowChange: 0, columnChange: 1 }, // horizontal
			{ rowChange: 1, columnChange: 0 }, // vertical
			{ rowChange: 1, columnChange: 1 }, // diagonal down-right / up-left
			{ rowChange: 1, columnChange: -1 }, // diagonal down-left / up-right
		];

		// For each direction, we count how many of the same colour are in a straight line
		for (const direction of directionsToCheck) {
			const { rowChange, columnChange } = direction;

			// We already have one piece at (rowIndex, columnIndex)
			let consecutiveCount = 1;

			// ----- Move in the "forward" direction -----
			let currentRowIndex = rowIndex + rowChange;
			let currentColumnIndex = columnIndex + columnChange;

			while (
				currentRowIndex >= 0 &&
				currentRowIndex < ROWS &&
				currentColumnIndex >= 0 &&
				currentColumnIndex < COLUMNS &&
				boardToCheck[currentRowIndex][currentColumnIndex] === playerSymbol
			) {
				consecutiveCount++;
				currentRowIndex += rowChange;
				currentColumnIndex += columnChange;
			}

			// ----- Move in the "backward" direction -----
			currentRowIndex = rowIndex - rowChange;
			currentColumnIndex = columnIndex - columnChange;

			while (
				currentRowIndex >= 0 &&
				currentRowIndex < ROWS &&
				currentColumnIndex >= 0 &&
				currentColumnIndex < COLUMNS &&
				boardToCheck[currentRowIndex][currentColumnIndex] === playerSymbol
			) {
				consecutiveCount++;
				currentRowIndex -= rowChange;
				currentColumnIndex -= columnChange;
			}

			// If we have 4 or more in a row in this direction, it's a win
			if (consecutiveCount >= 4) {
				return true;
			}
		}

		// No 4-in-a-row found in any direction
		return false;
	}

	/**
	 * Reset the game back to the starting state.
	 */
	function handleReset() {
		setBoard(createEmptyBoard());
		setCurrentPlayer("R");
		setWinner(null);
	}

	return (
		<div className="app">
			<h1>Connect Four</h1>

			{/* Game board */}
			<div className="board">
				{board.map((row, rowIndex) =>
					row.map((cellValue, columnIndex) => (
						<button
							key={`${rowIndex}-${columnIndex}`}
							className="cell"
							onClick={() => handleColumnClick(columnIndex)}
						>
							{cellValue && (
								<div
									className={`disc ${cellValue === "R" ? "red" : "yellow"}`}
								/>
							)}
						</button>
					))
				)}
			</div>

			{/* Status text (winner / current player) */}
			<div className="status">
				{winner === "draw" && <span>It&apos;s a draw!</span>}
				{winner === "R" && <span>Red wins!</span>}
				{winner === "Y" && <span>Yellow wins!</span>}
				{!winner && (
					<span>
						Current turn:{" "}
						<strong>{currentPlayer === "R" ? "Red" : "Yellow"}</strong>
					</span>
				)}
			</div>

			{/* Reset button */}
			<button className="resetButton" onClick={handleReset}>
				Reset Game
			</button>
		</div>
	);
}

export default App;
