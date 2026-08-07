export const V2_AGENT_RESPONSE_SCHEMA = {
  mode: 'agent-enriched',
  confidenceScore: 'number',
  milestones: ['string'],
  rationale: 'string'
};

export const agentResponseSchema = {
  type: 'object',
  properties: {
    mode: {
      type: 'string',
      enum: [V2_AGENT_RESPONSE_SCHEMA.mode]
    },
    confidenceScore: {
      type: 'number'
    },
    milestones: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    rationale: {
      type: 'string'
    }
  },
  required: ['mode', 'confidenceScore', 'milestones', 'rationale']
};

export function validateV2AgentResponse(payload, options = {}) {
  const schema = options.schema || V2_AGENT_RESPONSE_SCHEMA;
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return {
      valid: false,
      errors: ['Simulation payload must be an object.'],
      schema
    };
  }

  if (payload.mode !== schema.mode) {
    errors.push(`mode must equal "${schema.mode}".`);
  }

  if (!Number.isFinite(payload.confidenceScore)) {
    errors.push(`confidenceScore must be ${schema.confidenceScore}.`);
  }

  if (!Array.isArray(payload.milestones) || payload.milestones.some((item) => typeof item !== 'string')) {
    errors.push('milestones must be an array of strings.');
  }

  if (typeof payload.rationale !== 'string') {
    errors.push(`rationale must be ${schema.rationale}.`);
  }

  return {
    valid: errors.length === 0,
    errors,
    schema
  };
}
