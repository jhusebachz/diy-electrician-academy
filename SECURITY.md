# Security Policy

## Scope

DIY Electrician Academy is an MVP local-first educational app. It stores only non-sensitive learning progress, checklist state, completion timestamps, settings, and optional local skip reasons if a future bypass path is added.

## Controls

- TypeScript strict mode
- No backend
- No login
- No analytics or tracking SDKs
- No hardcoded secrets
- No push notifications
- No paid APIs
- No unnecessary Android permissions
- HTTPS-only URL validation
- External hostname allowlist
- Safe user-facing errors for blocked links
- Dependency audit scripts
- Pure domain tests for progress and URL validation

## Allowed External Domains

- `youtube.com`
- `youtu.be`
- `google.com`
- `osha.gov`
- `nfpa.org`
- `esfi.org`
- `nist.gov`
- `owasp.org`

## Reporting Issues

For this local project, record security issues in `.planning/RISKS.md` and fix them before distribution. Do not add secrets to the repo or chat transcript.

## Release Checklist

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run audit:prod
```

Review EAS Build configuration before publishing any APK outside trusted internal testing.
