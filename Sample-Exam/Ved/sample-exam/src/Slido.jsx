import { useState, useEffect } from "react";
import "./Slido.css";

import { STORAGE_KEY } from "./Home";

import img1 from "./assets/1.png";
import img2 from "./assets/2.png";
import img3 from "./assets/3.png";
import img4 from "./assets/4.png";
import img5 from "./assets/5.png";
import img6 from "./assets/6.png";
import img7 from "./assets/7.png";
import img8 from "./assets/8.png";

const imageSources = [img1, img2, img3, img4, img5, img6, img7, img8];

function Slido() {
	const emptyBoard = [
		[null, null, null],
		[null, null, null],
		[null, null, null],
	];

	const [board, setBoard] = useState(emptyBoard);
	const [winner, setWinner] = useState(null);
	const [isSolveDisabled, setIsSolveDisabled] = useState(false);

	// assign images and set board on first load
	useEffect(() => {
		let newBoard = board.map((row) => [...row]);
		const shuffledImages = shuffleArray([...imageSources]);

		newBoard[0][0] = shuffledImages[0];
		newBoard[0][1] = shuffledImages[1];
		newBoard[0][2] = shuffledImages[2];
		newBoard[1][0] = shuffledImages[3];
		newBoard[1][1] = shuffledImages[4];
		newBoard[1][2] = shuffledImages[5];
		newBoard[2][0] = shuffledImages[6];
		newBoard[2][1] = shuffledImages[7];

		console.log(shuffledImages);
		console.log(newBoard);

		setBoard(newBoard);
		setWinner("random");
		setIsSolveDisabled(false);
	}, [winner]);

	// testing function- one solve away
	// useEffect(() => {
	// 	let newBoard = [
	// 		[img1, img2, img3],
	// 		[img4, img5, img6],
	// 		[img7, null, img8],
	// 	];

	// 	setBoard(newBoard);
	// 	setWinner("random");
	// 	setIsSolveDisabled(false);
	// }, [winner]);

	// function from google.
	function shuffleArray(array) {
		let currentIndex = array.length,
			randomIndex;

		// While there remain elements to shuffle.
		while (currentIndex !== 0) {
			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex],
				array[currentIndex],
			];
		}

		return array;
	}

	function handleMove(x, y) {
		if (hasWon(board)) {
			return;
		}

		let newBoard = board.map((row) => [...row]);

		// empty cell above:
		if (x > 0 && newBoard[x - 1][y] === null) {
			newBoard[x - 1][y] = newBoard[x][y];
			newBoard[x][y] = null;
		}

		// empty cell below
		if (x < 2 && newBoard[x + 1][y] === null) {
			newBoard[x + 1][y] = newBoard[x][y];
			newBoard[x][y] = null;
		}

		// empty cell left
		if (y > 0 && newBoard[x][y - 1] === null) {
			newBoard[x][y - 1] = newBoard[x][y];
			newBoard[x][y] = null;
		}

		// empty cell left
		if (y < 2 && newBoard[x][y + 1] === null) {
			newBoard[x][y + 1] = newBoard[x][y];
			newBoard[x][y] = null;
		}

		setBoard(newBoard);

		if (hasWon(newBoard)) {
			runWinningActions();
		}
	}

	function runWinningActions() {
		alert("TASK COMPLETED");
		let numWins = localStorage.getItem(STORAGE_KEY);
		localStorage.setItem(STORAGE_KEY, parseInt(numWins) + 1);
		setIsSolveDisabled(true);
	}

	function hasWon(newBoard) {
		if (
			newBoard[0][0] === imageSources[0] &&
			newBoard[0][1] === imageSources[1] &&
			newBoard[0][2] === imageSources[2] &&
			newBoard[1][0] === imageSources[3] &&
			newBoard[1][1] === imageSources[4] &&
			newBoard[1][2] === imageSources[5] &&
			newBoard[2][0] === imageSources[6] &&
			newBoard[2][1] === imageSources[7]
		) {
			return true;
		}

		return false;
	}

	function solveHandler() {
		let newBoard = board.map((row) => [...row]);
		newBoard[0][0] = imageSources[0];
		newBoard[0][1] = imageSources[1];
		newBoard[0][2] = imageSources[2];
		newBoard[1][0] = imageSources[3];
		newBoard[1][1] = imageSources[4];
		newBoard[1][2] = imageSources[5];
		newBoard[2][0] = imageSources[6];
		newBoard[2][1] = imageSources[7];

		setBoard(newBoard);
		setIsSolveDisabled(true);
	}

	function resetHandler() {
		setBoard(emptyBoard);
		setWinner(null);
		setIsSolveDisabled(false);
	}

	return (
		<div className="viewport">
			<div className="slido-board-background" tabIndex={0}>
				{board.map((row, x) =>
					row.map((cell, y) => (
						<button
							className={`normal-tiles`}
							key={`${x}-${y}`}
							onClick={() => handleMove(x, y)}
						>
							{cell && <img src={cell}></img>}
						</button>
					))
				)}
			</div>

			<div className="buttons-array">
				<button disabled={isSolveDisabled} onClick={solveHandler}>
					Solve
				</button>
				<button onClick={resetHandler}>Reset</button>
			</div>
		</div>
	);
}

export default Slido;
