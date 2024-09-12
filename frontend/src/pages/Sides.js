import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Button.css';
import '../styles/Sides.css'; // 새로운 CSS 파일을 import합니다.

const Sides = () => {
    const [diceList, setDiceList] = useState([]);
    const [selectedDice, setSelectedDice] = useState('');
    const [sides, setSides] = useState([]);
    const [newSides, setNewSides] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingSide, setEditingSide] = useState(null);
    const [editValue, setEditValue] = useState('');

    const location = useLocation();

    useEffect(() => {
        fetchDiceList();
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const diceId = searchParams.get('dice');
        if (diceId) {
            setSelectedDice(diceId);
        }
    }, [location]);

    useEffect(() => {
        if (selectedDice) {
            fetchSides(selectedDice);
        }
    }, [selectedDice]);

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

    const fetchSides = async (diceId) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/list_sides/${diceId}`);
            if (response.status === 404) {
                setError('Dice not found');
                setSides([]);
                return;
            }
            if (!response.ok) {
                throw new Error('Failed to fetch sides');
            }
            const data = await response.json();
            setSides(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching sides:', error);
            setError('Failed to load sides. Please try again later.');
            setSides([]);
        } finally {
            setIsLoading(false);
        }
    };

    const addSides = async (e) => {
        e.preventDefault();
        try {
            const sideValues = newSides.split(',')
                .map(side => side.trim())
                .filter(side => side !== '');
            if (sideValues.length === 0) {
                setError('No valid sides to add.');
                return;
            }
            const response = await fetch('/api/add_sides', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dice_id: selectedDice, values: sideValues }),
            });
            if (!response.ok) {
                throw new Error('Failed to add sides');
            }
            setNewSides('');
            fetchSides(selectedDice);
        } catch (error) {
            console.error('Error adding sides:', error);
            setError('Failed to add sides. Please try again.');
        }
    };

    const deleteSide = async (sideValue) => {
        try {
            const response = await fetch(`/api/delete_side/${selectedDice}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value: sideValue }),
            });
            if (!response.ok) {
                throw new Error('Failed to delete side');
            }
            fetchSides(selectedDice);
        } catch (error) {
            console.error('Error deleting side:', error);
            setError('Failed to delete side. Please try again.');
        }
    };

    const startEditing = (side) => {
        setEditingSide(side);
        setEditValue(side.value);
    };

    const cancelEditing = () => {
        setEditingSide(null);
        setEditValue('');
    };

    const updateSide = async (e) => {
        e.preventDefault();
        if (!editingSide || !editValue.trim()) return;

        try {
            const response = await fetch(`/api/update_side/${selectedDice}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ old_value: editingSide.value, new_value: editValue.trim() }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || '면 업데이트에 실패했습니다.');
            }
            
            fetchSides(selectedDice);
            cancelEditing();
        } catch (error) {
            console.error('Error updating side:', error);
            setError(`면 업데이트 실패: ${error.message}`);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="sides-container">
            <h2>주사위 면 관리</h2>
            <div className="dice-selection">
                {diceList.map(dice => (
                    <label key={dice.id} className="dice-radio">
                        <input
                            type="radio"
                            name="dice"
                            value={dice.id}
                            checked={selectedDice === dice.id.toString()}
                            onChange={(e) => setSelectedDice(e.target.value)}
                        />
                        {dice.name}
                    </label>
                ))}
            </div>

            {error && <div className="error">{error}</div>}

            <form onSubmit={addSides} className="add-sides-form">
                <input
                    type="text"
                    value={newSides}
                    onChange={(e) => setNewSides(e.target.value)}
                    placeholder="새로운 면 값 입력 (쉼표로 구분)"
                    required
                />
                <button type="submit" className="primary">면 추가</button>
            </form>

            {selectedDice && (
                <>
                    {sides.length === 0 ? (
                        <p>이 주사위에는 면이 없습니다.</p>
                    ) : (
                        <ul className="sides-list">
                            {sides.filter(side => side.value !== '').map(side => (
                                <li key={side.value} className="side-item">
                                    {editingSide && editingSide.value === side.value ? (
                                        <form onSubmit={updateSide} className="edit-form">
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                required
                                            />
                                            <button type="submit" className="primary">업데이트</button>
                                            <button type="button" onClick={cancelEditing} className="secondary">취소</button>
                                        </form>
                                    ) : (
                                        <>
                                            {side.value}
                                            <div className="side-actions">
                                                <button onClick={() => startEditing(side)} className="secondary edit-side">수정</button>
                                                <button onClick={() => deleteSide(side.value)} className="danger delete-side">삭제</button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};

export default Sides;