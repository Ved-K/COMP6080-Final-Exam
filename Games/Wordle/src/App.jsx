import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import MediaQuery from "react-responsive";
import "./App.css";

import IMAGE_SRC from "./assets/taylogo.jpg";
import Home from "./Home.jsx";
import Wordle from "./Wordle.jsx";

function App() {
	return (
		<>
			<div className="viewport">
				<div className="header">
					<img src={IMAGE_SRC} className="logo"></img>

					<MediaQuery minWidth={801}>
						<div className="header-action-area">
							<Link to="/">
								<button className="header-action-button">Home</button>
							</Link>
							<div> | </div>
							<Link to="/wordle">
								<button className="header-action-button">Wordle</button>
							</Link>
						</div>
					</MediaQuery>

					<MediaQuery maxWidth={800}>
						<div className="header-action-area">
							<Link to="/">
								<button className="header-action-button">H</button>
							</Link>
							<div> | </div>
							<Link to="/wordle">
								<button className="header-action-button">W</button>
							</Link>
						</div>
					</MediaQuery>
				</div>

				<div className="footer"></div>
			</div>

			<Routes>
				<Route path="/" element={<Home />}></Route>
				<Route path="/wordle" element={<Wordle />}></Route>
			</Routes>
		</>
	);
}

export default App;
