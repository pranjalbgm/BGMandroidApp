import React, {createContext, useState, useContext} from 'react';

// Context ko create kare
const MyContext = createContext();

// Context Provider banaye jo state aur functions ko manage karega
export const MyGameProvider = ({children}) => {
  const [gameData, setGameData] = useState('Data A initial value');
  const [type, setType] = useState('Data B initial value');

  const updateData = newData => {
    setGameData(newData);
  };

  const updateType = newData => {
    setType(newData);
  };

  return (
    <MyContext.Provider
      value={{
        gameData,
        type,
        updateData,
        updateType,
      }}>
      {children}
    </MyContext.Provider>
  );
};

// Custom hook banaye context use karne ke liye
export const useMyContext = () => useContext(MyContext);
