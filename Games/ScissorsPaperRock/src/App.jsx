import { useState } from "react";
import "./App.css";

const options = ["scissors", "paper", "rock"];

function App() {
	// Track scores for user and computer
	const [userScore, setUserScore] = useState(0);
	const [computerScore, setComputerScore] = useState(0);

	// Track what the computer picked in the current round
	const [computerChoice, setComputerChoice] = useState(null);

	// Stores the result text of the current round ("YOU WIN!", etc.)
	const [winner, setWinner] = useState(null);

	// Disable choice buttons after a round is played until "Play Again" / "Reset"
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	/**
	 * Called when the user clicks one of the three choices.
	 */
	function handleSelectChoice(userChoice) {
		if (!userChoice || isButtonDisabled) return;

		// Lock buttons so the user can’t spam multiple choices in one round
		setIsButtonDisabled(true);

		// Randomly choose a move for the computer
		const compChoice = getRandomElement(options);
		setComputerChoice(compChoice);

		// Decide the result of this round once, then branch on it
		const result = hasUserWon(userChoice, compChoice);

		if (result === true) {
			// User wins
			actionUserWon();
			setWinner("YOU WIN!");
		} else if (result === false) {
			// Computer wins
			actionComputerWon();
			setWinner("COMPUTER WINS :(");
		} else {
			// Tie case (result === null)
			setWinner("IT'S A TIE!");
		}
	}

	/**
	 * Clears current round state but keeps scores.
	 * Lets the user play another round.
	 */
	function handlePlayAgain() {
		setComputerChoice(null);
		setWinner(null);
		setIsButtonDisabled(false);
	}

	/**
	 * Fully reset the game: scores + current round info.
	 */
	function handleReset() {
		setUserScore(0);
		setComputerScore(0);
		setComputerChoice(null);
		setWinner(null);
		setIsButtonDisabled(false);
	}

	/**
	 * Increment user score by 1.
	 */
	function actionUserWon() {
		setUserScore((currScore) => currScore + 1);
	}

	/**
	 * Increment computer score by 1.
	 */
	function actionComputerWon() {
		setComputerScore((currScore) => currScore + 1);
	}

	/**
	 * Returns:
	 *   true  -> user wins
	 *   false -> computer wins
	 *   null  -> tie
	 */
	function hasUserWon(user, comp) {
		// Tie
		if (user === comp) return null;

		if (user === "scissors" && comp === "paper") return true;
		if (user === "paper" && comp === "rock") return true;
		if (user === "rock" && comp === "scissors") return true;

		// All other non-tie outcomes are computer wins
		return false;
	}

	/**
	 * Pick a random element from a given array.
	 */
	function getRandomElement(arr) {
		const randomIndex = Math.floor(Math.random() * arr.length);
		return arr[randomIndex];
	}

	return (
		<div className="spr-viewport">
			{/* Choice buttons */}
			<div className="spr-choice">
				<button
					disabled={isButtonDisabled}
					onClick={() => handleSelectChoice("scissors")}
				>
					Scissors
				</button>
				<button
					disabled={isButtonDisabled}
					onClick={() => handleSelectChoice("paper")}
				>
					Paper
				</button>
				<button
					disabled={isButtonDisabled}
					onClick={() => handleSelectChoice("rock")}
				>
					Rock
				</button>
			</div>

			{/* 
        CONDITIONAL RENDERING:
        Only show the result box once a round has finished.
        We can key this off `winner` or `computerChoice`.
      */}
			{winner && (
				<div className="result-box">
					<h2>The computer picked:</h2>
					<div className="computer-choice">{computerChoice}</div>
					<div className="round-result">{winner}</div>
				</div>
			)}

			{/* Always show scores */}
			<div className="score-card">
				<h3>Scores:</h3>
				<div>Your ahh: {userScore}</div>
				<div>Computer: {computerScore}</div>
			</div>

			{/* Control buttons */}
			<div className="controls">
				<button onClick={handlePlayAgain}>Play Again</button>
				<button onClick={handleReset}>Reset</button>
			</div>
		</div>
	);
}

export default App;
