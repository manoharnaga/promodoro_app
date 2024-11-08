import {useEffect, useMemo, useState} from 'react';
import {YouTubeEvent, YouTubePlayer} from 'react-youtube';
import eventBus from '@/shared/lib/event-bus';
import {fadeVolume} from '../utils/fadeVolume';

interface UsePlayerProps {
  mode: string;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  videoId: string;
  videoQueue: { url: string }[];
  onChangeVideoId: (url: string) => void;
}

export const usePlayer = ({
    mode,
    currentIndex,
    setCurrentIndex,
    videoId,
    videoQueue,
    onChangeVideoId,
  }: UsePlayerProps) => {
  const [isPlayBeforeLoaded, setIsPlayBeforeLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [player, setPlayer] = useState<YouTubePlayer>();

  const play = () => player?.playVideo();
  const pause = () => player?.pauseVideo();
  const setVolume = (value: number) => fadeVolume(player, value);

  const onPlayerReady = (event: YouTubeEvent) => {
    console.log("onPlayerReady",event.target,videoId);
    
    if(event.target && mode === 'short_break') {
      console.log(videoId,event.target.videoTitle);
      event.target.seekTo(0);
      event.target.playVideo();
    }
    setIsReady(true);
    setPlayer(event.target);
  };

  const onPlayerEnd = () => {
    const nextIndex = (currentIndex + 1) % videoQueue.length;
    console.log("nextIndex",nextIndex,"id",videoQueue[nextIndex],player.videoTitle,videoId);
    setCurrentIndex(nextIndex);
    onChangeVideoId(videoQueue[nextIndex].url);
  };

  const title = useMemo(() => {
    return player?.videoTitle ?? 'Waiting for a YouTube video title...';
  }, [player]);

  useEffect(() => {
    console.log("usePlayer.ts -> mode changed",mode);
    if(mode==='short_break') {
      play();
    }
    else{
      pause();
    }
  },[mode]);

  useEffect(() => {
    if (isPlayBeforeLoaded) play();

    const playCleanUp = eventBus.startTimer.subscribe(() => {
      // alert("playCleanUp");
      if (!player) setIsPlayBeforeLoaded(true);
      console.log("mode dadfskljdfskjladkjladskjl",mode);
      if(mode==='short_break')  play();
    });

    const pauseCleanUp = eventBus.pauseTimer.subscribe(() => {
      // alert("pauseCleanUp");
      if (!player) setIsPlayBeforeLoaded(false);
      if(mode==='short_break')  pause();
    });

    const focusStartCleanUp = eventBus.focusStart.subscribe(() => {
      // alert("focusStartCleanUp");
      if(mode==='short_break'){
        play();
        setVolume(100);
      }
    });

    const focusEndCleanUp = eventBus.focusEnd.subscribe(async () => {
      // alert("focusEndCleanUp");
      if(mode==='short_break'){
        await setVolume(10);
        pause();
      }
    });

    return () => {
      playCleanUp();
      pauseCleanUp();
      focusStartCleanUp();
      focusEndCleanUp();
    };
  }, [player, mode]);

  return {
    isReady,
    title,
    play,
    pause,
    setVolume,
    onPlayerReady,
    onPlayerEnd,
  };
};
