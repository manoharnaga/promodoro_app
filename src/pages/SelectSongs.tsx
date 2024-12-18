import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import data from '../assets/songs.json';
import axios from 'axios';

const SelectSongs = () => {
    const [songs, setSongs] = useState([]);
    const [selectedSongsCount, setSelectedSongsCount] = useState(0);
    const [selectedSongs, setSelectedSongs] = useState(new Set());
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    const loadSongs = async (filePath) => {
        try {
            const data = await axios.get(/* @vite-ignore */`../assets/${filePath}`);
            console.log('Data:', data.data);
            /* @vite-ignore */
            setSongs(data.data.songs);
        } catch (error) {
            console.error("Error loading song data:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const queryParams = new URLSearchParams(location.search);
            const filePath = queryParams.get('filePath');
    
            if (filePath) {
                await loadSongs(filePath);
                setLoading(false);
            } else {
                console.error("File path not found in query parameters.");
            }
        }
        (async () => {
            await fetchData();
        })();
    }, [location.search]);


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
        const queryParams = new URLSearchParams(location.search);
        const filePath = queryParams.get('filePath');
        navigate(`/main?filePath=${filePath}`);
    }
    if(loading)  return <div className="container text-center mt-5">Loading...</div>;

    return (
        <div className="container bg-white min-h-screen  min-w-full flex flex-col items-center justify-center">
            <h1 
            className="text-center mb-4 text-2xl w-1/4 py-2 rounded-lg" 
            style={{ backgroundColor: 'darkorange', color: 'white' }}
            >Select Songs</h1>
            <h1 className="text-center mb-4 text-2xl w-1/4 py-2 rounded-lg flex items-center justify-center">
                <span className="px-5 py-3" style={{ backgroundColor: 'green', color: 'white', borderRadius: '0.375rem' }}>
                    Total Songs Selected:
                </span>
                <span className="px-5 py-4 text-lg font-bold" style={{ backgroundColor: 'darkorange',color: 'white',borderRadius: '0.375rem' }}>
                    {selectedSongsCount}
                </span>
            </h1>
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
            <button className="mx-auto mb-4 bg-lime-500 rounded px-4 py-2" onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default SelectSongs;
