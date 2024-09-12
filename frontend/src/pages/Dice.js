import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dice.css';
import '../styles/Button.css';

function Dice() {
    const navigate = useNavigate();
    const [diceData, setDiceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newDiceName, setNewDiceName] = useState('');
    const [rollResults, setRollResults] = useState({});

    useEffect(() => {
        fetchDiceData();
    }, []);

    const fetchDiceData = async () => {
        try {
            const response = await fetch('/api/list_dice');
            if (!response.ok) {
                throw new Error('서버에서 데이터를 가져오는데 실패했습니다.');
            }
            const data = await response.json();
            const diceWithSides = await Promise.all(data.map(async (dice) => {
                const sidesResponse = await fetch(`/api/dice_sides_count/${dice.id}`);
                if (sidesResponse.ok) {
                    const sidesData = await sidesResponse.json();
                    return { ...dice, sides_count: sidesData.sides_count };
                }
                return dice;
            }));
            setDiceData(diceWithSides);
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/delete_dice/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('주사위를 삭제하는데 실패했습니다.');
            }
            setDiceData(diceData.filter(dice => dice.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddDice = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/add_dice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newDiceName }),
            });
            if (!response.ok) {
                throw new Error('주사위를 추가하는데 실패했습니다.');
            }
            fetchDiceData();
            setNewDiceName('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRoll = async (diceId) => {
        try {
            const response = await fetch('/api/roll_dice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dice_ids: [diceId] }),
            });
            if (!response.ok) {
                throw new Error('주사위를 굴리는데 실패했습니다.');
            }
            const data = await response.json();
            const result = data.results[0].result;
            
            setRollResults(prev => ({
                ...prev,
                [diceId]: result
            }));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCardClick = (diceId) => {
        navigate(`/sides?dice=${diceId}`);
    };

    if (isLoading) return <div>로딩 중...</div>;
    if (error) return <div>에러: {error}</div>;

    return (
        <div className="dice-container">
            <h1>주사위 관리</h1>
            <form onSubmit={handleAddDice} className="dice-form">
                <input
                    type="text"
                    value={newDiceName}
                    onChange={(e) => setNewDiceName(e.target.value)}
                    placeholder="새 주사위 이름"
                    required
                />
                <button type="submit" className="primary add-btn">+</button>
            </form>
            <div className="dice-grid">
                {diceData.map((dice) => (
                    <div key={dice.id} className="dice-card" onClick={() => handleCardClick(dice.id)}>
                        <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(dice.id); }}>X</button>
                        <h2>{dice.name}</h2>
                        <p>{dice.sides_count || 0}면 주사위</p>
                        <button className="roll-btn" onClick={(e) => { e.stopPropagation(); handleRoll(dice.id); }}>ROLL</button>
                        {rollResults[dice.id] && (
                            <div className="roll-result">
                                <span>{rollResults[dice.id]}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dice;