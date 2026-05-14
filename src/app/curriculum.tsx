import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { ModuleProgress } from '@/components/ModuleProgress';
import { SafetyCallout } from '@/components/SafetyCallout';
import { curriculumModules, curriculumTopics } from '@/data/curriculum';
import { getTopicStatus } from '@/domain/prerequisites';
import type { ProgressState } from '@/storage/schema';
import { loadProgress } from '@/storage/storage';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function CurriculumScreen() {
  const router = useRouter();
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

  if (!progress) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.safetyYellow} />
        <Text style={styles.body}>Loading curriculum...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Curriculum</Text>
      <Text style={styles.subtitle}>
        A conservative pre-apprenticeship sequence from safety to fundamentals to readiness.
      </Text>
      {error ? <SafetyCallout tone="danger">{error}</SafetyCallout> : null}

      {curriculumModules.map((module) => {
        const moduleTopics = curriculumTopics.filter((topic) => topic.moduleId === module.id);
        const completed = moduleTopics.filter((topic) => progress.completedTopics[topic.id]).length;

        return (
          <View key={module.id} style={styles.moduleBlock}>
            <ModuleProgress
              title={module.title}
              summary={module.summary}
              completed={completed}
              total={moduleTopics.length}
            />
            {moduleTopics.map((topic) => {
              const status = getTopicStatus(topic, progress);
              const locked = status === 'locked';

              return (
                <Pressable
                  key={topic.id}
                  disabled={locked}
                  onPress={() => router.push(`/topic/${topic.id}`)}
                  style={({ pressed }) => [
                    styles.topicRow,
                    status === 'completed' && styles.completedRow,
                    status === 'active' && styles.activeRow,
                    locked && styles.lockedRow,
                    pressed && !locked && styles.pressed,
                  ]}
                >
                  <View style={styles.topicText}>
                    <Text style={[styles.topicTitle, locked && styles.lockedText]}>{topic.title}</Text>
                    <Text style={styles.topicMeta}>
                      {status} | difficulty {topic.difficulty} | {topic.category}
                    </Text>
                  </View>
                  <Text style={[styles.statusBadge, status === 'completed' && styles.completedBadge]}>{status}</Text>
                </Pressable>
              );
            })}
          </View>
        );
      })}
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
  moduleBlock: {
    marginBottom: spacing.xl,
  },
  topicRow: {
    minHeight: 62,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    backgroundColor: colors.card,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  topicText: {
    flex: 1,
  },
  topicTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
  },
  topicMeta: {
    color: colors.textSubtle,
    fontSize: typography.small,
    marginTop: spacing.xs,
    textTransform: 'capitalize',
  },
  statusBadge: {
    color: colors.safetyYellow,
    fontSize: typography.tiny,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  completedBadge: {
    color: colors.completed,
  },
  activeRow: {
    borderColor: colors.safetyYellow,
  },
  completedRow: {
    borderColor: colors.completed,
  },
  lockedRow: {
    opacity: 0.58,
  },
  lockedText: {
    color: colors.textSubtle,
  },
  pressed: {
    opacity: 0.78,
  },
});
