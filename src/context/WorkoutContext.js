import React, { createContext, useState } from 'react';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  const saveWorkout = (workout) => {
    // workout should contain: id, name, date, duration, totalVolume, setsDone, prs
    setHistory((prevHistory) => [workout, ...prevHistory]);
  };

  return (
    <WorkoutContext.Provider value={{ history, saveWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};
