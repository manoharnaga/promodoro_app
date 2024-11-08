import {useEffect, useState} from 'react';
import {TbBorderCorners, TbBrain, TbBrandGithub, TbCoffee, TbPlant} from 'react-icons/tb';
import {Tooltip} from 'react-tooltip';
import {useSettings} from '@/contexts/settings';
import {Player} from '@/features/player';
import {Settings} from '@/features/settings';
import {Timer} from '@/features/timer';
import {ButtonIcon, PageContainer} from '@/shared/components';
import {Notifications} from '@/shared/lib/notifications';
import {GITHUB_URL} from '@/shared/utils/constants';
import * as backgrounds from '@/assets/backgrounds';
import data from '../assets/songs.json';
import Loader from '@/shared/components/Loader';

const MainPage = () => {
  const [background] = useState(backgrounds.bluebalcony);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const {state, dispatch} = useSettings();
  const [selectedSongs, setSelectedSongs] = useState<[]>([]);
  const [isSongsLoaded, setIsSongsLoaded] = useState(false); 

  const completeMode = (modeCompleted: TimerMode) => dispatch('completeMode', {modeCompleted});
  const incrementModeCounter = (mode: TimerMode) => dispatch('incrementModeCounter', {mode});
  const setTime = (mode: TimerMode, time: number) => dispatch('updateModeTime', {mode, time});
  const changeInterval = (interval: number) => dispatch('setLongBreakInterval', {interval});
  const changeVideoId = (id: string) => dispatch('changeVideoId', {id});

  const toggleAutoBreaks = () => dispatch('toggleAutoBreaks');
  const toggleAutoFocus = () => dispatch('toggleAutoStarts');
  const toggleSettings = () => setIsSettingsOpen((prev) => !prev);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else if (document.exitFullscreen) document.exitFullscreen();
  };

  const openGitHub = () => window.open(GITHUB_URL);

  useEffect(() => {
      const storedSongsIds = JSON.parse(localStorage.getItem('selectedSongs') || '[]');
      console.log("Main.tsx -> all songs",data.songs);
      console.log("Main.tsx -> selectedSongIds",storedSongsIds);
      const selectedSongs = data.songs.filter((song) => storedSongsIds.includes(song.id));

      if (selectedSongs.length > 0) {
        setSelectedSongs(selectedSongs);
        console.log('Selected Songs:', selectedSongs);
        changeVideoId(selectedSongs[0].url); 
      }

      setIsSongsLoaded(true);
      Notifications().requestPermission();
  }, []);

  useEffect(() => {
    console.log("Main.tsx -> videoId changed",state.videoId);
  },[state.videoId]);

  if (!isSongsLoaded) {
    return <Loader />;
  }

  return (
    <>
      <PageContainer background={background}>
        <div className="fixed w-screen top-6 z-10">
          <div className="grid grid-cols-3 mx-12">
            <div className="col-start-2 flex items-center justify-center space-x-4">
              <div className="flex items-center justify-center outline-none  px-3 py-px text-lg  bg-black/75 text-white  rounded-lg">
                {state.modes.focus.completed} <TbBrain className="ml-2" size={22} />
              </div>
              <div className="flex items-center justify-center outline-none  px-3 py-px text-lg  bg-black/75 text-white  rounded-lg">
                {state.modes.short_break.completed} <TbCoffee className="ml-2" size={22} />
              </div>
              <div className="flex items-center justify-center outline-none  px-3 py-px text-lg  bg-black/75 text-white  rounded-lg ">
                {state.modes.long_break.completed} <TbPlant className="ml-2" size={22} />
              </div>
            </div>

            <div className="flex justify-end items-center">
              {/* <ButtonIcon
                onClick={openGitHub}
                icon={TbBrandGithub}
                className="ml-4"
                data-tooltip-id="nav-tooltip"
                data-tooltip-content="GitHub"
                data-tooltip-offset={15}
              /> */}
              <ButtonIcon
                onClick={toggleFullScreen}
                icon={TbBorderCorners}
                className="ml-4"
                data-tooltip-id="nav-tooltip"
                data-tooltip-content="FullScreen"
                data-tooltip-offset={15}
              />

              <Tooltip id="nav-tooltip" className="bg-black font-bold text-xs rounded-lg" />
            </div>
          </div>
        </div>

        <div className="fixed max-h-screen top-24 left-1/2 z-10 transform -translate-x-1/2">
          <Timer
            mode={state.mode}
            modes={state.modes}
            isAutoBreaks={state.isAutoBreaks}
            isAutoFocus={state.isAutoFocus}
            onCompleteMode={completeMode}
            onIncrementModeCounter={incrementModeCounter}
            openSettings={toggleSettings}
          />

          {isSettingsOpen && (
            <Settings
              modes={state.modes}
              longBreakInterval={state.longBreakInterval}
              isAutoBreaks={state.isAutoBreaks}
              isAutoFocus={state.isAutoFocus}
              onChangeTime={setTime}
              onChangeLongBreakInterval={changeInterval}
              onToggleAutoFocus={toggleAutoFocus}
              onToggleAutoBreaks={toggleAutoBreaks}
            />
          )}
        </div>

        <div className="fixed bottom-6 w-screen flex justify-center items-center">
          <Player videoId={state.videoId} onChangeVideoId={changeVideoId} videoQueue={selectedSongs}/>
        </div>
      </PageContainer>
    </>
  );
};

export default MainPage;
