# El Mouloukia V1 Production Architecture

> Now at: Phase 8 - Launch | Step 18/18 - Release and rollback playbook (completed)

Reference board: [PROJECT_STATUS_BOARD.md](PROJECT_STATUS_BOARD.md)

## Objective

Evolve the current single-file React application into an agent-native production system with:

- a deterministic domain core
- bounded AI orchestration
- auditable workflow actions
- a thin operator-facing web client
- a delivery sequence that can be completed incrementally

This document treats the current app as the first domain implementation of a broader orchestration product, while staying focused on the expert-matching use case.

## Plain-English Glossary

Use this section as a quick decoder while reading the rest of the document.

- System of Record: the source of truth database. If two places disagree, this one wins.
- Deterministic Rule: a strict rule that always gives the same answer for the same input.
- Domain Engine: the part of the system where business rules live (not UI, not AI prompts).
- AI Reasoning Layer: model-powered helper functions that suggest outputs, not final authority.
- Agent Action: a named operation the AI is allowed to request, like "propose top matches".
- Orchestration: the flow that connects steps together in the right order.
- Operator Cockpit: the web app screen where humans review, approve, and correct system actions.
- Workflow State: where an item is in its lifecycle (new, reviewed, approved, completed, etc.).
- Audit Event: a timestamped log entry of who did what and why.

Simple mental model:

- Data is stored in one trusted place.
- Rules decide what is allowed.
- AI proposes options.
- Humans approve sensitive actions.
- Logs keep everything traceable.

## Current State

The current implementation is concentrated in `src/App.jsx`, which currently owns:

- Firebase client initialization
- authentication behavior
- Firestore reads and writes
- view state and navigation
- matching heuristics
- AI invocation logic
- admin gating
- presentation logic

This is acceptable for an MVP, but it is not the right shape for a system that should eventually be managed by agents and expanded with new workflows.

## Production Design Principles

1. Deterministic core before autonomous behavior.
2. Agents propose and operate within bounded actions, rather than owning hidden business logic.
3. Every critical action must be inspectable, replayable, and overrideable by a human operator.
4. The frontend is the cockpit, not the orchestration engine.
5. Data models and workflow states are explicit before AI is allowed to automate them.

## Target System Shape

### Layer 1: System of Record

Stores canonical business entities and workflow state.

Primary entities:

- Expert
- Bottleneck
- Match
- Organization
- Interaction
- Outcome
- WorkflowRun
- AuditEvent

Recommended storage split:

- Firestore for application records and operator-facing state
- optional Blob storage for uploaded files and generated artifacts
- optional analytics sink for evaluation and reporting

### Layer 2: Deterministic Domain Engine

Contains rules that should not depend on prompts.

Examples:

- sector compatibility
- minimum profile completeness
- allowed workflow transitions
- operator permissions
- ranking constraints
- contact cooldowns
- outcome state transitions

This layer decides what is allowed.

### Layer 3: AI Reasoning Layer

Uses models for bounded tasks that benefit from language understanding.

Examples:

- profile enrichment
- bottleneck normalization
- semantic similarity scoring
- outreach drafting
- summarization
- anomaly detection
- suggested next actions

This layer does not persist critical decisions directly. It returns structured proposals.

### Layer 4: Agent Action Layer

Provides a small set of explicit actions that agents are allowed to invoke.

Examples:

- createExpertDraft
- normalizeBottleneck
- scoreCandidateMatches
- draftIntroduction
- requestApproval
- recordInteraction
- recordOutcome
- flagMissingData

Each action:

- accepts typed input
- performs validation
- logs execution
- returns structured output

### Layer 5: Operator Cockpit

The React application becomes the operator interface for:

- reviewing experts
- reviewing bottlenecks
- inspecting match candidates
- approving or rejecting actions
- viewing system health
- tracking outcomes and learning loops

## Domain Model

### Expert

Purpose:

- represent a consultant, operator, or specialist who can solve a class of bottlenecks

Fields:

- `id`
- `fullName`
- `headline`
- `sectors[]`
- `capabilities[]`
- `painRelievers[]`
- `gainCreators[]`
- `bio`
- `languages[]`
- `location`
- `contactChannels`
- `availabilityStatus`
- `trustLevel`
- `verificationStatus`
- `profileCompleteness`
- `source`
- `createdAt`
- `updatedAt`

### Bottleneck

Purpose:

- represent a concrete operational, institutional, or commercial problem to be solved

