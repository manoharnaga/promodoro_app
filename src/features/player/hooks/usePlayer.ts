import {useEffect, useMemo, useState} from 'react';
import {YouTubeEvent, YouTubePlayer} from 'react-youtube';
import eventBus from '@/shared/lib/event-bus';
import {fadeVolume} from '../utils/fadeVolume';

interface UsePlayerProps {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  videoId: string;
  videoQueue: { url: string }[];
  onChangeVideoId: (url: string) => void;
}

export const usePlayer = ({
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
    
    if(event.target) {
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
    if (isPlayBeforeLoaded) play();

    const playCleanUp = eventBus.startTimer.subscribe(() => {
      if (!player) setIsPlayBeforeLoaded(true);

      play();
    });

    const pauseCleanUp = eventBus.pauseTimer.subscribe(() => {
      if (!player) setIsPlayBeforeLoaded(false);

      pause();
    });

    const focusStartCleanUp = eventBus.focusStart.subscribe(() => {
      play();
      setVolume(100);
    });

    const focusEndCleanUp = eventBus.focusEnd.subscribe(async () => {
      await setVolume(10);
      pause();
    });

    return () => {
      playCleanUp();
      pauseCleanUp();
      focusStartCleanUp();
      focusEndCleanUp();
    };
  }, [player]);

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
