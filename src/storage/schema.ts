export const STORAGE_VERSION = 1;

export type CompletionRecord = {
  topicId: string;
  completedAt: string;
  checklistItemIds: string[];
  skipReason?: string;
};

export type ChecklistState = Record<string, string[]>;

export type AppSettings = {
  dailyRefreshHour: number;
};

export type ProgressState = {
  schemaVersion: number;
  activeTopicIds: string[];
  completedTopics: Record<string, CompletionRecord>;
  checklistByTopic: ChecklistState;
  lastRefreshDay: string;
  settings: AppSettings;
};

export const defaultSettings: AppSettings = {
  dailyRefreshHour: 4,
};

export function createEmptyProgressState(lastRefreshDay: string): ProgressState {
  return {
    schemaVersion: STORAGE_VERSION,
    activeTopicIds: [],
    completedTopics: {},
    checklistByTopic: {},
    lastRefreshDay,
    settings: defaultSettings,
  };
}

export function isProgressState(value: unknown): value is ProgressState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ProgressState>;
  return (
    candidate.schemaVersion === STORAGE_VERSION &&
    Array.isArray(candidate.activeTopicIds) &&
    typeof candidate.completedTopics === 'object' &&
    candidate.completedTopics !== null &&
    typeof candidate.checklistByTopic === 'object' &&
    candidate.checklistByTopic !== null &&
    typeof candidate.lastRefreshDay === 'string' &&
    typeof candidate.settings === 'object' &&
    candidate.settings !== null &&
    typeof candidate.settings.dailyRefreshHour === 'number'
  );
}

export function serializeProgress(state: ProgressState): string {
  return JSON.stringify(state);
}

export function parseProgressState(raw: string): ProgressState | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    return isProgressState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
