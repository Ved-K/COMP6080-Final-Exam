import { useOptimistic, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
	const emptyBoard = [
		["2", "", "", ""],
		["", "", "", ""],
		["", "", "", ""],
		["", "", "", ""],
	];
	const [board, setBoard] = useState(emptyBoard);
	const [isGameOver, setIsGameOver] = useState(false);

	function mergeLine(values) {
		const merged = [];

		for (let i = 0; i < values.length; i++) {
			// if next value exists and is equal → merge them
			if (i < values.length - 1 && values[i] === values[i + 1]) {
				merged.push(values[i] * 2);
				i++; // skip the next one, already merged
			} else {
				merged.push(values[i]);
			}
		}

		return merged;
	}

	const getRandomInt = (max) => {
		return Math.floor(Math.random() * Math.ceil(max));
	};

	function isBoardFull(newBoard) {
		for (let r = 0; r < 4; r++) {
			for (let c = 0; c < 4; c++) {
				if (newBoard[r][c] === "") {
					return false;
				}
			}
		}

		return true;
	}

	function spawnRandomTile(newBoard) {
		let randRow = getRandomInt(4);
		let randCol = getRandomInt(4);
		if (isBoardFull(newBoard)) {
			gameOver();
		} else if (newBoard[randRow][randCol] === "") {
			newBoard[randRow][randCol] = "2";
		} else {
			spawnRandomTile(newBoard);
		}

		return;
	}

	function gameOver() {
		console.log("gameOver Broski");
		setIsGameOver(true);
	}

	function printGameOver() {
		if (isGameOver) {
			return "Game Over :(";
		} else {
			return null;
		}
	}

	function up() {
		const newBoard = board.map((row) => [...row]);

		// For each column
		for (let col = 0; col < 4; col++) {
			const values = [];

			// Collect non-empty cells in this column (top → bottom)
			for (let row = 0; row < 4; row++) {
				if (newBoard[row][col] !== "") {
					values.push(parseInt(newBoard[row][col], 10));
				}
			}

			const merged = mergeLine(values);

			// Write them back from the top, fill the rest with ""
			for (let row = 0; row < 4; row++) {
				newBoard[row][col] = merged[row] || "";
			}
		}

		console.log(newBoard);
		spawnRandomTile(newBoard);
		setBoard(newBoard);
	}

	function down() {
		const newBoard = board.map((row) => [...row]);

		// For each column
		for (let col = 0; col < 4; col++) {
			const values = [];

			// Collect non-empty cells in this column (top → bottom)
			for (let row = 0; row < 4; row++) {
				if (newBoard[row][col] !== "") {
					values.push(parseInt(newBoard[row][col], 10));
				}
			}

			const merged = mergeLine(values);

			// Write them back from the bottom to top fill the rest with ""
			for (let row = 0; row < 4; row++) {
				newBoard[3 - row][col] = merged[row] || "";
			}
		}

		console.log(newBoard);
		spawnRandomTile(newBoard);
		setBoard(newBoard);
	}

	function left() {
		const newBoard = board.map((row) => [...row]);

		// for each row
		for (let row = 0; row < 4; row++) {
			const values = [];

			// collect non-empty in this row (left → right)
			for (let col = 0; col < 4; col++) {
				if (newBoard[row][col] !== "") {
					values.push(parseInt(newBoard[row][col], 10));
				}
			}

			const merged = mergeLine(values);

			// fill them in from left to right
			for (let col = 0; col < 4; col++) {
				newBoard[row][col] = merged[col] || "";
			}
		}

		console.log(newBoard);
		spawnRandomTile(newBoard);
		setBoard(newBoard);
	}

	function right() {
		const newBoard = board.map((row) => [...row]);

		// for each row
		for (let row = 0; row < 4; row++) {
			const values = [];

			// collect non-empty in this row (left → right)
			for (let col = 0; col < 4; col++) {
				if (newBoard[row][col] !== "") {
					values.push(parseInt(newBoard[row][col], 10));
				}
			}

			const merged = mergeLine(values);

			// fill them in from right to left
			for (let col = 0; col < 4; col++) {
				newBoard[row][3 - col] = merged[col] || "";
			}
		}

		console.log(newBoard);
		spawnRandomTile(newBoard);
		setBoard(newBoard);
	}

	function handleKey(e) {
		if (!isGameOver) {
			if (e.key === "ArrowUp") {
				up();
			} else if (e.key === "ArrowDown") {
				down();
			} else if (e.key === "ArrowLeft") {
				left();
			} else if (e.key === "ArrowRight") {
				right();
			}
		}
	}

	function getTileColourClass(value) {
		if (value === "") {
			return "normal-tiles";
		} else if (parseInt(value) === 2) {
			return "tile-2";
		} else if (parseInt(value) === 4) {
			return "tile-4";
		} else if (parseInt(value) === 8) {
			return "tile-8";
		} else if (parseInt(value) === 16) {
			return "tile-16";
		} else if (parseInt(value) === 32) {
			return "tile-32";
		} else if (parseInt(value) === 64) {
			return "tile-64";
		} else if (parseInt(value) === 128) {
			return "tile-128";
		} else if (parseInt(value) === 256) {
			return "tile-256";
		} else if (parseInt(value) === 512) {
			return "tile-512";
		} else if (parseInt(value) === 1024) {
			return "tile-1024";
		} else if (parseInt(value) === 2048) {
			return "tile-2048";
		}
	}

	return (
		<div>
			<div className="board-background" tabIndex={0} onKeyDown={handleKey}>
				{board.map((row, x) =>
					row.map((cell, y) => (
						<button
							className={`normal-tiles ${getTileColourClass(cell)}`}
							key={`${x}-${y}`}
						>
							{cell}
						</button>
					))
				)}
			</div>

			<h2 className="game-over">{printGameOver()}</h2>
		</div>
	);
}

export default App;
