import { useEffect, useState } from "react";
import "./TicTacToe.css";

const SIZE = 3;
const WIN_LINES = [
  [0, 1, 2], // rows (eg. X's on 0,1,2 or 3,4,5 etc)
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // cols
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diagonals
  [2, 4, 6],
];

// Helper: check if there's a winner on the board
// Returns { winner: 'X' | 'O', line: [a,b,c] } or null
function calculateWinner(board) {
  // Looping each win line
  for (const [a, b, c] of WIN_LINES) {
    
    if (
      board[a] &&                 // Not null
      board[a] === board[b] &&    // Letter (X or O) is same in the 3 spaces
      board[a] === board[c]       // where a = b = c, stops at that win line and returns it.
    ) {
      // Returning winning letter (just slect one of the pieces and return winning combination)
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return null;
}

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState(null); // { winner, line }
  const [score, setScore] = useState({ X: 0, O: 0 });

  // Load win counts from localStorage on mount
  useEffect(() => {
    // ?? checks if null - if so use 0, and the (,10) is to convert to base 10 integer
    const xWins = parseInt(localStorage.getItem("tic-x-wins") ?? "0", 10);
    const oWins = parseInt(localStorage.getItem("tic-o-wins") ?? "0", 10);
    setScore({ X: xWins, O: oWins });
  }, []);
  // ^ means runs once

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinnerInfo(null);
  };

 	const handleCellClick = (index) => {
		// Don’t allow moves if game is already won or cell is taken
		if (winnerInfo || board[index]) return;

		// 1. Make a copy of the board & place X or O
		const newBoard = [...board];
		newBoard[index] = xIsNext ? "X" : "O";

		// 2. Check for winner
		const result = calculateWinner(newBoard);

		if (result) {
			// We have a winner
			setWinnerInfo(result);

			// 3. Update score based on CURRENT score state (no functional updater)
			const updatedScore = {
				...score,
				[result.winner]: score[result.winner] + 1,
			};
			setScore(updatedScore);

			// 4. Persist to localStorage once
			localStorage.setItem("tic-x-wins", String(updatedScore.X));
			localStorage.setItem("tic-o-wins", String(updatedScore.O));
		} else {
			// No winner yet → switch turn
			setXIsNext(!xIsNext);
		}

		// 5. Finally update the board
		setBoard(newBoard);
	};

  const isDraw =
    !winnerInfo && board.every((cell) => cell !== null);

  let statusText;
  if (winnerInfo) {
    statusText = `Winner: Player ${winnerInfo.winner}`;
  } else if (isDraw) {
    statusText = "It's a draw!";
  } else {
    statusText = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div className="tic-tac-toe">
      <h1>Tic Tac Toe</h1>

      <div className="scoreboard">
        <div>Player X Wins: {score.X}</div>
        <div>Player O Wins: {score.O}</div>
      </div>

      <div className="status">
        {statusText}
      </div>

      <div className="board">
        {board.map((value, index) => {
          const isWinningCell =
            winnerInfo && winnerInfo.line.includes(index);

          // CSS-in-JS: style for winning cells
          const winningStyle = isWinningCell
            ? {
                backgroundColor: "green",
                color: "white",
                fontWeight: "bold",
              }
            : {};

          return (
            <button
              key={index}
              className="cell"
              onClick={() => handleCellClick(index)}
              style={winningStyle}
            >
              {value}
            </button>
          );
        })}
      </div>

      <button className="reset-button" onClick={resetBoard}>
        New Game
      </button>
    </div>
  );
}

export default TicTacToe;
