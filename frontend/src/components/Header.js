import React from 'react';
import { Link } from 'react-router-dom'; // Link 추가
import '../styles/Header.css'; // 이 부분이 올바른지 확인

const Header = () => {
    return (
        <header className="app-header">
            <h1>Dice</h1>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/dice">Dice</Link></li>
                    <li><Link to="/sides">Side</Link></li>
                    <li><Link to="/roll">Roll</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;