Fields:

- `id`
- `title`
- `rawDescription`
- `normalizedSummary`
- `sector`
- `subsector`
- `location`
- `urgency`
- `frictionCost`
- `instanceNarrative`
- `requiredCapabilities[]`
- `status`
- `submittedBy`
- `createdAt`
- `updatedAt`

### Match

Purpose:

- represent a candidate or approved relationship between one bottleneck and one expert

Fields:

- `id`
- `bottleneckId`
- `expertId`
- `deterministicScore`
- `semanticScore`
- `compositeScore`
- `reasoningSummary`
- `status`
- `recommendedAction`
- `approvedBy`
- `createdAt`
- `updatedAt`

### Organization

Purpose:

- represent the company, institution, public actor, or client context involved in the problem

Fields:

- `id`
- `name`
- `type`
- `sector`
- `location`
- `sizeBand`
- `contacts[]`
- `notes`

### Interaction

Purpose:

- track outreach, follow-up, calls, meetings, and agent-generated communications

Fields:

- `id`
- `matchId`
- `channel`
- `direction`
- `messageType`
- `summary`
- `contentRef`
- `status`
- `createdBy`
- `createdAt`

### Outcome

Purpose:

- capture whether a match led to progress, rejection, delay, or value creation

Fields:

- `id`
- `matchId`
- `result`
- `economicImpact`
- `timeToFirstResponse`
- `timeToResolution`
- `operatorNotes`
- `createdAt`

### WorkflowRun

Purpose:

- record a multi-step orchestration sequence that may include human approvals and agent proposals

Fields:

- `id`
- `workflowType`
- `subjectType`
- `subjectId`
- `state`
- `currentStep`
- `proposedActions[]`
- `approvedActions[]`
- `failedActions[]`
- `createdAt`
- `updatedAt`

### AuditEvent

Purpose:

- ensure system-level traceability for agent and operator behavior

Fields:

- `id`
- `actorType`
- `actorId`
- `action`
- `subjectType`
- `subjectId`
- `inputRef`
- `outputRef`
- `status`
- `createdAt`

## Target Repository Structure

```text
src/
  app/
    AppShell.jsx
    routes/
    providers/
  features/
    experts/
      components/
      hooks/
      pages/
    bottlenecks/
      components/
      hooks/
      pages/
    matches/
      components/
      hooks/
      pages/
    admin/
      components/
      pages/
  domain/
    experts/
      expert.types.js
      expert.validators.js
      expert.rules.js
    bottlenecks/
      bottleneck.types.js
      bottleneck.validators.js
      bottleneck.rules.js
    matches/
      match.rules.js
    workflows/
      workflow.rules.js
  services/
    firebase/
      clientApp.js
      authClient.js
      firestoreClient.js
    repositories/
      expertsRepository.js
      bottlenecksRepository.js
      matchesRepository.js
    ai/
      aiClient.js
      prompts/
      parsers/
    orchestration/
      actionRegistry.js
      expertEnrichmentService.js
      bottleneckNormalizationService.js
      matchScoringService.js
      outreachDraftService.js
    diagnostics/
      configVerification.js
      authVerification.js
      firestoreVerification.js
  shared/
    ui/
    utils/
    constants/
scripts/
  firebase-auth-diagnostic.mjs
  firebase-config-verify.mjs
  firestore-connectivity-check.mjs
  seed-demo-data.mjs
```

## Service Boundaries

### Client App

Responsibilities:

- render operator UI
- capture input
- trigger approved actions
- display diagnostics and workflow state

Must not own:

- business-critical matching rules
- irreversible workflow transitions
- hidden prompt logic

### Firebase Client Service

Responsibilities:

- initialize client SDK
- manage authenticated session
- expose read-only or scoped write operations to the UI

### Repository Layer

Responsibilities:

- isolate Firestore shape from the rest of the app
- provide typed read and write functions
- enable future backend migration without rewriting UI code

### Domain Services

Responsibilities:

- enforce validations and deterministic rules
- build candidate pools
- compute deterministic ranking components

### AI Services

Responsibilities:

- generate structured outputs for bounded tasks
- validate response schema
- return explicit confidence and reasoning summaries

Must not:

- commit production state without a service-level decision

### Orchestration Services

Responsibilities:

- combine domain rules and AI results
- create action proposals
- advance workflow runs
- require human approval where configured

### Diagnostics Tooling

Responsibilities:

