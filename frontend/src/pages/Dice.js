import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dice.css';
import '../styles/Button.css';

const Dice = () => {
    const [diceList, setDiceList] = useState([]);
    const [newDiceName, setNewDiceName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [diceToDelete, setDiceToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDiceList();
    }, []);

    const fetchDiceList = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/list_dice');
            if (!response.ok) {
                throw new Error('Failed to fetch dice list');
            }
            const data = await response.json();
            setDiceList(data);
        } catch (error) {
            console.error('Error fetching dice list:', error);
            setError('Failed to load dice list. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const addDice = async (e) => {
        e.preventDefault();
        if (!newDiceName.trim()) return;

        try {
            const response = await fetch('/api/add_dice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newDiceName }),
            });
            if (!response.ok) {
                throw new Error('Failed to add dice');
            }
            setNewDiceName('');
            fetchDiceList();
        } catch (error) {
            console.error('Error adding dice:', error);
            setError('Failed to add dice. Please try again.');
        }
    };

    const openDeleteModal = (dice) => {
        setDiceToDelete(dice);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setDiceToDelete(null);
    };

    const deleteDice = async () => {
        if (!diceToDelete) return;

        try {
            const response = await fetch(`/api/delete_dice/${diceToDelete.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete dice');
            }
            fetchDiceList();
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting dice:', error);
            setError('Failed to delete dice. Please try again.');
        }
    };

    const rollDice = async (diceId) => {
        try {
            const response = await fetch('/api/roll_dice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dice_ids: [diceId] }),
            });
            if (!response.ok) {
                throw new Error('Failed to roll dice');
            }
            const data = await response.json();
            const updatedDiceList = diceList.map(dice => 
                dice.id === diceId ? { ...dice, rollResult: data.results[0].result } : dice
            );
            setDiceList(updatedDiceList);
        } catch (error) {
            console.error('Error rolling dice:', error);
            setError('Failed to roll dice. Please try again.');
        }
    };

    const handleDiceClick = (diceId) => {
        navigate(`/sides?dice=${diceId}`);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="dice-container">
            <h2>주사위 관리</h2>
            <form onSubmit={addDice} className="dice-form">
                <input
                    type="text"
                    value={newDiceName}
                    onChange={(e) => setNewDiceName(e.target.value)}
                    placeholder="새 주사위 이름"
                    required
                />
                <button type="submit" className="primary add-btn">추가</button>
            </form>
            <div className="dice-grid">
                {diceList.map(dice => (
                    <div key={dice.id} className="dice-card" onClick={() => handleDiceClick(dice.id)}>
                        <div className="dice-card-header">
                            <h2>{dice.name}</h2>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(dice);
                            }} className="delete-btn">X</button>
                        </div>
                        <div className="dice-card-content">
                            <p className="sides-count">{dice.sides_count}면</p>
                            <div className="roll-result">
                                {dice.rollResult && <span>{dice.rollResult}</span>}
                            </div>
                        </div>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            rollDice(dice.id);
                        }} className="roll-btn">굴리기</button>
                    </div>
                ))}
            </div>
            {deleteModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <p>정말로 "{diceToDelete?.name}" 주사위를 삭제하시겠습니까?</p>
                        <div className="modal-buttons">
                            <button onClick={deleteDice} className="confirm">삭제</button>
                            <button onClick={closeDeleteModal} className="cancel">취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dice;