const REQUIRED_BOTTLENECK_FIELDS = ['title', 'description', 'sector', 'frictionCost', 'instance'];

function normalizeString(value) {
  return (value || '').toString().trim();
}

export function normalizeBottleneckPayload(rawPayload) {
  return {
    title: normalizeString(rawPayload.title),
    description: normalizeString(rawPayload.description),
    sector: normalizeString(rawPayload.sector),
    frictionCost: normalizeString(rawPayload.frictionCost),
    instance: normalizeString(rawPayload.instance)
  };
}

export function validateBottleneckPayload(rawPayload, options = {}) {
  const payload = normalizeBottleneckPayload(rawPayload);
  const missingFields = REQUIRED_BOTTLENECK_FIELDS.filter((key) => !payload[key]);
  const errors = [];

  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (options.allowedSectors?.length && !options.allowedSectors.includes(payload.sector)) {
    errors.push('Invalid sector selected.');
  }

  if (payload.frictionCost && Number.isNaN(Number(payload.frictionCost))) {
    errors.push('Friction cost must be a number.');
  }

  return {
    payload,
    missingFields,
    errors,
    isValid: errors.length === 0
  };
}
