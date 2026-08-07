function safeRate(part, total) {
  if (!total || total <= 0) {
    return 0;
  }

  return Math.round((part / total) * 100);
}

function toMillis(value) {
  if (!value) {
    return null;
  }

  if (typeof value?.toMillis === 'function') {
    return value.toMillis();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function average(numbers) {
  if (!numbers.length) {
    return 0;
  }

  const total = numbers.reduce((sum, number) => sum + number, 0);
  return total / numbers.length;
}

export function computeEvaluationKpis({ workflowRuns, interactions, outcomes }) {
  const runs = workflowRuns || [];
  const interactionsList = interactions || [];
  const outcomesList = outcomes || [];

  const approved = runs.filter((run) => run.state === 'approved' || run.state === 'completed').length;
  const rejected = runs.filter((run) => run.state === 'rejected').length;
  const reviewed = approved + rejected;
  const approvalRate = safeRate(approved, reviewed);
  const correctionRate = safeRate(rejected, reviewed);

  const sentInteractions = interactionsList.filter((record) => record.status === 'sent' || record.direction === 'outbound').length;
  const positiveOutcomes = outcomesList.filter((record) => (record.result || '').toString().toLowerCase() === 'resolved').length;
  const responseRate = safeRate(positiveOutcomes, sentInteractions);

  const cycleTimesHours = runs
    .map((run) => {
      const start = toMillis(run.createdAt);
      const end = toMillis(run.updatedAt);
      if (!start || !end || end < start) {
        return null;
      }

      return (end - start) / (1000 * 60 * 60);
    })
    .filter((value) => value !== null);

  const avgTimeToMatchHours = Math.round(average(cycleTimesHours));

  return {
    approvalRate,
    correctionRate,
    responseRate,
    avgTimeToMatchHours,
    outcomesCount: outcomesList.length,
    interactionsCount: interactionsList.length
  };
}