# Requirements

REQ-001: The app must use Expo, React Native, TypeScript, Expo Router, and file-based routes under `src/app`.

REQ-002: The app must be Android-first and configured for EAS Build preview APK/internal distribution.

REQ-003: The app must use local-first persistence and must not require a backend, login, analytics, push notifications, ads, paid APIs, or cloud sync for the MVP.

REQ-004: The home screen must show exactly 3 active learning topics when at least 3 topics remain available.

REQ-005: Active topic cards must show title, module, difficulty, category, estimated minutes, summary, checklist progress, completion state, and an open-topic action.

REQ-006: When a topic is marked learned, it must remain visible for the rest of the current local day with a completed badge.

REQ-007: On the next local-day refresh, completed active topics must be removed, incomplete active topics must remain, and replacements must append to the bottom.

REQ-008: The app must move completed topics into a completed local transcript with completion timestamp and checklist state.

REQ-009: Topic detail screens must include lesson text, learning objectives, checklist, safety notes, call-pro notes, resources or search links, optional quiz content, and an "I learned this" action.

REQ-010: Users should complete all checklist items before marking a topic learned. Any bypass path must record a local reason.

REQ-011: The curriculum must include at least 40 useful topics across all 10 requested modules.

REQ-012: Every topic must include checklist items, safety notes, and resource or search links.

REQ-013: Topic categories must be one of `learn`, `observe`, `practice-board`, or `pro-only-awareness`.

REQ-014: Pro-only topics must be framed as awareness only and must not instruct the user to perform dangerous work.

REQ-015: The app must include a persistent Safety screen with general warnings, never-attempt list, call-pro list, practice-board checklist, emergency signs, hazard signs, and permit/code reminders.

REQ-016: The app must use TypeScript strict mode.

REQ-017: The app must validate external URLs before opening them, requiring HTTPS and an allowlisted hostname.

REQ-018: Allowed external domains are `youtube.com`, `youtu.be`, `google.com`, `osha.gov`, `nfpa.org`, `esfi.org`, `nist.gov`, and `owasp.org`.

REQ-019: The app must reject malformed URLs, non-HTTPS URLs, and unallowlisted hosts with a readable local error.

REQ-020: The app must include tests for topic rotation, same-day completion behavior, next-day replacement, checklist persistence, URL validation, reset progress, and all-completed edge cases.

REQ-021: The app must include SECURITY.md, threat model, security checklist, update workflow, curriculum design, and safety model docs.

REQ-022: The README must include app purpose, safety disclaimer, prerequisites, local dev commands, test/lint commands, Android build commands, APK install/update workflow, EAS Update workflow, curriculum editing notes, limitations, and security notes.

REQ-023: The app icon assets must be professional, high contrast, centered, Android-safe, and free of tiny text or copyrighted marks.

REQ-024: The app must not request unnecessary Android permissions.

REQ-025: Electrical safety messaging must state that the app is educational only, does not replace licensed electricians, local code, permits, or inspections, and that electrical work can cause shock, fire, injury, or death.
