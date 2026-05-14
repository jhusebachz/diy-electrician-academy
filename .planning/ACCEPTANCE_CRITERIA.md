# Acceptance Criteria

AC-001:
Given the user has 3 active topics,
When the user marks one topic learned,
Then it remains visible with a completed badge until the next local-day refresh.

AC-002:
Given the local date has advanced past the configured refresh time,
When the app launches or refreshes progress,
Then completed active topics are removed and replacement topics are appended to the bottom.

AC-003:
Given one active topic is incomplete,
When the next local-day refresh runs,
Then the incomplete topic remains ahead of newer replacement topics.

AC-004:
Given at least 3 uncompleted topics are available,
When active topics are initialized,
Then exactly 3 active topic IDs are selected in curriculum order.

AC-005:
Given fewer than 3 uncompleted topics remain,
When active topics are refreshed,
Then the app shows only the remaining available topics and does not duplicate completed topics.

AC-006:
Given all topics are completed,
When active topics are refreshed,
Then the app returns an empty active list and the UI shows an all-done state.

AC-007:
Given a checklist item is toggled,
When storage saves and reloads progress,
Then the checklist completion state is preserved.

AC-008:
Given progress exists,
When reset progress is confirmed,
Then active topics reset to the first available topics and completed history is cleared.

AC-009:
Given an HTTPS YouTube URL,
When the app validates the URL,
Then validation succeeds.

AC-010:
Given an HTTP URL, malformed URL, or URL on an unknown domain,
When the app validates the URL,
Then validation fails with a safe user-facing reason.

AC-011:
Given a pro-only topic,
When the user views it,
Then the topic is labeled as pro-only awareness and does not present the work as a DIY task.

AC-012:
Given the app config,
When Android permissions are inspected,
Then no unnecessary permissions are declared for the MVP.
