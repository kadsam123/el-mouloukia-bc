export const PRODUCTION_RELIABILITY_POLICY = {
  ai: {
    maxAttempts: 3,
    backoffBaseIntervalMs: 1500,
    totalTimeBudgetMs: 15000,
    unavailabilityBehavior: 'FAIL_OPEN_DETERMINISTIC'
  },
  telemetry: {
    logTraceLevel: 'AUDIT_FULL',
    alertOnErrorClusterThreshold: 0.05
  }
};

export function readRuntimeEnv(key) {
  const viteValue = import.meta.env?.[key];
  if (typeof viteValue === 'string' && viteValue.trim()) {
    return viteValue.trim();
  }

  if (typeof process !== 'undefined') {
    const nodeValue = process?.env?.[key];
    if (typeof nodeValue === 'string' && nodeValue.trim()) {
      return nodeValue.trim();
    }
  }

  return '';
}

function readPositiveInt(key, fallback, minimum) {
  const value = Number.parseInt(readRuntimeEnv(key) || String(fallback), 10);
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(minimum, value);
}

function readUnitInterval(key, fallback) {
  const value = Number.parseFloat(readRuntimeEnv(key) || String(fallback));
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(1, Math.max(0, value));
}

export function getEffectiveReliabilityPolicy() {
  return {
    ai: {
      maxAttempts: readPositiveInt('GEMINI_MAX_ATTEMPTS', PRODUCTION_RELIABILITY_POLICY.ai.maxAttempts, 1),
      backoffBaseIntervalMs: readPositiveInt(
        'GEMINI_BACKOFF_BASE_MS',
        PRODUCTION_RELIABILITY_POLICY.ai.backoffBaseIntervalMs,
        50
      ),
      totalTimeBudgetMs: readPositiveInt(
        'GEMINI_TOTAL_TIME_BUDGET_MS',
        PRODUCTION_RELIABILITY_POLICY.ai.totalTimeBudgetMs,
        1000
      ),
      unavailabilityBehavior: readRuntimeEnv('AI_UNAVAILABILITY_BEHAVIOR')
        || PRODUCTION_RELIABILITY_POLICY.ai.unavailabilityBehavior
    },
    telemetry: {
      logTraceLevel: readRuntimeEnv('TELEMETRY_LOG_TRACE_LEVEL')
        || PRODUCTION_RELIABILITY_POLICY.telemetry.logTraceLevel,
      alertOnErrorClusterThreshold: readUnitInterval(
        'TELEMETRY_ALERT_ERROR_CLUSTER_THRESHOLD',
        PRODUCTION_RELIABILITY_POLICY.telemetry.alertOnErrorClusterThreshold
      )
    }
  };
}
