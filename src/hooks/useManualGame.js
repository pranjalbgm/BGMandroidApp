import React, { useRef, useState} from 'react';
import useSetJodis from './useSetJodis';

const useManualGame = () => {
  const {jodiPoints, setJodiInput} = useSetJodis();
  const [manualInputs, setManualInputs] = useState([]);
  const [points, setPoints] = useState({});
  const inputRefs = useRef({});


  const calculatePoints = (manualField, numericValue) => {
    // Calculate points based on the logic you need. For example:
    if (manualField === points.manualField) {
      return points.value; // Use the points value from the current field
    }
    return 0; // Default to 0 points if no specific logic applies
  };
  
  

  const handleNumberChange = (manualField, numberIndex, numericValue) => {
    if (!numericValue) {
      return; // Prevent further processing if numericValue is empty
    }
  
    setManualInputs((prevInputs) => {
      const updatedInputs = [...prevInputs];
  
      // Find the index of the existing Jodi
      const jodiIndex = updatedInputs.findIndex(
        (jodi) => jodi.manualField === manualField && jodi.numberIndex === numberIndex
      );
  
      if (jodiIndex !== -1) {
        // Update the existing Jodi
        updatedInputs[jodiIndex] = {
          ...updatedInputs[jodiIndex],
          betKey: numericValue,
          points: calculatePoints(manualField, numericValue), // Recalculate points
        };
      } else {
        // Add a new Jodi
        updatedInputs.push({
          manualField,
          numberIndex,
          betKey: numericValue,
          points: calculatePoints(manualField, numericValue), // Calculate points for new Jodi
        });
      }
  
      return updatedInputs; // Update the state with modified inputs
    });
  
    // Automatically focus on the next input field if the value reaches its max length (2 digits)
    if (numericValue.length === 2) {
      const nextNumberIndex = numberIndex + 1;
      const nextInputRef = inputRefs.current?.[`${manualField}-${nextNumberIndex}`];
  
      if (nextInputRef) {
        nextInputRef.focus();
      }
    }
  };
  

  // const handleNumberChange = (manualField, numberIndex, numericValue) => {
  //   setManualInputs((prevInputs) => {
  //     const updatedInputs = [...prevInputs];
  //     const jodiIndex = updatedInputs.findIndex(
  //       (jodi) => jodi.manualField === manualField && jodi.numberIndex === numberIndex
  //     );
  
  //     if (jodiIndex !== -1) {
  //       // Update existing Jodi
  //       updatedInputs[jodiIndex].betKey = numericValue;
  //     } else {
  //       // Add new Jodi
  //       updatedInputs.push({
  //         manualField,
  //         numberIndex,
  //         betKey: numericValue,
  //         points: points[manualField] || 0,
  //       });
  //     }
  
  //     return updatedInputs;
  //   });
  // };
  


  const handleKeyDown = (manualField, numberIndex) => {
    const currentInputRef = inputRefs.current[`${manualField}-${numberIndex}`];
    if (currentInputRef && currentInputRef.value === '') {
      const prevNumberIndex = numberIndex - 1;
      if (prevNumberIndex >= 0) {
        const prevInputRef =
          inputRefs.current[`${manualField}-${prevNumberIndex}`];
        if (prevInputRef) {
          prevInputRef.focus();
        }
      }

      setManualInputs(prevInputs =>
        prevInputs.map(jodi => {
          if (
            jodi.manualField === manualField &&
            jodi.numberIndex === numberIndex
          ) {
            jodi.betKey = '';
          }
          return jodi;
        }),
      );
    }
  };

  const handlePointsChange = (manualField, value) => {
    
    setManualInputs(prevInputs =>
      prevInputs.map(jodi =>
        jodi.manualField === manualField ? {...jodi, points: value} : jodi,
      ),
    );

    setPoints({manualField, value});
  };

  


  const calculateTotalPoints = manualField => {
    // Calculate the total points for a specific manual field
    return manualInputs
      .filter(jodi => jodi.manualField === manualField && jodi.betKey)
      .reduce((total, jodi) => total + Number(jodi.points), 0);
  };

  const calculateTotalPointsAdded = () => {
    // Calculate the total points for a specific manual field
    return manualInputs
      .filter(jodi => jodi.betKey)
      .reduce((total, jodi) => total + Number(jodi.points), 0);
  };

  return {
    handleNumberChange,
    handleKeyDown,
    handlePointsChange,
    calculateTotalPoints,
    calculateTotalPointsAdded,
    setPoints,
    manualInputs,
    inputRefs,
  };
};

export default useManualGame;
