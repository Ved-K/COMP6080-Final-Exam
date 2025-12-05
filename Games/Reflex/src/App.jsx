// Import React hooks: useState for state, useEffect for side effects, useRef for storing mutable values
import { useState, useEffect, useRef } from 'react'
// Import CSS for styling
import './App.css'

// List of possible words for the reflex game
const wordList = ['quail', 'suborn', 'alcove', 'apostate', 'macabre', 'occluded', 'desiccant', 'waft', 'plethora']

// Main React component that contains all game logic
function App() {

  // Track how many milliseconds have passed since the game started
  const [elapsedTime, setElapsedTime] = useState(0)

  // Track the text the user has typed into the input field
  const [word, setWord] = useState('')

  // Track which word from wordList the user needs to type
  const [index, setIndex] = useState(0)

  // Track whether the player has successfully typed the word
  const [hasWon, setHasWon] = useState(false)

  // useRef stores the ID of the interval timer so we can stop it later
  const countRef = useRef(null)

  // Called once when the component mounts — starts the game automatically
  useEffect(() => {
    resetGame()   // initialize new round immediately
  }, [])          // empty dependency array = run only on first render

  // Reset the game to a new word and restart the timer
  const resetGame = () => {
    // Pick a random index between 0 and wordList.length - 1
    setIndex(Math.floor(Math.random() * wordList.length))

    // Clear whatever the user typed
    setWord('')

    // Indicate the user has not won yet
    setHasWon(false)

    // Focus on the input field so user can start typing immediately
    document.getElementById('word-input').focus()

    // Start the game timer
    handleStart()
  }

  // Start the timer logic
  const handleStart = () => {
    // Record the time the game started
    const startTime = Date.now()

    // If a previous timer is running, stop it first
    if (countRef.current) {
      clearInterval(countRef.current)
    }

    // Create a new timer that updates elapsedTime every 10 ms
    countRef.current = setInterval(() => {
      // New elapsed time = current time - start time
      setElapsedTime(Date.now() - startTime)
    }, 10)  // update frequency: every 10 milliseconds
  }

  // Stop the timer when the user wins
  const handleStop = () => {
    clearInterval(countRef.current)   // stop the interval
  }

  // Runs every time the user types in the input box
  const textOnChange = (e) => {
    // If game already completed, ignore typing
    if (hasWon)
      return

    // Update the user's typed text
    setWord(e.target.value)

    // Check if the typed word matches the target word exactly
    if (e.target.value === wordList[index]) {
      // Mark the user as having completed the challenge
      setHasWon(true)

      // Stop the timer because the game is finished
      handleStop()
    }
  }

  // JSX returned to display the UI
  return (
    // Main layout container
    <div className="container">

      {/* Instruction text for the player */}
      <h3>Please enter the following word as fast as possible</h3>

      {/* Show the randomly selected target word */}
      <span className="word-display">{wordList[index]}</span>

      {/* Input field where the user types the word */}
      <input
        id="word-input"          // used for focusing programmatically
        type="text"              // text input
        value={word}             // controlled input: value tied to state
        onChange={textOnChange}  // event handler for typing
      />

      {/* Button to start a new round */}
      <button onClick={resetGame}>Reset</button>

      {/* Display elapsed time in seconds (convert ms → seconds) */}
      <div>Elapsed time: {elapsedTime / 1000} seconds</div>
    </div>
  )
}

// Export component so it can be used in main.jsx
export default App
