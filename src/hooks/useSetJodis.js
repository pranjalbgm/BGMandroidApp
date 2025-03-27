import {useEffect, useState} from 'react';

const useSetJodis = () => {
  const [jodiPoints, setJodiPoints] = useState(0);
  const [jodis, setJodis] = useState([]);

  useEffect(() => {
    const pointsAdded = jodis.map(jodi => parseFloat(jodi.points) || 0);
    const totalPointsAdded = pointsAdded.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );

    if(pointsAdded){
      setJodiPoints(totalPointsAdded);
    }

    // console.log(jodis);
  }, [jodis]);

  const setJodiInput = ({
    betKey,
    points,
    betType,
    jodiType = 'Jodi',
    market,
  }) => {
    const updatedJodis = [...jodis];
    const existingIndex = updatedJodis.findIndex(
      jodi => jodi.betKey === betKey,
    );

    if (points === '') {
      if (existingIndex !== -1) {
        updatedJodis.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex !== -1) {
        updatedJodis[existingIndex] = {
          betKey: betKey,
          points,
          betType,
          jodiType,
          market,
        };
      } else {
        updatedJodis.push({
          betKey: betKey,
          points,
          betType,
          jodiType,
          market,
        });
      }
    }

    setJodis(updatedJodis);
  };

  return {jodiPoints, setJodiPoints, setJodiInput, jodis};
};

export default useSetJodis;

// {
//   mobileNumber: 1234567890,
//   userId: 1,
//   bets: [{number: 50, points: 10, betType: jodi, market: jodi},{number: 12, points: 20, betType: jodi, market: Gali}],
// }
