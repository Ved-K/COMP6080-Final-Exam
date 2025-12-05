import { useState, useEffect } from "react";
// need to run npm install react-router-dom
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo-image.jpg";

// need to run npm install react-responsive
import MediaQuery from "react-responsive";

import Home from "./Home";
import Blanko from "./Blanko";
import Slido from "./Slido";
import Tetro from "./Tetro";

function App() {
	const [count, setCount] = useState(0);

	return (
		<div>
			<div className="header-bar">
				<img src={logo} className="header-logo"></img>
				<MediaQuery minWidth={801}>
					<nav className="header-actions-area">
						{/* add links to each route for each button */}
						<Link to="/">
							<button className="header-action-button">Home</button>
						</Link>
						<div> | </div>
						<Link to="/blanko">
							<button className="header-action-button">Blanko</button>
						</Link>
						<div> | </div>
						<Link to="/slido">
							<button className="header-action-button">Slido</button>
						</Link>
						<div> | </div>
						<Link to="/tetro">
							<button className="header-action-button">Tetro</button>
						</Link>
					</nav>
				</MediaQuery>

				<MediaQuery maxWidth={800}>
					<nav className="header-actions-area">
						<Link to="/">
							<button className="header-action-button">H</button>
						</Link>
						<div> | </div>
						<Link to="/blanko">
							<button className="header-action-button">B</button>
						</Link>
						<div> | </div>
						<Link to="/slido">
							<button className="header-action-button">S</button>
						</Link>
						<div> | </div>
						<Link to="/tetro">
							<button className="header-action-button">T</button>
						</Link>
					</nav>
				</MediaQuery>
			</div>

			{/* define all app routes */}
			<Routes>
				<Route path="/" element={<Home />}></Route>
				<Route path="/blanko" element={<Blanko />}></Route>
				<Route path="/slido" element={<Slido />}></Route>
				<Route path="/tetro" element={<Tetro />}></Route>
			</Routes>

			<div className="footer-bar"></div>
		</div>
	);
}

export default App;
