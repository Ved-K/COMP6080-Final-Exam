import { useState } from "react";
import "./App.css";

const MAX_GUESSES = 10;

// Generate a random integer between 1 and 100 (inclusive)
function generateRandomNumber() {
	return Math.floor(Math.random() * 100) + 1;
}

function App() {
	const [secretNumber, setSecretNumber] = useState(generateRandomNumber); // hidden target
	const [currentGuess, setCurrentGuess] = useState(""); // value in the input box
	const [feedbackMessage, setFeedbackMessage] = useState(
		"Guess a number between 1 and 100."
	); // status text
	const [guessHistory, setGuessHistory] = useState([]); // array of { guess, result }
	const [remainingGuesses, setRemainingGuesses] = useState(MAX_GUESSES); // countdown
	const [gameOver, setGameOver] = useState(false); // true when correct or out of guesses

	// Update currentGuess whenever the input changes
	function handleInputChange(event) {
		setCurrentGuess(event.target.value);
	}

	// Handle when the user clicks "Guess"
	function handleGuess() {
		if (gameOver) return; // do nothing if game has ended

		const numericGuess = Number(currentGuess);

		// Basic validation: must be an integer between 1 and 100
		if (
			!Number.isInteger(numericGuess) ||
			numericGuess < 1 ||
			numericGuess > 100
		) {
			setFeedbackMessage("Please enter a whole number between 1 and 100.");
			return;
		}

		const newRemainingGuesses = remainingGuesses - 1;

		let resultText = "";
		let newFeedback = "";
		let isGameOverNow = false;

		if (numericGuess === secretNumber) {
			// Correct guess
			resultText = "Correct";
			newFeedback = `Correct! The number was ${secretNumber}.`;
			isGameOverNow = true;
		} else if (newRemainingGuesses === 0) {
			// No guesses left after this one
			if (numericGuess < secretNumber) {
				resultText = "Too low";
			} else {
				resultText = "Too high";
			}
			newFeedback = `No guesses left. The number was ${secretNumber}.`;
			isGameOverNow = true;
		} else if (numericGuess < secretNumber) {
			// Still have guesses, and guess is low
			resultText = "Too low";
			newFeedback = "Too low! Try a higher number.";
		} else {
			// Still have guesses, and guess is high
			resultText = "Too high";
			newFeedback = "Too high! Try a lower number.";
		}

		// Add this guess to the history
		const newHistoryEntry = {
			guess: numericGuess,
			result: resultText,
		};

		setGuessHistory((previousHistory) => [...previousHistory, newHistoryEntry]);

		// Update remaining guesses, message, game state
		setRemainingGuesses(newRemainingGuesses);
		setFeedbackMessage(newFeedback);
		setGameOver(isGameOverNow);

		// Clear input field for the next guess
		setCurrentGuess("");
	}

	// Reset the game to initial state with a new secret number
	function handleResetGame() {
		setSecretNumber(generateRandomNumber());
		setCurrentGuess("");
		setFeedbackMessage("Guess a number between 1 and 100.");
		setGuessHistory([]);
		setRemainingGuesses(MAX_GUESSES);
		setGameOver(false);
	}

	return (
		<div className="app">
			<h1>Number Guess Hi / Low</h1>

			<div className="game-card">
				{/* Input + Guess button */}
				<div className="input-row">
					<input
						type="number"
						className="guess-input"
						placeholder="Enter your guess"
						value={currentGuess}
						onChange={handleInputChange}
						disabled={gameOver}
					/>
					<button
						className="guess-button"
						onClick={handleGuess}
						disabled={gameOver || currentGuess === ""}
					>
						Guess
					</button>
				</div>

				{/* Feedback message */}
				<div className="feedback">
					<p>{feedbackMessage}</p>
				</div>

				{/* Remaining guesses */}
				<div className="remaining">
					<p>Guesses left: {remainingGuesses}</p>
				</div>

				{/* Guess history */}
				<div className="history">
					<h2>Guess History</h2>
					{guessHistory.length === 0 && <p>No guesses yet.</p>}
					{guessHistory.length > 0 && (
						<ul>
							{guessHistory.map((entry, index) => (
								<li key={index}>
									Guess {index + 1}: {entry.guess} ({entry.result})
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Reset button */}
				<button className="reset-button" onClick={handleResetGame}>
					Reset Game
				</button>
			</div>
		</div>
	);
}

export default App;
