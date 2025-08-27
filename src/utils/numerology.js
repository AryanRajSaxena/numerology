// Mapping tables
const CHALDEAN = {
  A:1,I:1,J:1,Q:1,Y:1,
  B:2,K:2,R:2,
  C:3,G:3,L:3,S:3,
  D:4,M:4,T:4,
  E:5,H:5,N:5,X:5,
  U:6,V:6,W:6,
  O:7,Z:7,
  F:8,P:8
};

const PYTHAGOREAN = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};

// Normalization & Y-rule
export function normalizeName(raw) {
  const cleaned = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                     .replace(/[^A-Za-z\s]/g,' ')
                     .replace(/\s+/g,' ')
                     .trim()
                     .toUpperCase();
  return cleaned;
}

export function isYVowel(name, index) {
  const vowels = new Set(['A','E','I','O','U']);
  const prev = index > 0 ? name[index-1] : null;
  const next = index < name.length-1 ? name[index+1] : null;
  if((prev && vowels.has(prev)) || (next && vowels.has(next))) return false;
  return true;
}

// Core utilities
export function letterValue(ch, system) {
  const table = (system === 'chaldean') ? CHALDEAN : PYTHAGOREAN;
  return table[ch] || 0;
}

export function reduceNumber(n, preserveMasters = true) {
  if(preserveMasters && (n === 11 || n === 22 || n === 33)) return n;
  while(n > 9) {
    let s = 0;
    while(n > 0) {
      s += n % 10;
      n = Math.floor(n/10);
    }
    n = s;
    if(preserveMasters && (n === 11 || n === 22 || n === 33)) return n;
  }
  return n;
}

// Core calculators
export function lifePathFromDOB(dobString, preserveMasters = true) {
  const parts = dobString.split('/');
  const digits = parts.join('').split('').map(Number).filter(n => !isNaN(n));
  const sum = digits.reduce((a,b) => a+b, 0);
  return { value: reduceNumber(sum, preserveMasters), intermediate: {digits, sum} };
}

export function computeNameNumbers(fullNameRaw, system = 'chaldean', preserveMasters = true) {
  const name = normalizeName(fullNameRaw);
  let expressionSum = 0, vowelSum = 0, consonantSum = 0;
  
  for(let i = 0; i < name.length; i++) {
    const ch = name[i];
    if(ch === ' ') continue;
    const tableVal = letterValue(ch, system);
    const vowels = new Set(['A','E','I','O','U']);
    const isVowel = (vowels.has(ch) || (ch === 'Y' && isYVowel(name, i)));
    
    if(isVowel) vowelSum += tableVal;
    else consonantSum += tableVal;
    expressionSum += tableVal;
  }
  
  const expression = reduceNumber(expressionSum, preserveMasters);
  const soulUrge = reduceNumber(vowelSum, preserveMasters);
  const personality = reduceNumber(consonantSum, preserveMasters);
  
  return {
    expression: {value: expression, raw: expressionSum},
    soulUrge: {value: soulUrge, raw: vowelSum},
    personality: {value: personality, raw: consonantSum},
    expressionSum, vowelSum, consonantSum
  };
}

export function birthdayNumber(dobString, preserveMasters = true) {
  const day = parseInt(dobString.split('/')[0], 10);
  return reduceNumber(day, preserveMasters);
}

export function maturityNumber(lifePathVal, expressionVal, preserveMasters = true) {
  return reduceNumber(lifePathVal + expressionVal, preserveMasters);
}

export function loShuFromDOB(dobString) {
  const digits = dobString.split('/').join('').split('').map(Number).filter(n => n >= 1 && n <= 9);
  const counts = {};
  for(let i = 1; i <= 9; i++) counts[i] = 0;
  digits.forEach(d => counts[d]++);
  const missing = Object.keys(counts).filter(k => counts[k] === 0).map(Number);
  return {counts, missing};
}

