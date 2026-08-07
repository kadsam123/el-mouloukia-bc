import { describe, expect, it } from 'vitest';
import { normalizeExpertPayload, validateExpertPayload } from '../experts/expert.validators';

describe('expert validators', () => {
  it('normalizes empty values into strings', () => {
    const payload = normalizeExpertPayload({ name: '  Lina  ', title: null });
    expect(payload.name).toBe('Lina');
    expect(payload.title).toBe('');
  });

  it('rejects missing required fields', () => {
    const result = validateExpertPayload({ name: 'A' }, { allowedSectors: ['it'] });
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Missing required fields');
  });

  it('rejects unknown sector', () => {
    const result = validateExpertPayload(
      {
        name: 'A',
        title: 'B',
        sector: 'wrong',
        phone: '123',
        bio: 'bio',
        bottleneck: 'bn',
        gainCreator: 'gc'
      },
      { allowedSectors: ['it', 'manuf'] }
    );
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid sector selected.');
  });
});
