import { describe, expect, it } from 'vitest';
import { V2_AGENT_RESPONSE_SCHEMA, validateV2AgentResponse } from './agentResponseSchema';

describe('agentResponseSchema', () => {
  it('accepts valid v2 payload', () => {
    const result = validateV2AgentResponse({
      mode: 'agent-enriched',
      confidenceScore: 0.94,
      milestones: ['m1', 'm2', 'm3'],
      rationale: 'Targeted remediation.'
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.schema).toEqual(V2_AGENT_RESPONSE_SCHEMA);
  });

  it('rejects invalid v2 payload', () => {
    const result = validateV2AgentResponse({
      mode: 'deterministic-fallback',
      confidenceScore: 'high',
      milestones: ['m1', 2],
      rationale: null
    });

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