// Main calculation function
export function calculateAllNumbers(profile) {
  const { fullName, dob, system, preserveMasters } = profile;
  
  const lifePath = lifePathFromDOB(dob, preserveMasters);
  const nameNumbers = computeNameNumbers(fullName, system, preserveMasters);
  const birthday = birthdayNumber(dob, preserveMasters);
  const maturity = maturityNumber(lifePath.value, nameNumbers.expression.value, preserveMasters);
  const loShu = loShuFromDOB(dob);
  
  // Advanced calculations
  const pinnacles = calculatePinnacles(dob, preserveMasters);
  const challenges = calculateChallenges(dob, preserveMasters);
  const personalYear = calculatePersonalYear(dob, new Date().getFullYear(), preserveMasters);
  const personalMonth = calculatePersonalMonth(personalYear, new Date().getMonth() + 1, preserveMasters);
  const personalDay = calculatePersonalDay(personalMonth, new Date().getDate(), preserveMasters);
  const balanceNumber = calculateBalanceNumber(fullName, preserveMasters);
  const hiddenPassion = calculateHiddenPassion(fullName, system);
  const subconsciousSelf = calculateSubconsciousSelf(fullName, system);
  
  // Check for karmic debt
  const karmicDebt = checkKarmicDebt({
    lifePath,
    expression: nameNumbers.expression,
    soulUrge: nameNumbers.soulUrge,
    personality: nameNumbers.personality
  });

  return {
    lifePath,
    expression: nameNumbers.expression,
    soulUrge: nameNumbers.soulUrge,
    personality: nameNumbers.personality,
    birthday,
    maturity,
    loShu,
    pinnacles,
    challenges,
    personalYear,
    personalMonth,
    personalDay,
    balanceNumber,
    hiddenPassion,
    subconsciousSelf,
    karmicDebt,
    calculatedAt: new Date().toISOString()
  };
}

// Name tuner suggestions
export function generateNameSuggestions(fullName, system = 'chaldean', preserveMasters = true) {
  const suggestions = [];
  const currentExpression = computeNameNumbers(fullName, system, preserveMasters).expression.value;
  
  // Try variations by changing first and last letters
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const normalized = normalizeName(fullName);
  
  // First letter variations
  for (let i = 0; i < Math.min(3, alphabet.length); i++) {
    const newLetter = alphabet[i];
    if (newLetter === normalized[0]) continue;
    
    const newName = newLetter + normalized.slice(1);
    const newExpression = computeNameNumbers(newName, system, preserveMasters).expression.value;
    const delta = newExpression - currentExpression;
    
    if (delta !== 0) {
      suggestions.push({
        name: newName,
        newExpression,
        delta,
        change: `First letter: ${normalized[0]} → ${newLetter}`
      });
    }
  }
  
  // Last letter variations (if name has multiple letters)
  if (normalized.length > 1) {
    for (let i = 0; i < Math.min(3, alphabet.length); i++) {
      const newLetter = alphabet[i];
      const lastIdx = normalized.length - 1;
      if (newLetter === normalized[lastIdx]) continue;
      
      const newName = normalized.slice(0, -1) + newLetter;
      const newExpression = computeNameNumbers(newName, system, preserveMasters).expression.value;
      const delta = newExpression - currentExpression;
      
      if (delta !== 0) {
        suggestions.push({
          name: newName,
          newExpression,
          delta,
          change: `Last letter: ${normalized[lastIdx]} → ${newLetter}`
        });
      }
    }
  }
  
  // Sort by absolute delta and return top 3
  return suggestions
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 3);
}

// Advanced Numerology Features

// Pinnacle Numbers (4 cycles)
export function calculatePinnacles(dobString, preserveMasters = true) {
  const parts = dobString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  const dayReduced = reduceNumber(day, preserveMasters);
  const monthReduced = reduceNumber(month, preserveMasters);
  const yearReduced = reduceNumber(year, preserveMasters);
  
  const pinnacle1 = reduceNumber(monthReduced + dayReduced, preserveMasters);
  const pinnacle2 = reduceNumber(dayReduced + yearReduced, preserveMasters);
  const pinnacle3 = reduceNumber(pinnacle1 + pinnacle2, preserveMasters);
  const pinnacle4 = reduceNumber(monthReduced + yearReduced, preserveMasters);
  
  return {
    first: { value: pinnacle1, ages: 'Birth to 27' },
    second: { value: pinnacle2, ages: '28-36' },
    third: { value: pinnacle3, ages: '37-45' },
    fourth: { value: pinnacle4, ages: '46 onwards' }
  };
}

// Challenge Numbers
export function calculateChallenges(dobString, preserveMasters = true) {
  const parts = dobString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  const dayReduced = reduceNumber(day, preserveMasters);
  const monthReduced = reduceNumber(month, preserveMasters);
  const yearReduced = reduceNumber(year, preserveMasters);
  
  const challenge1 = Math.abs(monthReduced - dayReduced);
  const challenge2 = Math.abs(dayReduced - yearReduced);
  const challenge3 = Math.abs(challenge1 - challenge2);
  const challenge4 = Math.abs(monthReduced - yearReduced);
  
  return {
    first: challenge1,
    second: challenge2,
    third: challenge3,
    fourth: challenge4
  };
}