- verify project configuration
- verify auth availability
- verify Firestore connectivity
- seed representative demo records

## Agent Responsibilities

### Agent 1: Intake Agent

Purpose:

- transform raw bottleneck submissions into normalized structured cases

Allowed actions:

- classify sector
- summarize problem
- extract required capabilities
- flag missing fields

### Agent 2: Expert Enrichment Agent

Purpose:

- improve expert profile quality and consistency

Allowed actions:

- infer capabilities
- normalize titles
- score completeness
- propose verification tasks

### Agent 3: Match Strategy Agent

Purpose:

- propose ranked experts for a bottleneck

Allowed actions:

- score semantic fit
- explain ranking
- suggest top candidate list

Must not:

- approve final introductions autonomously in v1

### Agent 4: Outreach Agent

Purpose:

- draft communications and follow-up steps

Allowed actions:

- draft intro message
- draft reminder
- summarize operator-ready contact context

### Agent 5: Learning Agent

Purpose:

- analyze completed interactions and outcomes to improve future matching

Allowed actions:

- summarize win/loss patterns
- detect repeated bottleneck classes
- suggest rule updates or data model improvements

## Human Approval Boundaries

Human approval is required in v1 for:

- publishing experts into the active marketplace
- approving match proposals
- sending first-contact outreach
- deleting records
- changing workflow state to resolved, rejected, or escalated

## Observability and Evaluation

Track these from the start:

- auth success rate
- Firestore read and write failures
- bottleneck normalization acceptance rate
- match approval rate
- response rate after outreach
- resolution rate by sector
- operator correction rate on AI suggestions
- time from intake to first viable match

This turns the system into an improving operating model rather than a static directory.

## Security and Access Model

1. Separate Firebase and Gemini API keys.
2. Restrict client keys to only required APIs.
3. Keep admin or service-account capabilities out of the browser.
4. Use server-side or local tooling for privileged automation.
5. Log all agent-triggered actions in `AuditEvent`.

## 10-Day Delivery Sequence

### Days 1-2: Stabilize and Decompose

Goals:

- remove monolithic responsibilities from `App.jsx`
- centralize configuration and diagnostics
- restore operational confidence

Deliverables:

- extract Firebase config into `services/firebase/clientApp.js`
- extract Gemini client into `services/ai/aiClient.js`
- add `firebase-config-verify` and `firestore-connectivity-check` scripts
- ensure diagnostics run through npm scripts

Status:

- completed in this repository

### Days 3-4: Repository and Domain Foundation

Goals:

- isolate data access and establish deterministic domain boundaries

Deliverables:

- create repositories for experts, bottlenecks, and matches
- create domain validators and rule modules
- move matching heuristics from UI layer into domain services
- add typed workflow statuses for records

### Days 5-6: Bounded AI Service Integration

Goals:

- keep AI generation behind strict service interfaces

Deliverables:

- bottleneck normalization service
- expert enrichment service
- match scoring service returning structured output
- schema validation and safe parsing for AI responses
- explicit error channels for operator review

### Days 7-8: Agent-Assisted Workflow V0.1

Goals:

- introduce proposal-first automation with human approvals

Deliverables:

- intake agent flow (normalize and propose)
- match strategy agent flow (rank and explain)
- outreach draft flow (human-approved send path)
- workflow run records with step state

### Days 9-10: Production Hardening and Evaluation

Goals:

- finalize a safe first release of agentic operations

Deliverables:

- audit event logging for agent and operator actions
- basic evaluation panel: proposal acceptance, correction rate, time-to-match
- key restriction hardening (Firebase and Gemini split)
- go-live checklist and rollback protocol

## Immediate Next Changes in This Repo

1. Create `services/repositories/expertsRepository.js`, `bottlenecksRepository.js`, and `matchesRepository.js`.
2. Move Firestore reads and writes from `App.jsx` into repository functions.
3. Create `domain/experts`, `domain/bottlenecks`, and `domain/matches` rule and validator modules.
4. Split `App.jsx` into feature pages starting with auth, directory, profile, and admin.
5. Add `services/orchestration/actionRegistry.js` with proposal-style action contracts.
6. Add audit logging writes for critical operator and agent actions.

## Decision Summary

The right path is not to let one unconstrained agent run the product. The right path is to build a deterministic orchestration substrate and let bounded agents operate inside it.

That approach supports:

- production reliability
- faster iteration
- safer automation
- reusable architecture for future projects
- incremental rollout of more autonomy over time