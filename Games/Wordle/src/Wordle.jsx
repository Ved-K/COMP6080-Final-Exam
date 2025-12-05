import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./Wordle.css";

import IMAGE_SRC from "./assets/taylogo.jpg";

const sampleWords = ["beer", "cock", "shit", "tits", "arse", "dick"];

function Wordle() {
	const emptyBoard = [
		[
			{ letter: "", status: "" },
			{ letter: "", status: "" },
			{ letter: "", status: "" },
			{ letter: "", status: "" },
		],
		[
			{ letter: "", status: "" },
			{ letter: "", status: "" },
			{ letter: "", status: "" },
			{ letter: "", status: "" },
		],
		[
			{ letter: "", status: "" },
			{ letter: "", status: "" },
			{ letter: "", status: "" },
			{ letter: "", status: "" },
		],
		[
			{ letter: "", status: "" },
			{ letter: "", status: "" },
			{ letter: "", status: "" },
			{ letter: "", status: "" },
		],
		[
			{ letter: "", status: "" },
			{ letter: "", status: "" },
			{ letter: "", status: "" },
			{ letter: "", status: "" },
		],
	];

	const [word, setWord] = useState("");
	const [board, setBoard] = useState(emptyBoard);
	const [currentRow, setCurrentRow] = useState(0);

	useEffect(() => {
		const randWord = pickRandomElement(sampleWords);
		setWord(randWord);

		console.log("new word: ", randWord);
	}, []);

	// random element from an array picker
	function pickRandomElement(arr) {
		const randomIndex = Math.floor(Math.random() * arr.length);
		return arr[randomIndex];
	}

	function handleInput(newLetter, row, col) {
		if (row !== currentRow) return;

		if (!newLetter.trim() || !/^[a-z]$/i.test(newLetter)) {
			return;
		}

		let newBoard = board.map((r) => r.map((cell) => ({ ...cell })));

		newBoard[row][col].letter = newLetter;

		if (col === 3) {
			triggerSubmit(newBoard, row);
			return;
		}

		setBoard(newBoard);
	}

	function triggerSubmit(newBoard, row) {
		let enteredWord = [];
		for (let i = 0; i < 4; i++) {
			enteredWord.push(newBoard[row][i].letter);
		}

		// set statuses for this row
		for (let i = 0; i < 4; i++) {
			const val = enteredWord[i];

			if (!val) continue;

			if (val === word[i]) {
				newBoard[row][i].status = "correct";
			} else if (word.includes(val)) {
				newBoard[row][i].status = "present";
			} else {
				newBoard[row][i].status = "absent";
			}
		}

		const isWin =
			newBoard[row][0].letter === word[0] &&
			newBoard[row][1].letter === word[1] &&
			newBoard[row][2].letter === word[2] &&
			newBoard[row][3].letter === word[3];

		if (isWin) {
			displayWin();
			return;
		} else if (row === 4) {
			displayLoss();
			return;
		}

		setBoard(newBoard);

		if (!isWin && row < 4) {
			setCurrentRow(row + 1);
		}
	}

	function displayLoss() {
		alert("RIPPP YOU LOST");
		resetGame();
	}

	function displayWin() {
		alert("YAYYY YOU WON");
		resetGame();
	}

	function resetGame() {
		setWord([]);
		setBoard(emptyBoard);
		setCurrentRow(0);

		const randWord = pickRandomElement(sampleWords);
		setWord(randWord);
		console.log("Reset to new word:", randWord);
	}

	return (
		<>
			<div className="viewport-wordle">
				<div className="board-background" tabIndex={0}>
					{board.map((row, x) =>
						row.map((cell, y) => (
							<textarea
								className={`normal-tiles ${cell.status}`}
								key={`${x}-${y}`}
								onChange={(e) => handleInput(e.target.value, x, y)}
								maxLength={1}
								disabled={x !== currentRow}
								value={cell.letter}
							></textarea>
						))
					)}
				</div>

				<button onClick={resetGame} className="reset-button">
					Reset
				</button>
			</div>
		</>
	);
}

export default Wordle;
