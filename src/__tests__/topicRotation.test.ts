import { describe, expect, it } from 'vitest';

import {
  getActiveTopics,
  initializeTopicProgress,
  markTopicLearned,
  refreshTopicsForToday,
} from '@/domain/topicRotation';
import type { Topic } from '@/domain/types';

function testTopic(id: string, prerequisites: string[] = []): Topic {
  return {
    id,
    moduleId: 'module-test',
    title: id,
    difficulty: 1,
    category: 'learn',
    estimatedMinutes: 5,
    summary: 'summary',
    lesson: 'lesson',
    learningObjectives: ['learn'],
    checklist: ['check'],
    safetyNotes: ['safety'],
    callProIf: ['call pro'],
    youtubeResources: [],
    searchQueries: [],
    prerequisites,
    completedAt: null,
    unlockedAt: null,
    isActive: false,
  };
}

const topics = [testTopic('one'), testTopic('two'), testTopic('three'), testTopic('four'), testTopic('five')];

describe('topic rotation', () => {
  it('initializes exactly 3 active topics when enough topics remain', () => {
    const progress = initializeTopicProgress(topics, new Date('2026-05-13T12:00:00'));

    expect(progress.activeTopicIds).toEqual(['one', 'two', 'three']);
  });

  it('keeps a completed topic visible on the same learning day', () => {
    const start = initializeTopicProgress(topics, new Date('2026-05-13T12:00:00'));
    const completed = markTopicLearned(start, 'one', new Date('2026-05-13T13:00:00'));
    const refreshed = refreshTopicsForToday(topics, completed, new Date('2026-05-13T14:00:00'));

    expect(refreshed.activeTopicIds).toEqual(['one', 'two', 'three']);
    expect(refreshed.completedTopics.one).toBeDefined();
  });

  it('removes completed active topics on the next learning day and appends replacements', () => {
    const start = initializeTopicProgress(topics, new Date('2026-05-13T12:00:00'));
    const completedOne = markTopicLearned(start, 'one', new Date('2026-05-13T13:00:00'));
    const completedTwo = markTopicLearned(completedOne, 'two', new Date('2026-05-13T14:00:00'));
    const refreshed = refreshTopicsForToday(topics, completedTwo, new Date('2026-05-14T05:00:00'));

    expect(refreshed.activeTopicIds).toEqual(['three', 'four', 'five']);
  });

  it('preserves incomplete topics ahead of newer replacements', () => {
    const start = initializeTopicProgress(topics, new Date('2026-05-13T12:00:00'));
    const completed = markTopicLearned(start, 'one', new Date('2026-05-13T13:00:00'));
    const refreshed = refreshTopicsForToday(topics, completed, new Date('2026-05-14T05:00:00'));

    expect(refreshed.activeTopicIds).toEqual(['two', 'three', 'four']);
  });

  it('does not advance the learning day before the refresh hour', () => {
    const start = initializeTopicProgress(topics, new Date('2026-05-13T12:00:00'));
    const completed = markTopicLearned(start, 'one', new Date('2026-05-13T13:00:00'));
    const beforeFour = refreshTopicsForToday(topics, completed, new Date('2026-05-14T03:59:00'));

    expect(beforeFour.activeTopicIds).toEqual(['one', 'two', 'three']);
  });

  it('handles all topics completed', () => {
    let progress = initializeTopicProgress(topics.slice(0, 3), new Date('2026-05-13T12:00:00'));
    progress = markTopicLearned(progress, 'one', new Date('2026-05-13T13:00:00'));
    progress = markTopicLearned(progress, 'two', new Date('2026-05-13T13:05:00'));
    progress = markTopicLearned(progress, 'three', new Date('2026-05-13T13:10:00'));

    const refreshed = refreshTopicsForToday(topics.slice(0, 3), progress, new Date('2026-05-14T05:00:00'));

    expect(refreshed.activeTopicIds).toEqual([]);
    expect(getActiveTopics(topics.slice(0, 3), refreshed)).toEqual([]);
  });

  it('respects prerequisites when appending new topics', () => {
    const prerequisiteTopics = [
      testTopic('safety'),
      testTopic('meter', ['safety']),
      testTopic('panel', ['meter']),
      testTopic('math'),
    ];
    let progress = initializeTopicProgress(prerequisiteTopics, new Date('2026-05-13T12:00:00'));

    expect(progress.activeTopicIds).toEqual(['safety', 'math']);

    progress = markTopicLearned(progress, 'safety', new Date('2026-05-13T13:00:00'));
    const refreshed = refreshTopicsForToday(prerequisiteTopics, progress, new Date('2026-05-14T05:00:00'));

    expect(refreshed.activeTopicIds).toEqual(['math', 'meter']);
  });
});
