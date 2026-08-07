import { describe, expect, it } from 'vitest';
import { getFilteredExperts } from './experts.selectors';

describe('experts selectors', () => {
  it('matches logistics filter against legacy logistics sector key', () => {
    const experts = [
      { id: 'e1', sector: 'logistics', name: 'Lina', title: 'Ops', bottleneck: 'routing' },
      { id: 'e2', sector: 'it', name: 'Amir', title: 'Tech', bottleneck: 'erp' }
    ];

    const filtered = getFilteredExperts({
      experts,
      filter: 'log',
      search: '',
      activeHurdle: null,
      getTopMatches: () => []
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('e1');
  });
});