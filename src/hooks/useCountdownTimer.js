import {useState, useEffect} from 'react';

const useCountdownTimer = () => {
  const [targetTime, setTargetTime] = useState(null); // Use null as the initial value
  const [timeRemaining, setTimeRemaining] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    if (targetTime !== null) {
      // Only update time if targetTime is set
      const intervalId = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining(targetTime));
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
    console.log("this is usecountdown ----------------------------true")
  }, [targetTime]);

  function calculateTimeRemaining(targetTime) {
    const now = new Date();
    const targetDate = new Date(now.toDateString() + ' ' + targetTime);

    let timeDiff = targetDate - now;

    if (timeDiff < 0) {
      timeDiff = 0;
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    };
  }

  return {timeRemaining, setTargetTime};
};

export default useCountdownTimer;
