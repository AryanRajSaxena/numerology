import { 
  lifePathFromDOB, 
  computeNameNumbers, 
  birthdayNumber, 
  maturityNumber,
  reduceNumber,
  normalizeName 
} from './numerology.js';

// Unit tests for numerology calculations
export function runTests() {
  const tests = [
    {
      name: 'Life Path calculation for 07/09/2003',
      test: () => {
        const result = lifePathFromDOB('07/09/2003', true);
        // Digits: 0,7,0,9,2,0,0,3 = 21 → 3
        return result.value === 3 && result.intermediate.sum === 21;
      }
    },
    {
      name: 'Name normalization removes diacritics',
      test: () => {
        const result = normalizeName('Áryan Räj');
        return result === 'ARYAN RAJ';
      }
    },
    {
      name: 'Chaldean calculation for ARYAN',
      test: () => {
        const result = computeNameNumbers('ARYAN', 'chaldean', true);
        // A(1) + R(2) + Y(1) + A(1) + N(5) = 10 → 1
        return result.expression.value === 1;
      }
    },
    {
      name: 'Master number 11 preservation',
      test: () => {
        const result = reduceNumber(29, true); // 2+9=11, should preserve
        return result === 11;
      }
    },
    {
      name: 'Birthday number for day 07',
      test: () => {
        const result = birthdayNumber('07/09/2003', true);
        return result === 7;
      }
    },
    {
      name: 'Maturity number calculation',
      test: () => {
        const result = maturityNumber(3, 1, true); // 3+1=4
        return result === 4;
      }
    }
  ];

  const results = tests.map(test => ({
    name: test.name,
    passed: test.test(),
    timestamp: new Date().toISOString()
  }));

  console.log('Numerology Engine Test Results:', results);
  return results;
}