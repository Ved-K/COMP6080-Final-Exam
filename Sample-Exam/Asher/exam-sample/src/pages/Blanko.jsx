import { useEffect, useState } from "react";
import { incrementGamesWon } from "../utils/gameCounter";
import './Blanko.css';

const STRS = [
  "the fat cats",
  "larger frogs",
  "banana cakes",
  "unsw vs usyd",
  "french toast",
  "hawaii pizza",
  "barack obama",
];

function Blanko() {
  // The current string being used for this round (e.g. "banana cakes")
  const [currentStr, setCurrentStr] = useState("");

  // Indices (0–11) of the 3 characters we’ve turned into input boxes
  const [missingIndices, setMissingIndices] = useState([]);

  // User input for each missing index, e.g. { 2: "e", 7: "o" }
  const [inputs, setInputs] = useState({});

  /**
   * Set up a new Blanko round:
   *  - pick a random string from STRS
   *  - pick 3 random NON-SPACE character positions to hide
   *  - reset the inputs
   */
  const setupGame = () => {
    const randomStr = STRS[Math.floor(Math.random() * STRS.length)];
    const chars = randomStr.split("");

    // Get indices of all characters that are not spaces
    const nonSpaceIndices = chars
      .map((ch, idx) => (ch !== " " ? idx : null))
      .filter((idx) => idx !== null);

    // Shuffle those indices and take the first 3
    const shuffled = [...nonSpaceIndices].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3).sort((a, b) => a - b);

    setCurrentStr(randomStr);
    setMissingIndices(selected);
    setInputs({});
  };

  // Start the first game when the component mounts
  useEffect(() => {
    setupGame();
  }, []);

  /**
   * Handle input changes for the blank cells.
   * - Restrict to a single character
   * - Store the value in state
   * - When all 3 blanks are filled, check if they’re all correct
   */
  const handleInputChange = (index, e) => {
    let value = e.target.value;

    // Only keep the last typed character if user types more than one
    if (value.length > 1) {
      value = value.slice(-1);
    }

    const newInputs = {
      ...inputs,
      [index]: value,
    };
    setInputs(newInputs);

    // Check if all three missing positions have been filled
    const allFilled = missingIndices.every(
      (idx) => newInputs[idx] && newInputs[idx].length === 1
    );
    if (!allFilled) return;

    // Now check if the user’s characters match the original string
    const chars = currentStr.split("");
    const allCorrect = missingIndices.every(
      (idx) => newInputs[idx] === chars[idx]
    );

    if (allCorrect) {
      alert("Correct!");
      incrementGamesWon();
      setupGame(); // start a fresh round
    }
    // If incorrect, we just leave the inputs so user can adjust them.
  };

  if (!currentStr) {
    return <div className="blanko-container">Loading...</div>;
  }

  const chars = currentStr.split("");

  return (
    <div className="blanko-container">
      <div className="blanko-row">
        {chars.map((ch, idx) => {
          const isMissing = missingIndices.includes(idx);

          return (
            <div key={idx} className="cell">
              {isMissing ? (
                <input
                  className="cell input"
                  type="text"
                  maxLength={1}
                  value={inputs[idx] || ""}
                  onChange={(e) => handleInputChange(idx, e)}
                />
              ) : (
                ch
              )}
            </div>
          );
        })}
      </div>

      <button
        className="reset-button"
        onClick={setupGame}
        style={{ marginTop: "10px" }}
      >
        Reset Blanko
      </button>
    </div>
  );
}

export default Blanko;
