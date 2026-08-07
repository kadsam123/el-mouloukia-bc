import { describe, expect, it } from 'vitest';
import { getTopExpertMatches, scoreExpertForHurdle } from '../matches/match.rules';

describe('match rules', () => {
  const hurdle = {
    sector: 'it',
    title: 'Legacy ERP issue',
    description: 'Need warehouse automation integration',
    instance: 'Failed migration during month end'
  };

  it('scores sector alignment higher', () => {
    const aligned = scoreExpertForHurdle(
      { sector: 'it', bottleneck: 'ERP migration', gainCreator: 'warehouse automation' },
      hurdle
    );
    const nonAligned = scoreExpertForHurdle(
      { sector: 'agri', bottleneck: 'ERP migration', gainCreator: 'warehouse automation' },
      hurdle
    );
    expect(aligned.resonance).toBeGreaterThan(nonAligned.resonance);
    expect(aligned).toHaveProperty('agentTrackingId');
    expect(aligned).toHaveProperty('confidenceScore');
  });

  it('returns ranked top matches with resonance', () => {
    const experts = [
      { id: '1', sector: 'it', bottleneck: 'ERP migration and integration', gainCreator: 'automation value' },
      { id: '2', sector: 'it', bottleneck: 'network maintenance', gainCreator: 'uptime' },
      { id: '3', sector: 'agri', bottleneck: 'supply chain', gainCreator: 'cost reduction' }
    ];

    const matches = getTopExpertMatches(experts, hurdle, { maxResults: 2, minimumResonance: 0 });

    expect(matches).toHaveLength(2);
    expect(matches[0].resonance).toBeGreaterThanOrEqual(matches[1].resonance);
    expect(matches[0]).toHaveProperty('agentTrackingId');
    expect(matches[0]).toHaveProperty('confidenceScore');
  });
});
