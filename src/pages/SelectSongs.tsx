import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '../assets/songs.json';

const SelectSongs = () => {
    const [songs, setSongs] = useState([]);
    const [selectedSongsCount, setSelectedSongsCount] = useState(0);
    const [selectedSongs, setSelectedSongs] = useState(new Set());

    const navigate = useNavigate();

    useEffect(() => {
        console.log(data.songs);
        setSongs(data.songs);
    }, []);

    const handleSongClick = (songId) => {
        setSelectedSongs((prevSelectedSongs) => {
            const newSelectedSongs = new Set(prevSelectedSongs);
            if (newSelectedSongs.has(songId)) {
                newSelectedSongs.delete(songId);
                setSelectedSongsCount(prevCount => prevCount - 1);
            } 
            else {
                newSelectedSongs.add(songId);
                setSelectedSongsCount(prevCount => prevCount + 1);
            }
            return newSelectedSongs;
        });
    };

    const handleSubmit = () => {
        console.log('Select Songs: -> Selected Songs:', Array.from(selectedSongs));
        localStorage.setItem('selectedSongs', JSON.stringify(Array.from(selectedSongs)));
        navigate('/main');
    }

    return (
        <div className="mt-10 container bg-white p-4 d-flex flex-column align-items-center justify-content-center min-vh-100 m-auto">
            <h1 className="text-center mb-4">Select Songs</h1>
            <p className="text-center">Total Songs Selected: {selectedSongsCount}</p>
            
            {/* Scrollable song list */}
            <div className="row overflow-auto w-75 w-md-50 w-lg-25" style={{ maxHeight: '500px' }}>
                {songs.map((song) => (
                    <div
                        key={song.id}
                        className={`col-12 mb-3 p-3 card ${selectedSongs.has(song.id) ? 'bg-indigo-400' : 'bg-light'}`}
                        style={{ cursor: 'pointer', transition: '0.3s' }}
                        onClick={() => handleSongClick(song.id)}
                        onMouseEnter={(e) => e.currentTarget.classList.add('shadow')}
                        onMouseLeave={(e) => e.currentTarget.classList.remove('shadow')}
                    >
                        <h5>{song.name}</h5>
                        {/* Uncomment below if you want these elements */}
                        {/* <a href={song.url} target="_blank" rel="noopener noreferrer" className="text-secondary">
                            Listen
                        </a> */}
                        {/* <p>Score: {song.score}</p> */}
                    </div>
                ))}
            </div>
            <button className="btn btn-primary mt-4" onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default SelectSongs;
