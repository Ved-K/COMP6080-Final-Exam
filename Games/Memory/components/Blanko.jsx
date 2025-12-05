import { useState, useEffect } from "react"

function Blanko() {
    const strs = [
        'the fat cats',
        'larger frogs',
        'banana cakes',
        'unsw vs usyd',
        'french toast',
        'hawaii pizza',
        'barack obama',
    ];

    const [message,setMessage] = useState(null); 
    const [firstAnswer, setFirstAnswer] = useState(null); 
    const [secondAnswer, setSecondAnswer] = useState(null); 
    const [thirdAnswer, setThirdAnswer] = useState(null); 
    const [firstInput, setFirstInput] = useState(null);
    const [secondInput, setSecondInput] = useState(null);
    const [thirdInput, setThirdInput] = useState(null);

    
    useEffect(() => {
        generate(); 
    }, [])
    
    useEffect(() => {
        if(firstInput != null && secondInput != null && thirdInput != null ) {
            if(firstInput == firstAnswer && secondInput == secondAnswer && thirdInput == thirdAnswer) {
                alert("Congratulations you got it right!"); 
                window.location.reload();
            }
        }

    }, [firstInput, secondInput, thirdInput]);

    function generate() {
        let word = strs[Math.floor(Math.random() * strs.length)].split(""); 
        const missing = new Set(); 
        while(missing.size < 3) {
            let loc = Math.floor(Math.random() * 12); 
            if (word[loc] != ' ') {
                    missing.add(loc); 
                }
        }

        const missingArr = Array.from(missing); 
        setFirstAnswer(word[missingArr[0]]);
        setSecondAnswer(word[missingArr[1]]);
        setThirdAnswer(word[missingArr[2]]);
        let element = []; 
        for (let i = 0; i < 12; i++) {
            if (missingArr.includes(i)) {
                let index = missingArr.indexOf(i); 
                element.push(<input type ="text" className="blankoBlanks" key={i} onChange={(e) => handleInput(e.target.value, index)}></input>);
            } else {
                element.push(<input type="text" className="blanko" key={i} value={word[i]} readOnly={true}></input> );
            }
        }
        setMessage(element);
    }

    function handleInput(value, index) {
        if (index == 0) {
            setFirstInput(value);
        } else if(index == 1) {
            setSecondInput(value);
        } else if (index == 2) {
            setThirdInput(value);
        }
    }

    return(
        <div className="HomePage">
            {message}
        </div>
    )
}

export default Blanko