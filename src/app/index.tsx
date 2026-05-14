import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { ProgressSummary } from '@/components/ProgressSummary';
import { SafetyCallout } from '@/components/SafetyCallout';
import { TopicCard } from '@/components/TopicCard';
import { curriculumTopics, getModuleById } from '@/data/curriculum';
import { getChecklistProgress, getCompletedCount, getCompletedEstimatedMinutes } from '@/domain/progress';
import { getActiveTopics, getRemainingTopicCount } from '@/domain/topicRotation';
import { loadProgress } from '@/storage/storage';
import type { ProgressState } from '@/storage/schema';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function HomeScreen() {
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
      <View style={styles.loading}>
        <ActivityIndicator color={colors.safetyYellow} />
        <Text style={styles.loadingText}>Loading local progress...</Text>
      </View>
    );
  }

  const activeTopics = getActiveTopics(curriculumTopics, progress);
  const currentModule = activeTopics[0] ? getModuleById(activeTopics[0].moduleId) : undefined;
  const completedCount = getCompletedCount(progress);
  const remainingCount = getRemainingTopicCount(curriculumTopics, progress);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Android-first local learning</Text>
      <Text style={styles.title}>Today&apos;s 3-topic trade school track</Text>
      <Text style={styles.subtitle}>
        Learn the concepts, respect the hazards, and stop before real electrical risk begins.
      </Text>

      <View style={styles.navRow}>
        <NavButton label="Curriculum" onPress={() => router.push('/curriculum')} />
        <NavButton label="Transcript" onPress={() => router.push('/completed')} />
        <NavButton label="Safety" onPress={() => router.push('/safety')} />
        <NavButton label="Settings" onPress={() => router.push('/settings')} />
      </View>

      {error ? <SafetyCallout tone="danger">{error}</SafetyCallout> : null}

      <ProgressSummary
        completedCount={completedCount}
        totalCount={curriculumTopics.length}
        activeCount={activeTopics.length}
        completedMinutes={getCompletedEstimatedMinutes(curriculumTopics, progress)}
        currentModuleTitle={currentModule?.title ?? 'All modules complete'}
      />

      <SafetyCallout>
        This app is educational only. It does not replace a licensed electrician, local code, permits, or inspections.
        Electrical work can cause shock, fire, injury, or death.
      </SafetyCallout>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active topics</Text>
        <Text style={styles.sectionMeta}>{remainingCount} remaining</Text>
      </View>

      {activeTopics.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>All seeded topics are complete.</Text>
          <Text style={styles.emptyText}>Your local transcript has the history. Use Settings to reset progress.</Text>
        </View>
      ) : (
        activeTopics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            moduleTitle={getModuleById(topic.moduleId)?.title ?? 'Unknown module'}
            checklistProgress={getChecklistProgress(topic, progress)}
            completed={Boolean(progress.completedTopics[topic.id])}
            onOpen={() => router.push(`/topic/${topic.id}`)}
          />
        ))
      )}
    </ScrollView>
  );
}

function NavButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}>
      <Text style={styles.navButtonText}>{label}</Text>
    </Pressable>
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textMuted,
  },
  eyebrow: {
    color: colors.safetyYellow,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    lineHeight: 34,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  navRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  navButton: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundElevated,
  },
  navButtonText: {
    color: colors.text,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.78,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  sectionMeta: {
    color: colors.textMuted,
    fontWeight: '700',
  },
  emptyCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.lg,
    backgroundColor: colors.backgroundElevated,
  },
  emptyTitle: {
    color: colors.text,
    fontWeight: '900',
    fontSize: typography.subheading,
  },
  emptyText: {
    color: colors.textMuted,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
});
