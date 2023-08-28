import * as React from 'react';
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Home from '../views/home';
import About from '../views/about';

import '../styles/main.css';

export default function RoutesComponent() {
	return (
		<Router history={history}>
			<div>
				<Navbar />
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
				</Routes>
				<Footer />
			</div>
		</Router>
	);
}
