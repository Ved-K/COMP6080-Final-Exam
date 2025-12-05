import { useState, useEffect, useRef } from "react";
import "./MemoryMatch.css";

// Grid settings
const ROWS = 4;
const COLS = 4;
const TOTAL_CARDS = ROWS * COLS;   // 16
const PAIRS = TOTAL_CARDS / 2;     // 8

// Some fun symbols – each will appear exactly twice
const SYMBOLS = ["🍎", "🍌", "🍇", "🍓", "🍒", "🍉", "🍍", "🥝"];

/**
 * Helper: create a shuffled deck of card objects.
 * Each card has:
 *  - id: unique id (for React key)
 *  - symbol: the emoji/string it shows when flipped
 *  - isFlipped: currently face up?
 *  - isMatched: permanently matched?
 */
function createShuffledDeck() {
  // 1. Take the first 8 symbols (we know SYMBOLS has 8 here)
  const baseSymbols = SYMBOLS.slice(0, PAIRS);

  // 2. Duplicate each symbol to make pairs
  const allSymbols = [...baseSymbols, ...baseSymbols];

  // 3. Build card objects
  let deck = allSymbols.map((symbol, index) => ({
    id: index,
    symbol,
    isFlipped: false,
    isMatched: false,
  }));

  // 4. Shuffle deck using Fisher–Yates algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function MemoryMatch() {
  // The array of all cards
  const [cards, setCards] = useState(() => createShuffledDeck());

  // Index of the first selected card (or null if none)
  const [firstIndex, setFirstIndex] = useState(null);

  // Index of the second selected card (or null)
  const [secondIndex, setSecondIndex] = useState(null);

  // Are we currently waiting for a timeout to finish
  // (i.e. showing two mismatched cards before flipping back)?
  const [isBusy, setIsBusy] = useState(false);

  // Count how many moves (each move = 2 cards flipped)
  const [moves, setMoves] = useState(0);

  // Number of pairs successfully matched
  const [matchesFound, setMatchesFound] = useState(0);

  // Store timeout id so we can clear it if component unmounts
  const timeoutRef = useRef(null);

  // Clean up any pending timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /**
   * Start a brand new game:
   * - new shuffled deck
   * - reset selections, moves, matches, busy flag
   */
  const handleNewGame = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setCards(createShuffledDeck());
    setFirstIndex(null);
    setSecondIndex(null);
    setIsBusy(false);
    setMoves(0);
    setMatchesFound(0);
  };

  /**
   * Handle a click on a card at position `index`.
   */
  const handleCardClick = (index) => {
    // Disable interaction while we are showing mismatched pair
    if (isBusy) return;

    // Get current card and ignore if already matched or flipped
    const card = cards[index];
    if (card.isFlipped || card.isMatched) return;

    // If no first card chosen yet → this is the first selection
    if (firstIndex === null) {
      setCards((prev) =>
        prev.map((c, i) =>
          i === index ? { ...c, isFlipped: true } : c
        )
      );
      setFirstIndex(index);
      return;
    }

    // If firstIndex exists but secondIndex doesn't → this is the second selection
    if (secondIndex === null) {
      // Flip the second card
      setCards((prev) =>
        prev.map((c, i) =>
          i === index ? { ...c, isFlipped: true } : c
        )
      );
      setSecondIndex(index);

      // This completes one move (2 cards clicked)
      setMoves((m) => m + 1);

      // Now we need to check for a match
      checkForMatch(firstIndex, index);
    }
  };

  /**
   * Check if two selected cards form a matching pair.
   * If they match → mark them as matched.
   * If not → briefly show them, then flip them back via setTimeout.
   */
  const checkForMatch = (index1, index2) => {
    const card1 = cards[index1];
    const card2 = cards[index2];

    // If symbols match, they stay face-up and become "matched"
    if (card1.symbol === card2.symbol) {
      const newCards = cards.map((c, i) => {
        if (i === index1 || i === index2) {
          return { ...c, isMatched: true };
        }
        return c;
      });

      setCards(newCards);
      setFirstIndex(null);
      setSecondIndex(null);
      setMatchesFound((count) => count + 1);
      return;
    }

    // If they don't match:
    // - temporarily disable clicking
    // - after a short delay, flip both cards back down
    setIsBusy(true);

    timeoutRef.current = setTimeout(() => {
      setCards((prev) =>
        prev.map((c, i) => {
          if (i === index1 || i === index2) {
            return { ...c, isFlipped: false };
          }
          return c;
        })
      );
      setFirstIndex(null);
      setSecondIndex(null);
      setIsBusy(false);
      timeoutRef.current = null;
    }, 800); // 0.8 seconds delay
  };

  // Check for win condition
  const hasWon = matchesFound === PAIRS;

  return (
    <div className="memory-game">
      <h1>Memory Match (4×4)</h1>

      <div className="memory-top-bar">
        <button onClick={handleNewGame}>New Game</button>
        <div>Moves: {moves}</div>
        <div>Matches: {matchesFound} / {PAIRS}</div>
      </div>

      {hasWon && (
        <div className="memory-status">
          🎉 You found all pairs in {moves} moves!
        </div>
      )}

      <div className="memory-grid">
        {cards.map((card, index) => {
          const isFaceUp = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              className={`memory-card ${
                isFaceUp ? "face-up" : "face-down"
              }`}
              onClick={() => handleCardClick(index)}
              disabled={isBusy || card.isMatched}
            >
              {/* Show symbol only when face-up */}
              {isFaceUp ? card.symbol : "?"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MemoryMatch;
