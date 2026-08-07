import { useEffect, useMemo, useState } from 'react';
import { computeEvaluationKpis } from '../admin.kpis';
import { subscribeAuditEvents } from '../../../services/repositories/auditEventsRepository';
import { subscribeInteractions } from '../../../services/repositories/interactionsRepository';
import { subscribeOutcomes } from '../../../services/repositories/outcomesRepository';
import {
  approveWorkflowRun,
  rejectWorkflowRun,
  subscribeWorkflowRuns
} from '../../../services/repositories/workflowRunsRepository';

export function useAdminActionsMonitor(isEnabled, operatorId) {
  const [auditEvents, setAuditEvents] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [outcomes, setOutcomes] = useState([]);
  const [workflowRuns, setWorkflowRuns] = useState([]);
  const [actionError, setActionError] = useState('');
  const [actionBusyId, setActionBusyId] = useState(null);

  useEffect(() => {
    if (!isEnabled) {
      setAuditEvents([]);
      setInteractions([]);
      setOutcomes([]);
      setWorkflowRuns([]);
      return undefined;
    }

    const unsubscribeAudit = subscribeAuditEvents(setAuditEvents, { maxItems: 25 });
    const unsubscribeInteractions = subscribeInteractions(setInteractions, { maxItems: 50 });
    const unsubscribeOutcomes = subscribeOutcomes(setOutcomes, { maxItems: 50 });
    const unsubscribeWorkflow = subscribeWorkflowRuns(setWorkflowRuns, { maxItems: 25 });

    return () => {
      unsubscribeAudit();
      unsubscribeInteractions();
      unsubscribeOutcomes();
      unsubscribeWorkflow();
    };
  }, [isEnabled]);

  const summary = useMemo(() => {
    const pendingApprovals = workflowRuns.filter((run) => run.state === 'pending_approval').length;
    const failedRuns = workflowRuns.filter((run) => run.state === 'failed').length;
    const completedRuns = workflowRuns.filter((run) => run.state === 'completed').length;

    return {
      totalEvents: auditEvents.length,
      totalRuns: workflowRuns.length,
      pendingApprovals,
      failedRuns,
      completedRuns
    };
  }, [auditEvents, workflowRuns]);

  const pendingApprovalRuns = useMemo(
    () => workflowRuns.filter((run) => run.state === 'pending_approval'),
    [workflowRuns]
  );

  const kpis = useMemo(
    () => computeEvaluationKpis({ workflowRuns, interactions, outcomes }),
    [workflowRuns, interactions, outcomes]
  );

  const approveWorkflowRunById = async (workflowRunId) => {
    setActionError('');
    setActionBusyId(workflowRunId);

    try {
      if (!operatorId) {
        throw new Error('Operator identity is required to approve workflow runs. Re-authenticate your session.');
      }

      await approveWorkflowRun(workflowRunId, {
        operatorId,
        note: 'Approved via admin monitor'
      });
    } catch (error) {
      setActionError(error?.message || 'Failed to approve workflow run.');
    } finally {
      setActionBusyId(null);
    }
  };

  const rejectWorkflowRunById = async (workflowRunId) => {
    setActionError('');
    setActionBusyId(workflowRunId);

    try {
      if (!operatorId) {
        throw new Error('Operator identity is required to reject workflow runs. Re-authenticate your session.');
      }

      await rejectWorkflowRun(workflowRunId, {
        operatorId,
        note: 'Rejected via admin monitor'
      });
    } catch (error) {
      setActionError(error?.message || 'Failed to reject workflow run.');
    } finally {
      setActionBusyId(null);
    }
  };

  return {
    actionBusyId,
    actionError,
    approveWorkflowRunById,
    auditEvents,
    interactions,
    kpis,
    outcomes,
    pendingApprovalRuns,
    rejectWorkflowRunById,
    workflowRuns,
    summary
  };
}