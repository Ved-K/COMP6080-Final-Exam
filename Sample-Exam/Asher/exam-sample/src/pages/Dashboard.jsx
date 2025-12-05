import { useEffect, useState } from "react";
import axios from "axios";
import './Dashboard.css';

const STORAGE_KEY = "gamesWon";
const SCORE_URL = "https://cgi.cse.unsw.edu.au/~cs6080/raw/data/info.json";

function Dashboard() {
	const [gamesWon, setGamesWon] = useState(null);

	 /**
   * Fetches the initial score from the remote URL.
   * This is used:
   *   - the very first time the app runs (localStorage empty)
   *   - whenever the user clicks reset
   *
   * After fetching, we store the score BOTH in state and localStorage.
   * If the fetch fails, fallback to 0.
   */
  const fetchAndSetInitialScore = async () => {
    try {
      const res = await axios.get(SCORE_URL);
      const initialScore = Number(res.data.score) || 0;

      setGamesWon(initialScore);
      localStorage.setItem(STORAGE_KEY, String(initialScore));
    } catch (error) {
			// Fallback behaviour if server req fails
      console.error("Failed to fetch score:", error);
      setGamesWon(0);
      localStorage.setItem(STORAGE_KEY, "0");
    }
  };

	/**
   * Runs on first render only.
   *
   * Behaviour:
   * - If a previous score exists in localStorage → use that.
   * - Otherwise → fetch the initial score from the server.
   *
   * This ensures persistence across page reloads AND matches the spec:
   *   “When the app initially loads for the very first time…
   *    the value should be set to the value returned by the URL.”
	*/
	useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored !== null) {
      const parsed = Number(stored);
      setGamesWon(Number.isNaN(parsed) ? 0 : parsed);
    } else {
      fetchAndSetInitialScore(); // first-time load
    }
  }, []);

	/**
	 * Reset button handler.
	 *
	 * According to the spec, "reset" does NOT mean zero.
	 * It means:
	 *    → fetch the score again from the given URL
	 *      and replace the current score with the server value.
	*/
  const handleReset = () => {
    fetchAndSetInitialScore(); // spec: reset = fetch new score
  };

	/**
   * While `gamesWon` is null, it means we haven't loaded
   * localStorage or the server result yet.
   * Display a simple loading message until ready.
	*/
	// simple loading state
  if (gamesWon === null) {
    return (
      <div className="dashboard">
        <p className="dashboard-title">Please choose an option from the navbar.</p>
        <p className="dashboard-score">Loading games won...</p>
      </div>
    );
  }

	return (
		<div>
      <p className="dashboard-title">
        Please choose an option from the navbar.
      </p>

      <p className="dashboard-score">
        Games won: {gamesWon}{" "}
        <button 
					className="reset-button" 
					onClick={handleReset}
					style={{ marginLeft: "10px" }}
				>
					Reset
        </button>
      </p>
    </div>
	);
}

export default Dashboard;