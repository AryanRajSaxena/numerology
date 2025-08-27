export function generateInsights({ results, profile, isPremium }) {
  if (!results) return [];

  const { lifePath, expression, soulUrge, personality } = results;
  const prefs = profile.preferences || [];

  const lines = {
    love: isPremium
      ? `❤️ Aapka Love Life mein naye rang bharne wale hain. Life Path ${lifePath?.value} dikhata hai ki agle kuch mahino mein ek nayi shuruaat ho sakti hai. Shayad ek purana rishta heal ho ya nayi bonding bane. Dil ki awaaz suno aur thoda open-minded raho.`
      : `❤️ Your love life is on the edge of a new beginning… (Unlock Premium to know WHEN & with WHOM).`,

    finance: isPremium
      ? `💰 Expression number ${expression?.value} ke hisaab se, aapke liye paisa aane ke naye raaste khul rahe hain. Agle cycle mein ek bada financial shift aa sakta hai—partnerships ya ek side hustle zyada rewarding ban sakti hai. Patience aur planning dono zaroori hai.`
      : `💰 Money flow is shifting soon… (Upgrade to Premium to see the exact timing & sources).`,

    career: isPremium
      ? `🚀 Soul Urge ${soulUrge?.value} batata hai ki career mein aapko naye opportunities milenge, lekin unhe grab karne ke liye skills polish karni hongi. Ek turning point project ya promotion ke roop mein aa sakta hai.`
      : `🚀 Career growth is near, but the exact opportunity is hidden… (Go Premium for the roadmap).`,

    obstacles: isPremium
      ? `⚡ Personality number ${personality?.value} dikhata hai ki kuch challenges aayenge—delays ya misunderstandings—but ye phase sirf temporary hai. Aapke andar unhe paar karne ki strength hai.`
      : `⚡ Obstacles may test you now, but relief is coming… (Unlock Premium to know how long it lasts).`,

    family: isPremium
      ? `👨‍👩‍👧 Family & Relationships mein balance maintain karna zaroori hai. Life Path ${lifePath?.value} aapko patience aur understanding ki advice deta hai. Ek chhoti misunderstanding door hokar bonding aur strong hogi.`
      : `👨‍👩‍👧 Family matters may soon need your attention… (Premium reveals how to keep harmony).`,

    future: isPremium
      ? `🔮 Numerology ke hisaab se aapka agla phase zyada promising hoga. Naye mauke milenge—love, paisa, career sab mein ek positive shift dikh raha hai. Ye waqt aapke liye nayi shuruaat la sakta hai.`
      : `🔮 Positive changes are coming in your future… (Unlock Premium to know exact months & areas).`,
  };

  return prefs.map((key) => ({
    key,
    category: key.charAt(0).toUpperCase() + key.slice(1), // Proper label
    text: lines[key],
    premium: !isPremium, // tells UI whether it's a locked teaser
  }));
}
