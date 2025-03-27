import {useState} from 'react';

const useCopyPasteGame = () => {
  const [jodis, setJodis] = useState([]);

  function reversePair(pair) {
    // Function to reverse a two-digit number
    return pair.toString().split('').reverse().join('');
  }

  function createPairsAndReverse(inputNumber, points, isPalti) {
    const numberString = inputNumber.toString();
    const result = [];

    // Helper to check if a pair already exists in the result array
    const pairExists = pair =>
      result.some(jodi => jodi.pair === String(pair).padStart(2, '0'));

    for (let i = 0; i < numberString.length - 1; i += 2) {
      const pair = parseInt(numberString.slice(i, i + 2));
      const reversedPair = parseInt(reversePair(pair));

      if (!pairExists(pair)) {
        result.push({
          pair: String(pair).padStart(2, '0'),
          points,
        });
      }

      if (isPalti && !pairExists(reversedPair)) {
        result.push({
          pair: String(reversedPair).padStart(2, '0'),
          points,
        });
      }
    }

    // Handle odd-length numbers for the "With Palti" case
    if (isPalti && numberString.length % 2 !== 0) {
      const lastDigit = numberString.slice(-1);
      const singlePair = lastDigit + lastDigit;

      if (!pairExists(singlePair)) {
        result.push({pair: singlePair, points});
      }
    } else if (numberString.length % 2 !== 0) {
      return 'Number length should be even.';
    }

    setJodis(result);
  }

  const deleteJodi = removeJodi => {
    setJodis(jodis.filter(jodi => jodi !== removeJodi));
  };

  const calculatCopyPastePointsTotal = points => points * jodis.length;

  return {
    jodis,
    createPairsAndReverse,
    deleteJodi,
    calculatCopyPastePointsTotal,
  };
};

export default useCopyPasteGame;
