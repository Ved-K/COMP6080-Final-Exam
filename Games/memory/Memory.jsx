import { useState, useEffect } from "react";

function Memory() {
    let startArray = [{value: 0, flipped: false, pair: 1, solved: false, key: 0}, 
                    {value: 0, flipped: false, pair: 1, solved: false, key: 1}, 
                    {value: 1, flipped: false, pair: 2, solved: false, key: 2},
                    {value: 1, flipped: false, pair: 2, solved: false, key: 3},
                    {value: 2, flipped: false, pair: 3, solved: false, key: 4},
                    {value: 2, flipped: false, pair: 3, solved: false, key: 5},
                    {value: 3, flipped: false, pair: 4, solved: false, key: 6},
                    {value: 3, flipped: false, pair: 4, solved: false, key: 7},
                    {value: 4, flipped: false, pair: 5, solved: false, key: 8},
                    {value: 4, flipped: false, pair: 5, solved: false, key: 9},
                    {value: 5, flipped: false, pair: 6, solved: false, key: 10},
                    {value: 5, flipped: false, pair: 6, solved: false, key: 11},
                    {value: 6, flipped: false, pair: 7, solved: false, key: 12},
                    {value: 6, flipped: false, pair: 7, solved: false, key: 13},
                    {value: 7, flipped: false, pair: 8, solved: false, key: 14},
                    {value: 7, flipped: false, pair: 8, solved: false, key: 15}];

    const [board, setBoard] = useState(null); 

    function shuffleArray(array) {
        const shuffledArray = [...array]; 

        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    }

    function convertTo2DArray(perfectSquareArray) {
        const n = Math.sqrt(perfectSquareArray.length);

        if (n % 1 !== 0) {
            throw new Error("Input array length is not a perfect square.");
        }

        const twoDArray = [];
        for (let i = 0; i < n; i++) {
            const row = [];
            for (let j = 0; j < n; j++) {
            const index = i * n + j;
            row.push(perfectSquareArray[index]);
            }
            twoDArray.push(row);
        }
    return twoDArray;
    }

    function generate() {
        let shuffledArray = shuffleArray(startArray); 
        let shuffled2dArray = convertTo2DArray(shuffledArray); 
        setBoard(shuffled2dArray); 
    }
    
    function handleClick(x, y) {
        let newBoard = board.map(r => [...r]);
        let flipped = 0;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (newBoard[i][j].flipped && !newBoard[i][j].solved) {
                    flipped++;
                }
            }
        }

        if (flipped === 2) {
            newBoard = hideAllUnSolvedCards();
        }

        revealCard(x, y, newBoard);
        setBoard(newBoard);
    }


    function hideAllUnSolvedCards() {
        let newBoard = board.map(r => [...r]);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if(newBoard[i][j].flipped == true && newBoard[i][j].solved == false) {
                    newBoard[i][j].flipped = false; 
                }
            }
        }
        return newBoard;
    }

    function revealCard(x, y, newBoard) {
        const val = newBoard[y][x].value;
        newBoard[y][x].flipped = true;
        checkIfFound(val, newBoard);
    }


    function checkIfFound(val, newBoard) {
        let count = 0; 
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (val == newBoard[i][j].value && newBoard[i][j].flipped == true) {
                    count++;
                }
            }
        }
        if (count == 2) {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (val == newBoard[i][j].value) {
                        newBoard[i][j].solved = true;
                    }
                }
            }
        }
    }

    let message = 
    <div className="memoryBoard">
        {board && board.map((row, y) => (
            <div key={y}>
                {row.map((item, x) => (
                    item.flipped ? <button key={item.key} className="memoryButtonClicked" onClick={() => handleClick(x, y)}>{item.value}</button> : <button key={item.key} className="memoryButton" onClick={() => handleClick(x, y)}></button>
                ))}
            </div>
            ))}
    </div>

    
    useEffect(() => {
        generate(); 
    }, [])

    return(
        <>
        <div className="HomePage">
            {message}
        </div>
        </>

    )
}

export default Memory