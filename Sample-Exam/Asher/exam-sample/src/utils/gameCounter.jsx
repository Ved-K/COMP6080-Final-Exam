const STORAGE_KEY = "gamesWon";

/**
 * Safely read the stored number from localStorage.
 * Returns a valid number every time (never NaN).
 */
export function getGamesWon() {
  const stored = localStorage.getItem(STORAGE_KEY);
  const parsed = Number(stored);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Increment the games-won counter by 1.
 * Used by Blanko, Slido, and Tetro after a correct round.
 */
export function incrementGamesWon() {
  const current = getGamesWon();
  localStorage.setItem(STORAGE_KEY, String(current + 1));
}

/**
 * Set the games-won counter to an explicit value.
 * Used by the Dashboard reset logic to set the value fetched from the URL.
 */
export function setGamesWon(value) {
  const parsed = Number(value);
  const safeValue = Number.isNaN(parsed) ? 0 : parsed;
  localStorage.setItem(STORAGE_KEY, String(safeValue));
}
