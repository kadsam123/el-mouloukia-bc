const REQUIRED_EXPERT_FIELDS = ['name', 'title', 'sector', 'phone', 'bio', 'bottleneck', 'gainCreator'];

function normalizeString(value) {
  return (value || '').toString().trim();
}

export function normalizeExpertPayload(rawPayload) {
  return {
    name: normalizeString(rawPayload.name),
    title: normalizeString(rawPayload.title),
    sector: normalizeString(rawPayload.sector),
    phone: normalizeString(rawPayload.phone),
    bio: normalizeString(rawPayload.bio),
    bottleneck: normalizeString(rawPayload.bottleneck),
    gainCreator: normalizeString(rawPayload.gainCreator)
  };
}

export function validateExpertPayload(rawPayload, options = {}) {
  const payload = normalizeExpertPayload(rawPayload);
  const missingFields = REQUIRED_EXPERT_FIELDS.filter((key) => !payload[key]);
  const errors = [];

  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (options.allowedSectors?.length && !options.allowedSectors.includes(payload.sector)) {
    errors.push('Invalid sector selected.');
  }

  return {
    payload,
    missingFields,
    errors,
    isValid: errors.length === 0
  };
}
