import { NUMBER_MEANINGS } from '../data/meanings';

export function generateCoachingText(results) {
  const { lifePath, expression, soulUrge, personality, birthday, maturity } = results;
  
  const lifePathMeaning = NUMBER_MEANINGS[lifePath.value];
  const expressionMeaning = NUMBER_MEANINGS[expression.value];
  const soulUrgeMeaning = NUMBER_MEANINGS[soulUrge.value];
  
  const title = `${lifePathMeaning?.summary.split(' ').slice(0, 3).join(' ') || 'Unique Path'}`;
  
  const summary = `Your Life Path ${lifePath.value} reveals ${lifePathMeaning?.summary.toLowerCase() || 'a unique journey'}. ` +
    `Your Expression number ${expression.value} shows ${expressionMeaning?.summary.toLowerCase() || 'special talents'}. ` +
    `Inner motivation (Soul Urge ${soulUrge.value}) drives you toward ${soulUrgeMeaning?.summary.toLowerCase() || 'meaningful experiences'}.`;
  
  const actions = [
    lifePathMeaning?.coaching[0] || "Focus on developing your natural talents",
    expressionMeaning?.coaching[0] || "Express your authentic self confidently", 
    soulUrgeMeaning?.coaching[0] || "Listen to your inner guidance"
  ];
  
  // Determine confidence based on completeness
  const hasAllNumbers = lifePath.value && expression.value && soulUrge.value;
  const confidence = hasAllNumbers ? 'High' : 'Medium';
  
  return {
    title,
    summary,
    actions,
    confidence
  };
}