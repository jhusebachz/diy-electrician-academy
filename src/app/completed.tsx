import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { ModuleProgress } from '@/components/ModuleProgress';
import { SafetyCallout } from '@/components/SafetyCallout';
import { curriculumModules, curriculumTopics, getTopicById } from '@/data/curriculum';
import { getCompletedEstimatedMinutes } from '@/domain/progress';
import type { ProgressState } from '@/storage/schema';
import { loadProgress } from '@/storage/storage';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function CompletedScreen() {
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      loadProgress(curriculumTopics).then((result) => {
        if (!mounted) {
          return;
        }

        setProgress(result.data);
        setError(result.error);
      });

      return () => {
        mounted = false;
      };
    }, []),
  );

  const completions = useMemo(() => {
    if (!progress) {
      return [];
    }

    return Object.values(progress.completedTopics).sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  }, [progress]);

  if (!progress) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.safetyYellow} />
        <Text style={styles.body}>Loading transcript...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Completed Transcript</Text>
      <Text style={styles.subtitle}>
        Local-only learning history. This is not certification, licensing, or proof of electrical qualification.
      </Text>
      {error ? <SafetyCallout tone="danger">{error}</SafetyCallout> : null}

      <View style={styles.summaryCard}>
        <Text style={styles.summaryValue}>{completions.length}</Text>
        <Text style={styles.summaryLabel}>topics completed</Text>
        <Text style={styles.summaryMeta}>
          {getCompletedEstimatedMinutes(curriculumTopics, progress)} estimated learning minutes
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Module progress</Text>
      {curriculumModules.map((module) => {
        const moduleTopics = curriculumTopics.filter((topic) => topic.moduleId === module.id);
        const completed = moduleTopics.filter((topic) => progress.completedTopics[topic.id]).length;

        return (
          <ModuleProgress
            key={module.id}
            title={module.title}
            summary={module.summary}
            completed={completed}
            total={moduleTopics.length}
          />
        );
      })}

      <Text style={styles.sectionTitle}>History</Text>
      {completions.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.body}>No completed topics yet.</Text>
        </View>
      ) : (
        completions.map((record) => {
          const topic = getTopicById(record.topicId);

          return (
            <View key={record.topicId} style={styles.historyCard}>
              <Text style={styles.historyTitle}>{topic?.title ?? record.topicId}</Text>
              <Text style={styles.historyMeta}>{new Date(record.completedAt).toLocaleString()}</Text>
              <Text style={styles.historyMeta}>{record.checklistItemIds.length} checklist items recorded</Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  body: {
    color: colors.textMuted,
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.lg,
    backgroundColor: colors.backgroundElevated,
    marginBottom: spacing.xl,
  },
  summaryValue: {
    color: colors.safetyYellow,
    fontSize: 36,
    fontWeight: '900',
  },
  summaryLabel: {
    color: colors.text,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  summaryMeta: {
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  emptyCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.lg,
    backgroundColor: colors.backgroundElevated,
  },
  historyCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    backgroundColor: colors.card,
    marginBottom: spacing.sm,
  },
  historyTitle: {
    color: colors.text,
    fontWeight: '900',
    fontSize: typography.body,
    marginBottom: spacing.xs,
  },
  historyMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: spacing.xs,
  },
});
