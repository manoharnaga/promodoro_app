import {ChangeEvent, FC, useState} from 'react';
import {TbCheck, TbX} from 'react-icons/tb';
import {deserializeVideoIdFromUrl, serializeVideoIdToUrl} from '@/shared/utils/string-utils';

interface Props {
  videoId: string;
  onSubmit: (videoId: string) => void;
  onCancel: () => void;
}

const SearchForm: FC<Props> = ({videoId, onSubmit, onCancel}) => {
  const [videoUrl, setVideoUrl] = useState(serializeVideoIdToUrl(videoId));

  const onInputVideoUrl = (e: ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  const extractYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const fetchYouTubeVideoTitle = async (videoId: string) => {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${'AIzaSyDAikpkbLumNLk_hUZvgJUWnOB4whN7KS0'}`);
      const data = await response.json();
      console.log('YouTube video title:', data.items[0].snippet.title);
      return data.items[0].snippet.title;
    } catch (error) {
      console.error('Error fetching YouTube video title:', error);
      throw error;
    }
  };

  const searchSpotifyTrack = async (trackName: string) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track`, {
        headers: {
          'Authorization': `Bearer ${'BQAN9IrZ6fQSkkUEvK_tDv4JpqS3PRSLNPDDXMlGJgDQYmBBYkE99QV18j6Dt-k7zU5BFRvlaTxPhtDxnNzf1SCjKTy-6A_-OYg25_YJd87nrhmmkHY'}`
        }
      });
      const data = await response.json();
      console.log('Spotify track ID:', data.tracks.items[0].id);
      return data.tracks.items[0].id; // Return the first matching track's ID
    } catch (error) {
      console.error('Error searching Spotify track:', error);
      throw error;
    }
  };

  const fetchSpotifyAudioFeatures = async (spotifyTrackId: string) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/audio-features/${spotifyTrackId}`, {
        headers: {
          'Authorization': `Bearer ${'BQAN9IrZ6fQSkkUEvK_tDv4JpqS3PRSLNPDDXMlGJgDQYmBBYkE99QV18j6Dt-k7zU5BFRvlaTxPhtDxnNzf1SCjKTy-6A_-OYg25_YJd87nrhmmkHY'}`
        }
      });
      const data = await response.json();
      console.log('Spotify audio features:', data);
      return data;
    } catch (error) {
      console.error('Error fetching Spotify audio features:', error);
      throw error;
    }
  };

  const scoreSong = (audioFeatures: any) => {
    const { valence, tempo, key, energy, acousticness, danceability } = audioFeatures;
    let score = 0;

    // Happiness (Valence)
    score += (valence - 0.5) * 2;

    // Fast Tempo
    score += (tempo - 120) / 60;

    // Major Key
    score += key === 0 || key === 2 || key === 4 || key === 5 || key === 7 || key === 9 || key === 11 ? 1 : -1;

    // Brightness (Energy)
    score += (energy - 0.5) * 2;

    // Lightness (Acousticness)
    score += (0.5 - acousticness) * 2;

    // Low Rhythmic Complexity (Danceability)
    score += (danceability - 0.5) * 2;

    return score;
  };

  const onSubmitSearch = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const id = deserializeVideoIdFromUrl(videoUrl);
      if (id === videoId) return;

      const youtubeId = extractYouTubeID(videoUrl);
      if (youtubeId) {
        const videoTitle = await fetchYouTubeVideoTitle(youtubeId);
        const spotifyTrackId = await searchSpotifyTrack(videoTitle);
        const audioFeatures = await fetchSpotifyAudioFeatures(spotifyTrackId);
        const score = scoreSong(audioFeatures);
        console.log(`The song score is ${score}`);
        onSubmit(id);
      } else {
        alert('Invalid YouTube URL');
      }
    } catch (error) {
      console.error('Error determining song mood:', error);
      alert('An error occurred while determining the song mood.');
    }
  };

  const onCloseSearch = () => {
    onCancel();
    setVideoUrl(serializeVideoIdToUrl(videoId));
  };

  return (
    <form
      onSubmit={onSubmitSearch}
      onKeyDown={(e) => e.key === 'Escape' && onCloseSearch()}
      className="flex items-center w-full space-x-3"
    >
      <input
        type="text"
        value={videoUrl}
        onInput={onInputVideoUrl}
        spellCheck="false"
        autoFocus
        className="bg-secondary w-full placeholder:text-[10px] outline-none text-[8px]  px-3 py-1 rounded-[4px]"
        placeholder="Paste a YouTube video URL here"
      />
      <button className="outline-none" type="submit">
        <TbCheck size={16} />
      </button>

      <button onClick={onCloseSearch} className="outline-none" type="button">
        <TbX size={16} />
      </button>
    </form>
  );
};

export default SearchForm;