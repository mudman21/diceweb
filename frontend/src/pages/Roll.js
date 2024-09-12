import React, { useState, useEffect } from 'react';
import '../styles/Roll.css';
import '../styles/Button.css';

const Roll = () => {
    const [diceList, setDiceList] = useState([]);
    const [selectedDice, setSelectedDice] = useState([]);
    const [rollResults, setRollResults] = useState([]);
    const [savedStrings, setSavedStrings] = useState([]);
    const [selectedStrings, setSelectedStrings] = useState([]);
    const [generatedSentence, setGeneratedSentence] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sentenceDiceId, setSentenceDiceId] = useState(null);
    const [combinedRollResult, setCombinedRollResult] = useState('');

    useEffect(() => {
        fetchDiceList();
        fetchSavedStrings();
        createOrGetSentenceDice();
    }, []);

    const fetchDiceList = async () => {
        try {
            const response = await fetch('/api/list_dice');
            if (!response.ok) throw new Error('Failed to fetch dice list');
            const data = await response.json();
            setDiceList(data);
        } catch (error) {
            setError('Failed to load dice list. Please try again later.');
        }
    };

    const fetchSavedStrings = async () => {
        try {
            const response = await fetch('/api/get_saved_strings');
            if (!response.ok) throw new Error('Failed to fetch saved strings');
            const data = await response.json();
            setSavedStrings(data);
        } catch (error) {
            setError('Failed to load saved strings. Please try again later.');
        }
    };

    const handleDiceSelection = (dice) => {
        setSelectedDice(prev => [...prev, dice]);
    };

    const handleDiceRemoval = (index) => {
        setSelectedDice(prev => prev.filter((_, i) => i !== index));
    };

    const rollDice = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/roll_dice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dice_ids: selectedDice.map(dice => dice.id) }),
            });
            if (!response.ok) throw new Error('Failed to roll dice');
            const data = await response.json();
            setRollResults(data.results);
            const combined = data.results.map(result => result.result).join(' ');
            setCombinedRollResult(combined);
        } catch (error) {
            setError('Failed to roll dice. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const saveRollResult = async () => {
        if (rollResults.length === 0) return;
        const resultString = rollResults.map(result => result.result).join(' ');
        try {
            const response = await fetch('/api/save_string', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ string: resultString }),
            });
            if (!response.ok) throw new Error('Failed to save string');
            await fetchSavedStrings();
            await addToSentenceDice(resultString);
            setRollResults([]); // 저장 후 초기화
        } catch (error) {
            setError('Failed to save string. Please try again.');
        }
    };

    const deleteSavedString = async (stringId) => {
        try {
            const response = await fetch(`/api/delete_saved_string/${stringId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete string');
            await fetchSavedStrings();
        } catch (error) {
            setError('Failed to delete string. Please try again.');
        }
    };

    const toggleStringSelection = (stringId) => {
        setSelectedStrings(prev => 
            prev.includes(stringId)
                ? prev.filter(id => id !== stringId)
                : [...prev, stringId]
        );
    };

    const generateSentence = async () => {
        if (selectedStrings.length === 0) {
            setError('Please select at least one string to generate a sentence.');
            return;
        }
        const combinedString = savedStrings
            .filter(str => selectedStrings.includes(str.id))
            .map(str => str.value)
            .join(' ');
        try {
            const response = await fetch('/api/generate_sentence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ words: combinedString }),
            });
            if (!response.ok) throw new Error('Failed to generate sentence');
            const data = await response.json();
            setGeneratedSentence(data.sentence);
        } catch (error) {
            setError('Failed to generate sentence. Please try again.');
        }
    };

    const saveGeneratedSentence = async () => {
        if (!generatedSentence) return;
        try {
            const response = await fetch('/api/save_string', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ string: generatedSentence }),
            });
            if (!response.ok) throw new Error('Failed to save generated sentence');
            await fetchSavedStrings();
            await addToSentenceDice(generatedSentence);
            setGeneratedSentence(''); // 저장 후 초기화
        } catch (error) {
            setError('Failed to save generated sentence. Please try again.');
        }
    };

    const createOrGetSentenceDice = async () => {
        try {
            const response = await fetch('/api/list_dice');
            if (!response.ok) throw new Error('Failed to fetch dice list');
            const data = await response.json();
            let sentenceDice = data.find(dice => dice.name === '문장');
            
            if (!sentenceDice) {
                const createResponse = await fetch('/api/add_dice', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: '문장' }),
                });
                if (!createResponse.ok) throw new Error('Failed to create sentence dice');
                const createData = await createResponse.json();
                setSentenceDiceId(createData.id);
            } else {
                setSentenceDiceId(sentenceDice.id);
            }
        } catch (error) {
            setError('Failed to create or get sentence dice. Please try again.');
        }
    };

    const addToSentenceDice = async (sentence) => {
        if (!sentenceDiceId) return;
        try {
            await fetch('/api/add_side_to_dice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    dice_id: sentenceDiceId, 
                    value: sentence 
                }),
            });
        } catch (error) {
            console.error('Failed to add sentence to dice:', error);
        }
    };

    const generateSentenceFromRollResults = async () => {
        if (!combinedRollResult) {
            setError('No roll results to generate sentence from.');
            return;
        }
        try {
            const response = await fetch('/api/generate_sentence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ words: combinedRollResult }),
            });
            if (!response.ok) throw new Error('Failed to generate sentence');
            const data = await response.json();
            setGeneratedSentence(data.sentence);
        } catch (error) {
            setError('Failed to generate sentence. Please try again.');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="roll-container">
            <h2>Roll Dice</h2>
            <div className="dice-selection">
                {diceList.map(dice => (
                    <button key={dice.id} onClick={() => handleDiceSelection(dice)}>
                        {dice.name}
                    </button>
                ))}
            </div>
            <div className="selected-dice">
                <h3>Selected:</h3>
                {selectedDice.map((dice, index) => (
                    <button key={index} onClick={() => handleDiceRemoval(index)}>
                        {dice.name} X
                    </button>
                ))}
            </div>
            {selectedDice.length > 0 && (
                <button onClick={rollDice} className="primary">Roll</button>
            )}
            {rollResults.length > 0 && (
                <div className="roll-results">
                    <h3>Results:</h3>
                    {rollResults.map((result, index) => (
                        <span key={index}>{result.result} </span>
                    ))}
                    <button onClick={saveRollResult} className="primary">Save</button>
                    <button onClick={generateSentenceFromRollResults} className="primary">Generate</button>
                </div>
            )}
            <div className="saved-strings">
                <h3>Saved:</h3>
                <ul>
                    {savedStrings.map((string) => (
                        <li key={string.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedStrings.includes(string.id)}
                                    onChange={() => toggleStringSelection(string.id)}
                                />
                                {string.value}
                            </label>
                            <button onClick={() => deleteSavedString(string.id)} className="danger">Del</button>
                        </li>
                    ))}
                </ul>
            </div>
            {savedStrings.length > 0 && (
                <button onClick={generateSentence} className="primary">Generate</button>
            )}
            {generatedSentence && (
                <div className="generated-sentence">
                    <h3>Generated:</h3>
                    <p>{generatedSentence}</p>
                    <button onClick={saveGeneratedSentence} className="primary">Save</button>
                </div>
            )}
        </div>
    );
};

export default Roll;