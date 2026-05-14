import { toLocalDateKey } from '@/domain/dateUtils';
import { arePrerequisitesMet, getCompletedTopicIds } from '@/domain/prerequisites';
import type { Topic } from '@/domain/types';
import { createEmptyProgressState, type CompletionRecord, type ProgressState } from '@/storage/schema';

export const ACTIVE_TOPIC_LIMIT = 3;

export function initializeTopicProgress(topics: Topic[], now: Date, refreshHour = 4): ProgressState {
  const dayKey = toLocalDateKey(now, refreshHour);
  const empty = createEmptyProgressState(dayKey);
  return refillActiveTopics(topics, empty, ACTIVE_TOPIC_LIMIT);
}

export function markTopicLearned(
  progress: ProgressState,
  topicId: string,
  completedAt: Date,
  skipReason?: string,
): ProgressState {
  const checklistItemIds = progress.checklistByTopic[topicId] ?? [];
  const record: CompletionRecord = {
    topicId,
    completedAt: completedAt.toISOString(),
    checklistItemIds,
    ...(skipReason ? { skipReason } : {}),
  };

  return {
    ...progress,
    completedTopics: {
      ...progress.completedTopics,
      [topicId]: record,
    },
  };
}

export function refreshTopicsForToday(topics: Topic[], progress: ProgressState, now: Date): ProgressState {
  const refreshHour = progress.settings.dailyRefreshHour;
  const currentDay = toLocalDateKey(now, refreshHour);

  if (progress.lastRefreshDay === currentDay) {
    return refillActiveTopics(topics, progress, ACTIVE_TOPIC_LIMIT, true);
  }

  const activeTopicIds = progress.activeTopicIds.filter((topicId) => !progress.completedTopics[topicId]);
  const nextProgress = {
    ...progress,
    activeTopicIds,
    lastRefreshDay: currentDay,
  };

  return refillActiveTopics(topics, nextProgress, ACTIVE_TOPIC_LIMIT);
}

export function refillActiveTopics(
  topics: Topic[],
  progress: ProgressState,
  limit = ACTIVE_TOPIC_LIMIT,
  includeCompletedActive = true,
): ProgressState {
  const completedTopicIds = getCompletedTopicIds(progress);
  const existingActive = progress.activeTopicIds.filter((topicId) => {
    if (includeCompletedActive) {
      return true;
    }

    return !completedTopicIds.has(topicId);
  });

  const activeSet = new Set(existingActive);
  const nextActive = [...existingActive];

  for (const topic of topics) {
    if (nextActive.length >= limit) {
      break;
    }

    if (activeSet.has(topic.id) || completedTopicIds.has(topic.id)) {
      continue;
    }

    if (!arePrerequisitesMet(topic, completedTopicIds)) {
      continue;
    }

    nextActive.push(topic.id);
    activeSet.add(topic.id);
  }

  return {
    ...progress,
    activeTopicIds: nextActive.slice(0, limit),
  };
}

export function getActiveTopics(topics: Topic[], progress: ProgressState): Topic[] {
  const topicById = new Map(topics.map((topic) => [topic.id, topic]));
  return progress.activeTopicIds
    .map((topicId) => topicById.get(topicId))
    .filter((topic): topic is Topic => Boolean(topic));
}

export function getRemainingTopicCount(topics: Topic[], progress: ProgressState): number {
  const completed = getCompletedTopicIds(progress);
  return topics.filter((topic) => !completed.has(topic.id)).length;
}
