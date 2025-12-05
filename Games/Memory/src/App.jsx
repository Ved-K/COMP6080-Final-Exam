import './App.css'
import Blanko from "/components/Blanko.jsx";
import Home from "/components/Home.jsx"
import Slido from "/components/Slido.jsx"
import Memory from "/components/Memory.jsx"
import { Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react"

function App() {
    const [homeButton, setHomeButton] = useState(" Home "); 
    const [blankoButton, setBlankoButton] = useState(" Blanko ");
    const [slidoButton, setSlidoButton] = useState(" Slido ");
    const [memoryButton, setMemoryButton] = useState(" Memory ");
    const [tetroButton, setTetroButton] = useState(" Tetro "); 

    useEffect(() => {
        const updateButtons = () => {
            const currentWidth = window.innerWidth;
            if (currentWidth < 800) {
                setHomeButton(" H ");
                setBlankoButton(" B ");
                setSlidoButton(" S ");
                setMemoryButton(" M ");
                setTetroButton(" T ");
            } else {
                setHomeButton(" Home ");
                setBlankoButton(" Blanko ");
                setSlidoButton(" Slido ");
                setTetroButton(" Tetro ");
                setMemoryButton(" Memory ");
            }
        };

        updateButtons(); 
        window.addEventListener("resize", updateButtons); 
        return () => window.removeEventListener("resize", updateButtons);
    }, []);

  return (
    <>
    <div className="Home_Header">
        <img 
            src="https://cdn-icons-png.flaticon.com/512/11196/11196687.png"
            alt="new"
            className="Home_logo" 
        />
        <div  className="homeButtons">
            <Link to="/">
                <button className="buttons">{homeButton}</button>
            </Link>
            |
            <Link to="/blanko">
                <button className="buttons">{blankoButton}</button>
            </Link>
            |
            <Link to="/slido">
              <button className="buttons">{slidoButton}</button>
            </Link>
            |
            <Link to="/memory">
              <button className="buttons">{memoryButton}</button>
            </Link>
            |
            <button className="buttons">{tetroButton}</button>
        </div>
    </div>
    <div className='pageContent'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blanko" element={<Blanko />} />
        <Route path="/slido" element={<Slido />} />
        <Route path="/memory" element={<Memory />}/>
      </Routes> 
    </div>
    <div className='homeFooter'>

    </div>
    
    </>

  )
}

export default App
