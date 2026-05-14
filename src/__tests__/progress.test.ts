import { describe, expect, it } from 'vitest';

import {
  canMarkTopicLearned,
  getChecklistItemId,
  getChecklistProgress,
  resetProgress,
  toggleChecklistItem,
} from '@/domain/progress';
import { initializeTopicProgress } from '@/domain/topicRotation';
import type { Topic } from '@/domain/types';
import { parseProgressState, serializeProgress } from '@/storage/schema';

const topic: Topic = {
  id: 'safety',
  moduleId: 'module-test',
  title: 'Safety',
  difficulty: 1,
  category: 'learn',
  estimatedMinutes: 5,
  summary: 'summary',
  lesson: 'lesson',
  learningObjectives: ['learn'],
  checklist: ['Read', 'Reflect'],
  safetyNotes: ['Stop when unsure'],
  callProIf: ['Anything is unsafe'],
  youtubeResources: [],
  searchQueries: [],
  prerequisites: [],
  completedAt: null,
  unlockedAt: null,
  isActive: false,
};

describe('progress helpers', () => {
  it('toggles and persists checklist state through serialization', () => {
    let progress = initializeTopicProgress([topic], new Date('2026-05-13T12:00:00'));
    progress = toggleChecklistItem(progress, topic.id, getChecklistItemId(topic.id, 0));

    const serialized = serializeProgress(progress);
    const parsed = parseProgressState(serialized);

    expect(parsed?.checklistByTopic[topic.id]).toEqual([getChecklistItemId(topic.id, 0)]);
  });

  it('requires all checklist items before marking learned', () => {
    let progress = initializeTopicProgress([topic], new Date('2026-05-13T12:00:00'));

    expect(canMarkTopicLearned(topic, progress)).toBe(false);

    progress = toggleChecklistItem(progress, topic.id, getChecklistItemId(topic.id, 0));
    progress = toggleChecklistItem(progress, topic.id, getChecklistItemId(topic.id, 1));

    expect(getChecklistProgress(topic, progress)).toEqual({ completed: 2, total: 2, percent: 100 });
    expect(canMarkTopicLearned(topic, progress)).toBe(true);
  });

  it('reset progress clears completion and restores initial active topics', () => {
    const progress = resetProgress([topic], new Date('2026-05-13T12:00:00'));

    expect(progress.completedTopics).toEqual({});
    expect(progress.activeTopicIds).toEqual(['safety']);
  });
});
