import {createEventHelper} from './helpers';
import {EventHelperFunction, EventName} from './types';

type TimerEvents = {
  [key in EventName]: ReturnType<EventHelperFunction>;
};

const timerEvents: TimerEvents = {
  startTimer: createEventHelper('startTimer'),
  stopTimer: createEventHelper('stopTimer'),
  pauseTimer: createEventHelper('pauseTimer'),
  completeTimerMode: createEventHelper('completeTimerMode'),
  focusStart: createEventHelper('focusStart'),
  focusEnd: createEventHelper('focusEnd'),
  toggleVolume: createEventHelper('toggleVolume'),
};

export default timerEvents;
