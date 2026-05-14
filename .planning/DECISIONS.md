# Decisions

DEC-001: Use AsyncStorage for the MVP instead of SQLite because the app stores non-sensitive local progress only, and the simpler storage layer reduces native complexity.

DEC-002: Use pure TypeScript domain functions for topic rotation so the most important behavior can be tested without React Native.

DEC-003: Use URL search links for most YouTube resources and label them as searches unless a resource is a stable public institution page. The app must not imply manual video verification.

DEC-004: Keep dangerous residential work in `pro-only-awareness` content and avoid step-by-step instructions for panel work, service work, live work, new circuits, outdoor circuits, EV chargers, generators, aluminum wiring repair, and similar high-risk work.

DEC-005: Use a deterministic vector-style generated PNG icon rather than a text-heavy image. Android icons must stay recognizable at small sizes.

DEC-006: Do not add analytics, tracking SDKs, push notifications, login, payments, or location services in the MVP.
