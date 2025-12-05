import { useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css'
import logo from './assets/LOGO.svg';
import TicTacToe from './TicTacToe.jsx';


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
        <span className='header-title'>Tic-Tac-Toe</span>
      </header>
      <main className='main-body'>
        {<TicTacToe/>}
      </main>
      <div className='footer'></div>
    </div>
  )
}

export default App
