import { useState } from 'react'
import './App.css'
import logo from './assets/LOGO.svg';
import MineSweeper from './MineSweeper.jsx';


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
        <span className='header-title'>MineSweeper</span>
      </header>
      <main className='main-body'>
        {<MineSweeper/>}
      </main>
      <div className='footer'></div>
    </div>
  )
}

export default App
