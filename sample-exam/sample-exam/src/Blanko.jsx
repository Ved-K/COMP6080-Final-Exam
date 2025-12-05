import { useState, useEffect } from "react";
// need to run npm install react-router-dom
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./Blanko.css";

import { STORAGE_KEY } from "./Home";

export const strs = [
	"the fat cats",
	"larger frogs",
	"banana cakes",
	"unsw vs usyd",
	"french toast",
	"hawaii pizza",
	"barack obama",
];

function Blanko() {
	const [chosenString, setChosenString] = useState([]);
	const [blankIndexes, setBlankIndexes] = useState([]);
	const [enteredSolns, setEnteredSolns] = useState([]);

	useEffect(() => {
		if (!chosenString.length) {
			const randomIndex = Math.floor(Math.random() * strs.length);
			setChosenString(strs[randomIndex]);
		}
	}, [chosenString]);

	useEffect(() => {
		// need this guard to block it from iterating through chosen string before the first use effect runs
		// and we acc set chosen string.
		if (!chosenString.length) return;

		const stringArray = [...chosenString];
		let blankIndex;

		do {
			// max should be length - 1 because indexes go 0..length-1
			blankIndex = generateUniqueRandomNumbers(0, stringArray.length, 3);
			// keep looping while ANY chosen index is a space
		} while (blankIndex.some((index) => stringArray[index] === " "));

		setBlankIndexes(blankIndex);

		const initialEntered = Array(stringArray.length).fill("");
		setEnteredSolns(initialEntered);
	}, [chosenString]);

	function prepareString() {
		if (!chosenString.length) return null;

		const stringArray = [...chosenString];

		// use map to naturally build an return an array
		return stringArray.map((char, i) => {
			if (blankIndexes.includes(i)) {
				return (
					<textarea
						onChange={(e) => textAreaUpdate(e.target.value, i)}
						maxLength={1}
						key={i}
					></textarea>
				);
			} else {
				return (
					<div className="filled-in-box" key={i}>
						{char}
					</div>
				);
			}
		});

		// or alternatively, you can create an elements array:
		// const elements = [];
		// for (let i = 0; i < stringArray.length; i++) {
		// 	if (blankIndex.includes(i)) {
		// 		elements.push(<textarea key={i}></textarea>);
		// 	} else {
		// 		elements.push(<div key={i}>{stringArray[i]}</div>);
		// 	}
		// }
		// return elements;
	}

	function textAreaUpdate(value, index) {
		setEnteredSolns((prev) => {
			const copy = [...prev];
			copy[index] = value;
			return copy;
		});
	}

	// function from google search - max not included
	function generateUniqueRandomNumbers(min, max, count) {
		const possibleNumbers = [];
		for (let i = min; i < max; i++) {
			possibleNumbers.push(i);
		}

		// Shuffle the array using Fisher-Yates algorithm
		for (let i = possibleNumbers.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[possibleNumbers[i], possibleNumbers[j]] = [
				possibleNumbers[j],
				possibleNumbers[i],
			];
		}

		return possibleNumbers.slice(0, count);
	}

	useEffect(() => {
		if (!blankIndexes.length || !enteredSolns.length || !chosenString.length)
			return;

		const stringArray = [...chosenString];

		const allCorrect = blankIndexes.every((i) => {
			return enteredSolns[i] === stringArray[i];
		});

		if (allCorrect) {
			alert("Correct!");
			handleReset();
			let winCount = localStorage.getItem(STORAGE_KEY);
			localStorage.setItem(STORAGE_KEY, parseInt(winCount) + 1);
		}
	}, [blankIndexes, enteredSolns, chosenString]);

	function handleReset() {
		setChosenString([]);
		setBlankIndexes([]);
		setEnteredSolns([]);
	}

	return (
		<div className="viewport">
			<div className="blanko-tiles">{prepareString()}</div>
			<button onClick={handleReset}>Reset</button>
		</div>
	);
}

export default Blanko;
