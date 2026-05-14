import AsyncStorage from '@react-native-async-storage/async-storage';

import { refreshTopicsForToday, initializeTopicProgress } from '@/domain/topicRotation';
import type { Topic } from '@/domain/types';
import { parseProgressState, serializeProgress, type ProgressState } from '@/storage/schema';

const PROGRESS_KEY = '@diy-electrician-academy/progress/v1';

export type StorageResult<T> = {
  data: T;
  error: string | null;
};

export async function loadProgress(topics: Topic[], now = new Date()): Promise<StorageResult<ProgressState>> {
  try {
    const raw = await AsyncStorage.getItem(PROGRESS_KEY);

    if (!raw) {
      const initialized = initializeTopicProgress(topics, now);
      await saveProgress(initialized);
      return { data: initialized, error: null };
    }

    const parsed = parseProgressState(raw);

    if (!parsed) {
      const recovered = initializeTopicProgress(topics, now);
      await saveProgress(recovered);
      return {
        data: recovered,
        error: 'Saved progress could not be read, so a fresh local progress file was created.',
      };
    }

    const refreshed = refreshTopicsForToday(topics, parsed, now);

    if (refreshed !== parsed) {
      await saveProgress(refreshed);
    }

    return { data: refreshed, error: null };
  } catch {
    return {
      data: initializeTopicProgress(topics, now),
      error: 'Local progress storage is unavailable right now. Changes may not persist until storage works again.',
    };
  }
}

export async function saveProgress(progress: ProgressState): Promise<string | null> {
  try {
    await AsyncStorage.setItem(PROGRESS_KEY, serializeProgress(progress));
    return null;
  } catch {
    return 'Progress could not be saved locally. Please try again.';
  }
}

export async function resetStoredProgress(topics: Topic[], now = new Date()): Promise<StorageResult<ProgressState>> {
  const reset = initializeTopicProgress(topics, now);

  try {
    await AsyncStorage.setItem(PROGRESS_KEY, serializeProgress(reset));
    return { data: reset, error: null };
  } catch {
    return {
      data: reset,
      error: 'Progress was reset in memory, but local storage could not be updated.',
    };
  }
}
