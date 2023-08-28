import React, { useState, useEffect } from 'react';
import Api from '../helpers/api';

const Home = () => {
    const [name, setName] = useState('Bob');

    // 类似于 componentDidMount 和 componentDidUpdate
    useEffect(() => {
        // Do something when loaded
    }, []);  // 空依赖数组意味着此effect只会在组件mount和unmount时运行

    const handleInput = (e) => {
        setName(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setName(e.target.value);
        Api.getThing().then(data => {
            console.log(data);
        });
    };

    return (
        <div className="container text-center">
            <h2>Name: {name}</h2>

            <form className="search" onSubmit={handleSearch}>
                <input onChange={handleInput} type="search" placeholder="Search" />
                <button type="submit" className="btn">Search</button>
            </form>

            <div className="bg-test" />
            
            <img src="assets/apple-icon.png" width="100" alt="Black box" />
        </div>
    );
}

export default Home;
