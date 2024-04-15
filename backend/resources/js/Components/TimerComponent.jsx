import React, { useState, useEffect } from 'react';

const TimerComponent = ({ tournament, ended }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const currentTime = new Date();
    const tournamentStartTime = new Date(tournament.started);
    if (ended){
        const tournamentEndTime = new Date(tournament.ended)
        const timeRemaining = Math.max(0, tournamentEndTime - tournamentStartTime);
        setTimeRemaining(timeRemaining);
    }
    else {
        const initialTimeRemaining = Math.max(0, currentTime - tournamentStartTime);
        setTimeRemaining(initialTimeRemaining);

        const intervalId = setInterval(() => {
          setTimeRemaining(prevTime => prevTime + 1000);
        }, 1000);
    }

    // return () => clearInterval(intervalId);
  }, [tournament]);

  // Funcție pentru formatarea timpului rămas
  const formatTime = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    const pad = (num) => (num < 10 ? '0' : '') + num;

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md shadow-md text-center">
      {
        ended && <h2 className="text-lg font-semibold mb-2">Final time:</h2>
      }
      {
        !ended &&
        <h2 className="text-lg font-semibold mb-2">Timer:</h2>
      }
      <p className="text-xl font-bold">{formatTime(timeRemaining)}</p>
    </div>
  );
};

export default TimerComponent;
