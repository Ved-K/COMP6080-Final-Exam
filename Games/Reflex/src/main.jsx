// Import StrictMode from React.
// StrictMode helps highlight potential problems in development.
// It does NOT affect production performance.
import { StrictMode } from 'react'

// Import the createRoot API, which mounts your React application
// into a DOM element (replaces the old ReactDOM.render).
import { createRoot } from 'react-dom/client'

// Import global CSS styles for the entire application.
import './index.css'

// Import the main App component that contains all your game logic.
import App from './App.jsx'

// Create a React root attached to the HTML element with id="root"
// and render the App component inside StrictMode.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />    {/* This mounts your entire React application */}
  </StrictMode>
)
