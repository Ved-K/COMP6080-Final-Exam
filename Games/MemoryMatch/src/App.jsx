import { useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css'
import logo from './assets/LOGO.svg';
import MemoryMatch from './MemoryMatch.jsx';


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <header className='header'>
        <img 
          className='header-logo' 
          src={logo} 
          alt='logo'
        ></img>
        <span className='header-title'>Memory Match</span>
      </header>
      <main className='main-body'>
        {<MemoryMatch/>}
      </main>
      <div className='footer'></div>
    </div>
  )
}

export default App
