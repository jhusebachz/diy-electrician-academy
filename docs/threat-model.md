# Threat Model

## Scope

MVP mobile app with local-only progress storage and external educational links. No backend, account, analytics, payment, ads, location, or push notification services.

## Assets

- Local learning progress
- Checklist completion
- Completion timestamps
- User-entered skip reasons, if any

These are low-sensitivity records but still should not be leaked or logged unnecessarily.

## Trust Boundaries

- App code and bundled curriculum
- Local device storage
- External browser or YouTube app opened by user action
- EAS Build and EAS Update distribution

## Main Risks

- Unsafe external links
- Dependency supply-chain issues
- Misleading safety content
- Accidental personal data collection
- Broken local progress state

## Mitigations

- HTTPS-only URL allowlist
- No tracking SDKs
- No backend secrets
- TypeScript strict mode
- Local-only non-sensitive storage
- Domain tests for progress behavior
- Security and dependency audit commands
- Clear safety boundaries throughout the app
