import { sectorsMatch } from '../../shared/utils/sectorKeys.js';

function tokenizeTerms(text) {
  return (text || '')
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 4);
}

export function scoreExpertForHurdle(expert, hurdle) {
  if (!expert || !hurdle) {
    return {
      resonance: 0,
      agentTrackingId: null,
      confidenceScore: null
    };
  }

  let score = 0;
  const expertTerms = `${expert.bottleneck || ''} ${expert.gainCreator || ''}`.toLowerCase();
  const hurdleTerms = `${hurdle.title || ''} ${hurdle.description || ''} ${hurdle.instance || ''}`;

  if (expert.sector && hurdle.sector && sectorsMatch(expert.sector, hurdle.sector)) {
    score += 4;
  }

  const keywords = tokenizeTerms(hurdleTerms);
  keywords.forEach((word) => {
    if (expertTerms.includes(word)) {
      score += 2;
    }
  });

  return {
    resonance: score,
    agentTrackingId: null,
    confidenceScore: null
  };
}

export function getTopExpertMatches(experts, hurdle, options = {}) {
  const maxResults = options.maxResults ?? 3;
  const minimumResonance = options.minimumResonance ?? 2;

  if (!hurdle) {
    return [];
  }

  return (experts || [])
    .map((expert) => ({
      ...expert,
      ...scoreExpertForHurdle(expert, hurdle)
    }))
    .filter((expert) => expert.resonance > minimumResonance)
    .sort((a, b) => b.resonance - a.resonance)
    .slice(0, maxResults);
}
