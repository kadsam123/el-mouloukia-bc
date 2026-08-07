# Architect Trial Handoff

Date: 2026-05-27
Project: El Mouloukia BC (TradeMatch)
Author: GitHub Copilot (GPT-5.3-Codex)

## 1) Executive Summary
The application is online and testable locally after resolving a browser runtime crash. Core automated tests are passing, and the AI stress harness is stable in both deterministic and live AI modes. Resilience controls are now in place for transient AI provider failures through retry/backoff and controlled fallback behavior.

## 2) Trial Scope Completed
- Frontend runtime stability under local dev serving.
- Regression test integrity after AI and orchestration changes.
- AI pathway generation under structured schema constraints.
- Stress-harness isolation guarantees (no Firestore writes).
- Live AI transient-failure handling and observability metadata.

## 3) Trial Results
### 3.1 Runtime Stability
Status: PASS
- Blank-page incident root cause identified: browser crash from unsafe runtime env access using Node-only global process.
- Fix applied: browser-safe runtime env resolver while preserving Node script compatibility.

### 3.2 Regression Integrity
Status: PASS
- Automated suite: 11 files, 30 tests passing.

### 3.3 AI Stress Harness (Deterministic + Live)
Status: PASS
- Harness executes end-to-end across all stress cases.
- Persistence behavior remains isolated using in-memory stubs only.
- No Firestore write side effects during stress runs.

### 3.4 Live AI Reliability
Status: PASS with resilience controls
- Model path updated to a supported production model identifier.
- Retry with exponential backoff added for transient provider errors (429/503).
- Deterministic fallback retained for retry exhaustion.
- Live telemetry captured: model, attempts, last error code/status.

## 4) Architecture Decisions Validated
- Keep strict v2 pathway contract in AI outputs:
  - mode: agent-enriched
  - confidenceScore: number
  - milestones: string[]
  - rationale: string
- Separate diagnostic telemetry from schema payload to avoid contract pollution.
- Maintain deterministic fallback for continuity of UX and orchestration flow.
- Keep stress harness isolated from persistence to support safe trial repetition.

## 5) Remaining Risks
- External AI capacity spikes remain an upstream dependency risk.
- Retry policy defaults require architecture approval for production budget alignment.
- Firebase auth diagnostic path remains unresolved in this cycle and needs focused closure before final go-live decision.

## 6) Decisions Needed From Architect
1. Approve production retry policy defaults:
   - max attempts
   - backoff base interval
   - total request time budget
2. Approve unavailability behavior:
   - fail-open with deterministic fallback vs fail-closed with explicit blocking
3. Approve promotion gates:
   - required UAT scenarios
   - monitoring thresholds
   - rollback criteria

## 6.1) Implemented Baseline Policy Config (Candidate)
- Runtime-configured baseline is now codified in src/config/policyConfig.js:
   - ai.maxAttempts: 3
   - ai.backoffBaseIntervalMs: 1500
   - ai.totalTimeBudgetMs: 15000
   - ai.unavailabilityBehavior: FAIL_OPEN_DETERMINISTIC
   - telemetry.logTraceLevel: AUDIT_FULL
   - telemetry.alertOnErrorClusterThreshold: 0.05
- AI client now consumes this policy for retry and time-budget enforcement, while preserving env overrides for controlled experiments.

## 7) Proposed Next Trial Cycle
1. Synthetic transient-failure trial
- Inject 429/503 conditions and confirm retry + fallback behavior matches policy.

2. Latency budget trial
- Measure P50/P95 for live pathway generation and confirm acceptable UX envelope.

3. Auth + Firestore diagnostic closure
- Resolve failing firebase-auth diagnostic and document root cause + remediation.

4. Business UAT walkthrough
- End-to-end user journey validation: hurdle intake, matching, pathway generation, and decision logging.

## 8) Sign-Off Checklist
- [ ] Retry/backoff defaults approved by architecture
- [ ] AI unavailability behavior approved
- [ ] Firebase auth diagnostic resolved
- [ ] Staging UAT scenarios executed and accepted
- [ ] Monitoring + alert thresholds configured
- [ ] Rollback plan reviewed and approved

## 9) Suggested Discussion Agenda (30 minutes)
1. Reliability posture and AI dependency tolerance (10 min)
2. Production policy decisions and SLO budget (10 min)
3. Gate criteria and ownership for final release readiness (10 min)
