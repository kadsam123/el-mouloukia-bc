import { describe, expect, it } from 'vitest';
import { parseExpertInsightResponse } from './expertInsightParser';

describe('expertInsightParser', () => {
  it('accepts valid schema payload', () => {
    const result = parseExpertInsightResponse(JSON.stringify({
      score: 8,
      refined_pitch: 'Leads process redesign for resilient and efficient industrial operations',
      market_fit: 'Strong fit for industrial bottleneck reduction',
      badge: 'Fit High'
    }));

    expect(result.ok).toBe(true);
    expect(result.data.score).toBe(8);
    expect(result.data.refined_pitch).toContain('Leads process redesign');
  });

  it('rejects malformed payload', () => {
    const result = parseExpertInsightResponse('{invalid json');
    expect(result.ok).toBe(false);
    expect(result.error).toContain('Invalid JSON');
  });
});