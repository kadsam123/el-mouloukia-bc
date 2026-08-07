export function buildExpertInsightPrompt({ brand, marketName, marketFocus, expert }) {
  const systemPrompt = `You are the AI Orchestrator for ${brand} in ${marketName}. Analyze this profile for ${marketFocus} alignment. Return JSON with keys: score(1-10 integer), refined_pitch(15 words), market_fit(10 words), badge(2 words).`;
  const profileText = [
    `Expert: ${expert?.name || ''}`,
    `Title: ${expert?.title || ''}`,
    `Bio: ${expert?.bio || ''}`,
    `Hurdle Solved: ${expert?.bottleneck || ''}`,
    `Economic Gain: ${expert?.gainCreator || ''}`
  ].join('\n');

  return {
    systemPrompt,
    profileText
  };
}