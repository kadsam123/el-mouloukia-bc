# Release and Rollback Playbook

## Purpose

This playbook defines the minimum safe launch sequence and the rollback path for El Mouloukia BC.

## Release Readiness Gate

Run these checks in order:

1. `npm run diag:security`
2. `npm run test`
3. `npm run build`

Single-command preflight:

- `npm run release:preflight`

The release proceeds only if all commands pass.

## Pre-Release Checklist

1. Confirm `.env` exists locally and all required `VITE_*` keys are populated.
2. Confirm admin password policy is satisfied (12+ chars with upper/lower/number/symbol).
3. Confirm no local-only secret files are staged (`.env`, `src/.env`).
4. Confirm pending approval queue has no unintended blocked production items.
5. Confirm KPI dashboard values load in admin view.

## Release Procedure

1. Pull latest main branch and verify clean working tree.
2. Run `npm run release:preflight`.
3. Create release tag using semantic versioning.
4. Deploy build artifacts through your normal hosting pipeline.
5. Run post-deploy smoke checks:
- Open app
- Authenticate session
- Open admin panel
- Verify actions monitor and KPI tiles load
- Create one non-destructive test action and confirm audit/workflow logs update

## Rollback Triggers

Rollback immediately if any of these are observed:

1. Auth session failures spike after release.
2. Action registry calls produce repeated failed workflow runs.
3. Admin approval actions fail consistently.
4. Critical pages fail to load or render.

## Rollback Procedure

1. Re-deploy previous known-good release tag/artifact.
2. Disable new release traffic in hosting controls.
3. Run smoke checks on reverted release.
4. Verify logs return to expected baseline.
5. Document incident timeline and root-cause notes.

## Post-Rollback Follow-Up

1. Open issue with failure summary and impacted components.
2. Add test coverage for missed failure mode.
3. Update this playbook if rollback friction was observed.
