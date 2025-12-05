import { useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css'
import logo from './assets/LOGO.svg'

import Dashboard from './pages/Dashboard.jsx';
import Blanko from './pages/Blanko.jsx';
import Slido from './pages/Slido.jsx';
import Tetro from './pages/Tetro.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <header className='header'>
        <img 
          className='header-logo' 
          src={logo} 
          alt='logo'
        ></img>
        <nav className='nav'>
          <div className='nav-full'>
            <Link to="/">Home</Link> |
            <Link to="/blanko">Blanko</Link> |
            <Link to="/slido">Slido</Link> |
            <Link to="/tetro">Tetro</Link>
          </div>
          <div className='nav-short'>
            <Link to="/">H</Link> |
            <Link to="/blanko">B</Link> |
            <Link to="/slido">S</Link> |
            <Link to="/tetro">T</Link>
          </div>
        </nav>
      </header>
      <main className='main-body'>
        <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/blanko" element={<Blanko />} />
        <Route path="/slido" element={<Slido />} />
        <Route path="/tetro" element={<Tetro />} />
      </Routes>
      </main>
      <div className='footer'></div>
    </BrowserRouter>
  )
}

export default App
