import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SelectType = () => {
    const [selectedType, setSelectedType] = useState(0);

    const navigate = useNavigate();

    const typeOfSongs = [
        { id: 1, name: 'Instrumental', filePath:'instrumental_songs.json' },
        { id: 2, name: 'Lyrical' , filePath:'lyrical_songs.json'},
    ];

    const handleTypeClick = (typeId) => setSelectedType(typeId);

    const handleContinue = () => {
        if (selectedType === 0) {
            alert('Please select a type of song before continuing.');
            return;
        }

        // Find the filePath for the selected type
        const selectedTypeObj = typeOfSongs.find((type) => type.id === selectedType);

        if (!selectedTypeObj) {
            console.error('Selected type not found in typeOfSongs.');
            return;
        }

        const getFilePath = selectedTypeObj.filePath;

        // Navigate to the next route with the filePath as a query parameter
        navigate(`/select-songs?filePath=${getFilePath}`);
    };

    return (
        <div className="text-2xl container bg-white min-h-screen  min-w-full flex flex-col items-center justify-center">
            <h1 className="text-center mb-4">Select Type of Songs</h1>
            <div className="row overflow-auto" style={{ maxHeight: '500px' }}>
                {typeOfSongs.map((type) => (
                    <div
                        key={type.id}
                        className={`col-12 mb-3 p-3 card rounded border-2 border-black ${selectedType==type.id ? 'bg-indigo-400' : 'bg-light'}`}
                        style={{ cursor: 'pointer', transition: '0.3s' }}
                        onClick={() => handleTypeClick(type.id)}
                        onMouseEnter={(e) => e.currentTarget.classList.add('shadow')}
                        onMouseLeave={(e) => e.currentTarget.classList.remove('shadow')}
                    >
                        <h5>{type.name}</h5>
                    </div>
                ))}
            </div>
            <button className="mx-auto mb-4 bg-lime-500 rounded px-4 py-2" onClick={handleContinue}>
                Continue
            </button>
        </div>
    );
}

export default SelectType;
