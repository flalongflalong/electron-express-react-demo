import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const baseURL = '';

const Navbar = () => {
	let [msg, setMsg] = useState('msg');

	React.useEffect(() => {
		axios.get(baseURL+'/test').then((response) => {
			setMsg(response.data);
		});
	}, []);

	return (
		<div className="container">
			<h1>{msg}</h1>
			<nav className="nav">
				<Link to="/">Home</Link>
				<Link to="about">About</Link>
				<Link to="camera">Camera</Link>
				<Link to="hype">Hype</Link>
			</nav>
		</div>
	);
};

export default Navbar;
