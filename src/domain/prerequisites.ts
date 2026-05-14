import type { Topic, TopicStatus } from '@/domain/types';
import type { ProgressState } from '@/storage/schema';

export function arePrerequisitesMet(topic: Pick<Topic, 'prerequisites'>, completedTopicIds: Set<string>): boolean {
  return topic.prerequisites.every((topicId) => completedTopicIds.has(topicId));
}

export function getCompletedTopicIds(progress: Pick<ProgressState, 'completedTopics'>): Set<string> {
  return new Set(Object.keys(progress.completedTopics));
}

export function getTopicStatus(topic: Topic, progress: ProgressState): TopicStatus {
  if (progress.completedTopics[topic.id]) {
    return 'completed';
  }

  if (progress.activeTopicIds.includes(topic.id)) {
    return 'active';
  }

  const completed = getCompletedTopicIds(progress);
  return arePrerequisitesMet(topic, completed) ? 'unlocked' : 'locked';
}