// Karmic Debt Numbers
export function checkKarmicDebt(numbers) {
  const karmicNumbers = [13, 14, 16, 19];
  const foundKarmic = [];
  
  Object.entries(numbers).forEach(([key, value]) => {
    if (typeof value === 'object' && value.raw) {
      if (karmicNumbers.includes(value.raw)) {
        foundKarmic.push({ type: key, number: value.raw });
      }
    }
  });
  
  return foundKarmic;
}

// Personal Year Number
export function calculatePersonalYear(dobString, currentYear = new Date().getFullYear(), preserveMasters = true) {
  const parts = dobString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  
  const universalYear = reduceNumber(currentYear, preserveMasters);
  const birthDay = reduceNumber(day, preserveMasters);
  const birthMonth = reduceNumber(month, preserveMasters);
  
  return reduceNumber(universalYear + birthDay + birthMonth, preserveMasters);
}

// Personal Month Number
export function calculatePersonalMonth(personalYear, currentMonth, preserveMasters = true) {
  return reduceNumber(personalYear + currentMonth, preserveMasters);
}

// Personal Day Number
export function calculatePersonalDay(personalMonth, currentDay, preserveMasters = true) {
  return reduceNumber(personalMonth + currentDay, preserveMasters);
}

// Balance Number
export function calculateBalanceNumber(fullName, preserveMasters = true) {
  const names = normalizeName(fullName).split(' ');
  let initialsSum = 0;
  
  names.forEach(name => {
    if (name.length > 0) {
      initialsSum += letterValue(name[0], 'pythagorean'); // Balance uses Pythagorean
    }
  });
  
  return reduceNumber(initialsSum, preserveMasters);
}

// Hidden Passion Number
export function calculateHiddenPassion(fullName, system = 'chaldean') {
  const name = normalizeName(fullName);
  const digitCounts = {};
  
  for (let i = 0; i < name.length; i++) {
    const ch = name[i];
    if (ch === ' ') continue;
    const value = letterValue(ch, system);
    digitCounts[value] = (digitCounts[value] || 0) + 1;
  }
  
  let maxCount = 0;
  let hiddenPassion = 1;
  
  Object.entries(digitCounts).forEach(([digit, count]) => {
    if (count > maxCount) {
      maxCount = count;
      hiddenPassion = parseInt(digit);
    }
  });
  
  return { value: hiddenPassion, count: maxCount };
}

// Subconscious Self Number
export function calculateSubconsciousSelf(fullName, system = 'chaldean') {
  const name = normalizeName(fullName);
  const uniqueDigits = new Set();
  
  for (let i = 0; i < name.length; i++) {
    const ch = name[i];
    if (ch === ' ') continue;
    const value = letterValue(ch, system);
    uniqueDigits.add(value);
  }
  
  return 9 - uniqueDigits.size;
}

// Compatibility Report
export function calculateCompatibility(person1, person2) {
  const p1Numbers = calculateAllNumbers(person1);
  const p2Numbers = calculateAllNumbers(person2);
  
  let compatibilityScore = 0;
  let totalComparisons = 0;
  
  // Compare Life Path
  const lifePathDiff = Math.abs(p1Numbers.lifePath.value - p2Numbers.lifePath.value);
  compatibilityScore += Math.max(0, 9 - lifePathDiff);
  totalComparisons++;
  
  // Compare Expression
  const expressionDiff = Math.abs(p1Numbers.expression.value - p2Numbers.expression.value);
  compatibilityScore += Math.max(0, 9 - expressionDiff);
  totalComparisons++;
  
  // Compare Soul Urge
  const soulUrgeDiff = Math.abs(p1Numbers.soulUrge.value - p2Numbers.soulUrge.value);
  compatibilityScore += Math.max(0, 9 - soulUrgeDiff);
  totalComparisons++;
  
  const percentage = Math.round((compatibilityScore / (totalComparisons * 9)) * 100);
  
  return {
    percentage,
    person1: p1Numbers,
    person2: p2Numbers,
    analysis: getCompatibilityAnalysis(percentage)
  };
}

function getCompatibilityAnalysis(percentage) {
  if (percentage >= 80) return "Excellent compatibility! You share similar life goals and values.";
  if (percentage >= 60) return "Good compatibility with potential for growth together.";
  if (percentage >= 40) return "Moderate compatibility. Communication will be key.";
  return "Challenging compatibility. Focus on understanding differences.";
}