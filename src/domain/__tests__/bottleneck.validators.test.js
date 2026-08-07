import { describe, expect, it } from 'vitest';
import { normalizeBottleneckPayload, validateBottleneckPayload } from '../bottlenecks/bottleneck.validators';

describe('bottleneck validators', () => {
  it('normalizes values and trims strings', () => {
    const payload = normalizeBottleneckPayload({ title: '  Delay  ', frictionCost: ' 10 ' });
    expect(payload.title).toBe('Delay');
    expect(payload.frictionCost).toBe('10');
  });

  it('rejects non numeric friction cost', () => {
    const result = validateBottleneckPayload(
      {
        title: 't',
        description: 'd',
        sector: 'it',
        frictionCost: 'x10',
        instance: 'i'
      },
      { allowedSectors: ['it'] }
    );
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Friction cost must be a number.');
  });
});
