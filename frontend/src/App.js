import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Dice from './pages/Dice';
import Sides from './pages/Sides';
import Roll from './pages/Roll';
import './App.css';
import './styles/Header.css';
import './styles/Dice.css';  // 이 줄을 추가하세요

function App() {
    return (
        <Router>
            <div>
                <Header />
                <div className="content-container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dice" element={<Dice />} />
                        <Route path="/sides" element={<Sides />} />
                        <Route path="/roll" element={<Roll />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;