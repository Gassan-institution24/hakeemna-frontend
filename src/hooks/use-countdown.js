import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export function useCountdownDate(date) {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => setNewTime(), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setNewTime = () => {
    const startTime = date;

    const endTime = new Date();

    const distanceToNow = startTime.valueOf() - endTime.valueOf();

    const getDays = Math.floor(distanceToNow / (1000 * 60 * 60 * 24));

    const getHours = `0${Math.floor(
      (distanceToNow % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )}`.slice(-2);

    const getMinutes = `0${Math.floor((distanceToNow % (1000 * 60 * 60)) / (1000 * 60))}`.slice(-2);

    const getSeconds = `0${Math.floor((distanceToNow % (1000 * 60)) / 1000)}`.slice(-2);

    if (date) {
      setCountdown({
        days: getDays.toString().padStart(2, '0'),
        hours: getHours.toString().padStart(2, '0'),
        minutes: getMinutes.toString().padStart(2, '0'),
        seconds: getSeconds.toString().padStart(2, '0'),
      });
    }
  };
  return {
    days: countdown.days,
    hours: countdown.hours,
    minutes: countdown.minutes,
    seconds: countdown.seconds,
  };
}

// Usage
// const countdown = useCountdown(new Date('07/07/2022 21:30'));

// ----------------------------------------------------------------------

export function useCountdownSeconds(initCountdown) {
  const [countdown, setCountdown] = useState(initCountdown);

  const startCountdown = useCallback(() => {
    let remainingSeconds = countdown;

    const intervalId = setInterval(() => {
      remainingSeconds -= 1;

      if (remainingSeconds === 0) {
        clearInterval(intervalId);
        setCountdown(initCountdown);
      } else {
        setCountdown(remainingSeconds);
      }
    }, 1000);
  }, [initCountdown, countdown]);

  const counting = initCountdown > countdown;

  return { counting, countdown, setCountdown, startCountdown };
}
