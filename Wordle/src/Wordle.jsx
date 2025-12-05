import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./Wordle.css";

import IMAGE_SRC from "./assets/taylogo.jpg";

const sampleWords = ["beer", "cock", "shit", "tits", "arse", "dick"];

function Wordle() {
	const emptyBoard = [
		["", "", "", ""],
		["", "", "", ""],
		["", "", "", ""],
		["", "", "", ""],
		["", "", "", ""],
	];

	const [word, setWord] = useState([]);
	const [board, setBoard] = useState(emptyBoard);

	useEffect(() => {
		const randWord = pickRandomElement(sampleWords);
		setWord(randWord);

		console.log(randWord);
	}, []);

	// random element from an array picker
	function pickRandomElement(arr) {
		const randomIndex = Math.floor(Math.random() * arr.length);
		return arr[randomIndex];
	}

    function handleMove()

	return (
		<>
			<div className="viewport-wordle">
				<div className="board-background" tabIndex={0}>
					{board.map((row, x) =>
						row.map((cell, y) => (
							<textarea
								className={`normal-tiles`}
								key={`${x}-${y}`}
								onChange={(e) => textAreaUpdate(e.target.value)}
							>
								{cell}
							</textarea>
						))
					)}
				</div>
			</div>
		</>
	);
}

export default Wordle;
