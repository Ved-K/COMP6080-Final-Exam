import { useState, useEffect } from "react";
// need to run npm install axios
import axios from "axios";
import "./Home.css";

export const STORAGE_KEY = "gamesWon";
const SCORE_URL = "https://cgi.cse.unsw.edu.au/~cs6080/raw/data/info.json";

function Home() {
	const [gamesWon, setGamesWon] = useState(null);

	async function fetchInitialScore() {
		try {
			const res = await axios.get(SCORE_URL);
			const initialScore = Number(res.data.score) || 0;
			console.log(initialScore);
			localStorage.setItem(STORAGE_KEY, initialScore);
			setGamesWon(initialScore);
		} catch (e) {
			console.log(e);
		}
	}

	// javascripts default fetch also works here:
	// Helper that fetches initial score from the server and stores it
	//   const fetchInitialScore = async () => {
	//     try {
	//       const res = await fetch(SCORE_URL);
	//       const data = await res.json(); // { score: 5 }
	//       const initialScore = Number(data.score) || 0;

	//       setGamesWon(initialScore);
	//       localStorage.setItem(STORAGE_KEY, String(initialScore));
	//     } catch (err) {
	//       console.error("Failed to fetch initial score", err);
	//       // fall back to 0 if fetch fails
	//       setGamesWon(0);
	//       localStorage.setItem(STORAGE_KEY, "0");
	//     }
	//   };

	// useeffect without dependencies array - so this means only run on first load, which is what we want!
	useEffect(() => {
		const storedScore = localStorage.getItem(STORAGE_KEY);
		if (storedScore === null) {
			fetchInitialScore();
		} else {
			setGamesWon(storedScore);
		}
	}, []);

	function handleReset() {
		localStorage.clear();
		fetchInitialScore();
	}

	return (
		<div className="viewport">
			<h1>Please choose an option from the navbar.</h1>
			<div className="score-board">
				<h3>Games won: {gamesWon}</h3>
				<button onClick={handleReset}>{"(reset)"}</button>
			</div>
		</div>
	);
}

export default Home;
