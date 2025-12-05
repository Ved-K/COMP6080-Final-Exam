import { useState, useEffect } from "react";
import "./App.css";

function App() {
	const emptyBoard = [
		["", "", ""],
		["", "", ""],
		["", "", ""],
	];
	const [board, setBoard] = useState(emptyBoard);
	const [turn, setTurn] = useState("X");
	const [winningTiles, setWinningTiles] = useState([]);
	const [winner, setWinner] = useState();

	function turnHandler(x, y) {
		if (!winner && board[x][y] === "") {
			let newBoard = board;
			newBoard[x][y] = turn;
			if (turn === "X") {
				setTurn("O");
			} else {
				setTurn("X");
			}

			// or as a ternary: setTurn(turn === 'X' ? 'O' : 'X')
			checkWin();
		}
	}

	function checkWin() {
		// diagonal win (top left to bottom right)
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

		// diagonal win (top right to bottom left)
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

		// cycle through all columns/rows to check for vertical/horizontal win
		for (let i = 0; i < 3; i++) {
			// horizontal win
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

			// vertical win
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

		return false;
	}

	function setGameWinner(winningCombo, player) {
		setWinningTiles(winningCombo);
		setWinner(player);
		let winCount = localStorage.getItem(`${player}_WIN`);
		localStorage.setItem(
			`${player}_WIN`,
			winCount ? parseInt(winCount) + 1 : 1
		);
	}

	function checkWinningTile(x, y) {
		if (winningTiles.some(([wx, wy]) => wx === x && wy === y)) {
			return "winning-tiles";
		}

		return "normal-tiles";
	}

	function handleReset() {
		setBoard(emptyBoard);
		setWinningTiles([]);
		setWinner();
		setTurn("X");
		localStorage.clear();
	}

	function handlePlayAgain() {
		setBoard(emptyBoard);
		setWinningTiles([]);
		setWinner();
		setTurn("X");
	}

	function boardIsFull() {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j] === "") {
					return false;
				}
			}
		}

		return true;
	}

	function printWinner() {
		if (winner) {
			return winner + " Wins!";
		} else if (!winner && boardIsFull()) {
			return "Tie!";
		} else {
			return;
		}
	}

	return (
		<div className="boardClass">
			{board.map((row, x) => {
				return (
					<div className="row" key={`row ${x}`}>
						{row.map((value, y) => {
							return (
								<button
									className={checkWinningTile(x, y)}
									onClick={() => turnHandler(x, y)}
									key={`col ${y}`}
								>
									{value}
								</button>
							);
						})}
					</div>
				);
			})}

			<div>
				<h3>{printWinner()}</h3>
			</div>

			<div className="score">
				<h2>Score</h2>
				<h3>X: {localStorage.getItem("X_WIN") || "Zero"}</h3>
				<h3>O: {localStorage.getItem("O_WIN") || "Zero"}</h3>
			</div>

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
