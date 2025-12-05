import img1 from "../src/assets/1.png";
import img2 from "../src/assets/2.png";
import img3 from "../src/assets/3.png";
import img4 from "../src/assets/4.png";
import img5 from "../src/assets/5.png";
import img6 from "../src/assets/6.png";
import img7 from "../src/assets/7.png";
import img8 from "../src/assets/8.png";
import { useState, useEffect } from "react";

function Slido() {
    let imgArray = [img1, img2, img3, img4, img5, img6, img7, img8, null];
    const [board, setBoard] = useState(null); 
    const correctAns = [
        [img1,img2,img3],
        [img4,img5,img6],
        [img7,img8,null],
    ];    

    useEffect(() => {
        if (!board) {
            return
        }
        let currBoard = board.map(r => [...r])
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (currBoard[i][j] != correctAns[i][j]) {
                    return
                }
            }
        }
        alert("congrats you won");
    }, [board])

    const handleKeyDown = (event) => {
        let [emptyY, emptyX] = findEmpty();
        let newBoard = board.map(r => [...r]);
        if (event.key == 'w') {
            if(emptyY > 0) {
                newBoard = swap2DArrayElements(emptyX, (emptyY - 1), emptyX, emptyY); 
            }
        } else if (event.key == 's') {
            if(emptyY < 2) {
                newBoard = swap2DArrayElements(emptyX, (emptyY + 1), emptyX, emptyY); 
            }
        } else if (event.key == 'a') {
            if(emptyX > 0) {
                newBoard = swap2DArrayElements((emptyX - 1), emptyY, emptyX, emptyY); 
            }
        } else if (event.key == 'd') {
            if(emptyX < 2) {
                newBoard = swap2DArrayElements((emptyX + 1), emptyY, emptyX, emptyY); 
            }
        }
        setBoard(newBoard);
    }

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

    function handleClickShowAnswer() {
        setBoard(correctAns); 

    }
    function generate() {
        let shuffledArray = shuffleArray(imgArray); 
        let shuffled2dArray = convertTo2DArray(shuffledArray); 
        setBoard(shuffled2dArray); 
    }
    
    function handleClick(x, y) {
        let newBoard = board;
        let [emptyY, emptyX] = findEmpty();
        if (areAdjacent(x, y, emptyX, emptyY)) {
            newBoard = swap2DArrayElements(x, y, emptyX, emptyY); 
        }  
        setBoard(newBoard); 
    }

    function swap2DArrayElements(col1, row1, col2, row2) {
        let newBoard = board.map(r => [...r]); 
        [newBoard[row1][col1], newBoard[row2][col2]] = [newBoard[row2][col2], newBoard[row1][col1]];
        return newBoard
    }

    //i = row = y
    //j = col = x 
    function findEmpty() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == null) {
                    return [i, j]; 
                }
            }
        }
    }

    function areAdjacent(x, y, x2, y2) {
        if (x === x2 && Math.abs(y - y2) === 1) {
            return true;
        }

        if (y === y2 && Math.abs(x - x2) === 1) {
            return true;
        }

        return false;
    }

    let message = 
    <div className="slidoBoard">
        {board && board.map((row, y) => (
            <div key={y}>
                {row.map((value, x) => (
                    value == null ? <button key="none" className="slidoButton" ></button> : <button key={value} className="slidoButton" onClick={() => handleClick(x, y)}><img className="slidoImage" src={value} alt="{value}"/></button>
                ))}
            </div>
            ))}
    </div>

    
    useEffect(() => {
        generate(); 
    }, [])

    return(
        <>
        <div className="HomePage" tabIndex={"0"} onKeyDown={handleKeyDown}>
            {message}
        <button onClick={() => handleClickShowAnswer()}> Show Me Answer </button>
        </div>
        </>

    )
}

export default Slido