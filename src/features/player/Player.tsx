import {FC} from 'react';
import clsx from 'clsx';
import YouTubePlayer from 'react-youtube';
import {useUndoState} from '@/shared/hooks';
import SearchForm from './components/SearchForm';
import Toolbar from './components/Toolbar';
import {usePlayer} from './hooks/usePlayer';
import {PLAYER_OPTIONS} from './utils/constants';
import { useState } from 'react';
import eventBus from '@/shared/lib/event-bus';
import { useTimer } from '../timer/hooks';

type Status = 'VIDEO_SHOW' | 'VIDEO_HIDE' | 'VIDEO_SEARCH';
interface Props {
  videoId: string;
  onChangeVideoId: (videoId: string) => void;
}

const Player: FC<Props> = ({videoId, onChangeVideoId}) => {
  const {isReady, title, onPlayerReady, onPlayerEnd} = usePlayer();
  const [status, setStatus, undoStatus] = useUndoState<Status>('VIDEO_HIDE');
  const [videoQueue, setVideoQueue] = useState<string[]>([videoId]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const {timerState, toggle, start, reset} = useTimer({
  //   mode: 'focus',
  //   minutes: 0,
  //   onPause: () => eventBus.pauseTimer.emit(),
  //   onStart: () => eventBus.startTimer.emit(),
  //   onComplete: () => {
  //     // const message = mode === 'focus' ? POMODORO_MSG.BREAK : POMODORO_MSG.FOCUS;
  //     // notifications.showNotification(`${message}!`, {icon: IMAGES.NOTIFICATION});

  //     // if (mode === 'focus') sounds.playBreak();
  //     // else sounds.playFocus();

  //     // completeMode();
  //   },
  // });

  const toggleOpenPlayer = () => {
    setStatus((prev) => {
      if (prev === 'VIDEO_SHOW') return 'VIDEO_HIDE';
      if (prev === 'VIDEO_HIDE') return 'VIDEO_SHOW';
      return prev;
    });
  };

  const submitSearchVideo = (id: string) => {
    setVideoQueue((prevQueue) => [...prevQueue, id]);
    // setCurrentIndex(videoQueue.length);
    onChangeVideoId(id);
    setStatus('VIDEO_SHOW');
  };

  const playFromQueue = (index: number) => {
    setCurrentIndex(index);
    onChangeVideoId(videoQueue[index]);
    // toggle();
  };
  

  return (
    <div>
      <div
        className={clsx(
          'w-96 h-56 bg-black/75 rounded-lg transition-all duration-150 ease-in-out',
          status === 'VIDEO_SHOW' ? 'p-2 opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <YouTubePlayer
          videoId={videoId}
          onReady={onPlayerReady}
          onEnd={onPlayerEnd}
          className="w-full h-full rounded-lg overflow-hidden"
          iframeClassName="w-full h-full"
          opts={PLAYER_OPTIONS}
        />
      </div>

      <div className="mt-1 flex items-center  bg-black/75 p-2  rounded-lg text-[10px] justify-between text-white/75 w-96">
        {status === 'VIDEO_SEARCH' ? (
          <SearchForm
            onSubmit={submitSearchVideo}
            onCancel={() => undoStatus()}
            videoId={videoId}
          />
        ) : (
          <Toolbar
            isPlayerOpened={status === 'VIDEO_SHOW'}
            onToggleOpenPlayer={toggleOpenPlayer}
            onOpenSearchForm={() => setStatus('VIDEO_SEARCH')}
            title={title}
            isPlayerPaused={!isReady}
          />
        )}
      </div>
      
      <div className="flex overflow-x-auto space-x-2 bg-black/75 p-2 rounded-lg w-96 text-white/75 text-xs">
        {videoQueue.map((id, index) => (
          <button
            key={index}
            onClick={() => playFromQueue(index)}
            className={clsx(
              'px-2 py-1 rounded transition-all duration-150',
              index === currentIndex ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300',
              'hover:bg-blue-500 hover:text-white'
            )}
          >
            {`Video ${index + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Player;
