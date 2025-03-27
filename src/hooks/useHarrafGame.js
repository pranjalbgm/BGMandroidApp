import React, {useEffect, useState} from 'react';

const useHarrafGame = market => {
  const [andarNumber, setAndarNumber] = useState(null);
  const [andarNumbers, setAndarNumbers] = useState([]);
  const [baharNumber, setBaharNumber] = useState(null);
  const [baharNumbers, setBaharNumbers] = useState([]);

  useEffect(() => {
    if (andarNumber && andarNumbers) {
      const andarNumberExists = andarNumbers.find(
        andarNumberInList => andarNumberInList.number === andarNumber.number,
      );

      if (andarNumberExists) {
        setAndarNumbers(prevNumbers =>
          prevNumbers.map(existingAndarNumber =>
            existingAndarNumber.number === andarNumber.number
              ? andarNumber
              : existingAndarNumber,
          ),
        );
      } else {
        setAndarNumbers(prevNumbers => [...prevNumbers, andarNumber]);
      }
    }

    if (baharNumber && baharNumbers) {
      const baharNumberExists = baharNumbers.find(
        baharNumberInList => baharNumberInList.number === baharNumber.number,
      );

      if (baharNumberExists) {
        setBaharNumbers(prevNumbers =>
          prevNumbers.map(existingBaharNumber =>
            existingBaharNumber.number === baharNumber.number
              ? baharNumber
              : existingBaharNumber,
          ),
        );
      } else {
        setBaharNumbers(prevNumbers => [...prevNumbers, baharNumber]);
      }
    }
  }, [andarNumber, baharNumber]);

  const setHarrafBets = () => {
    let bets = [];
    andarNumbers?.map(andarNumber => {
      for (
        andarNumber.number;
        andarNumber.number < 100;
        andarNumber.number + 10
      ) {
        bets.push({andarNumber, points: andarNumber.points / 10});
      }
    });
  };

  const handleAndarHarrafBets = () => {
    const bets = [];
    andarNumbers?.map(andarNumber => {
      for (
        let betNumber = parseInt(andarNumber.number) * 10;
        betNumber < parseInt(andarNumber.number) * 10 + 10;
        betNumber++
      ) {
        bets.push({
          betKey: betNumber.toString().padStart(2, '0'),
          points: andarNumber.points / 10,
          betType: 'Harraf',
          harrafType: 'Andar',
          market: market?.market,
        });
      }
    });
    return bets;
  };

  const handleBaharHarrafBets = () => {
    const bets = [];
    baharNumbers?.map(baharNumber => {
      for (
        let betNumber = parseInt(baharNumber.number);
        betNumber < 100;
        betNumber += 10
      ) {
        bets.push({
          betKey: betNumber.toString().padStart(2, '0'),
          points: baharNumber.points / 10,
          betType: 'Harraf',
          harrafType: 'Bahar',
          market: market?.market,
        });
      }
    });
    return bets;
  };

  const allBets = () => {
    const andarBets = handleAndarHarrafBets();
    const baharBets = handleBaharHarrafBets();

    return [...andarBets, ...baharBets];
  };

  const calculateAndarTotalPoints = () => {
    let andarPoints = 0;
    andarNumbers.forEach(andarNumber => {
      andarPoints += parseInt(andarNumber.points) || 0;
    });
    return andarPoints;
  };

  const calculateBaharTotalPoints = () => {
    let baharPoints = 0;
    baharNumbers.forEach(baharNumber => {
      baharPoints += parseInt(baharNumber.points) || 0;
    });
    return baharPoints;
  };

  const calculateTotalPoints = () => {
    const andarPoints = calculateAndarTotalPoints();
    const baharPoints = calculateBaharTotalPoints();
    return andarPoints + baharPoints;
  };

  return {
    andarNumbers,
    baharNumbers,
    setAndarNumber,
    setBaharNumber,
    setHarrafBets,
    allBets,
    calculateTotalPoints,
  };
};

export default useHarrafGame;
