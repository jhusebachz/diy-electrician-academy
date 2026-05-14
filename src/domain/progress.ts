import { initializeTopicProgress } from '@/domain/topicRotation';
import type { Topic } from '@/domain/types';
import type { ProgressState } from '@/storage/schema';

export type ChecklistProgress = {
  completed: number;
  total: number;
  percent: number;
};

export function getChecklistItemId(topicId: string, index: number): string {
  return `${topicId}:checklist:${index}`;
}

export function getChecklistItemIds(topic: Pick<Topic, 'id' | 'checklist'>): string[] {
  return topic.checklist.map((_, index) => getChecklistItemId(topic.id, index));
}

export function getChecklistProgress(
  topic: Pick<Topic, 'id' | 'checklist'>,
  progress: ProgressState,
): ChecklistProgress {
  const completedIds = new Set(progress.checklistByTopic[topic.id] ?? []);
  const itemIds = getChecklistItemIds(topic);
  const completed = itemIds.filter((itemId) => completedIds.has(itemId)).length;
  const total = itemIds.length;

  return {
    completed,
    total,
    percent: total === 0 ? 100 : Math.round((completed / total) * 100),
  };
}

export function toggleChecklistItem(progress: ProgressState, topicId: string, itemId: string): ProgressState {
  const current = new Set(progress.checklistByTopic[topicId] ?? []);

  if (current.has(itemId)) {
    current.delete(itemId);
  } else {
    current.add(itemId);
  }

  return {
    ...progress,
    checklistByTopic: {
      ...progress.checklistByTopic,
      [topicId]: [...current],
    },
  };
}

export function canMarkTopicLearned(topic: Topic, progress: ProgressState): boolean {
  const checklist = getChecklistProgress(topic, progress);
  return checklist.total > 0 && checklist.completed === checklist.total;
}

export function resetProgress(topics: Topic[], now: Date, refreshHour = 4): ProgressState {
  return initializeTopicProgress(topics, now, refreshHour);
}

export function getCompletedCount(progress: ProgressState): number {
  return Object.keys(progress.completedTopics).length;
}

export function getCompletedEstimatedMinutes(topics: Topic[], progress: ProgressState): number {
  const completed = progress.completedTopics;
  return topics.reduce((total, topic) => total + (completed[topic.id] ? topic.estimatedMinutes : 0), 0);
}
