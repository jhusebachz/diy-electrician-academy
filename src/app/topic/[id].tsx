import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';

import { ChecklistItem } from '@/components/ChecklistItem';
import { ResourceLink } from '@/components/ResourceLink';
import { SafetyCallout } from '@/components/SafetyCallout';
import { curriculumTopics, getModuleById, getTopicById } from '@/data/curriculum';
import { canMarkTopicLearned, getChecklistItemId, getChecklistProgress, toggleChecklistItem } from '@/domain/progress';
import { markTopicLearned } from '@/domain/topicRotation';
import type { ProgressState } from '@/storage/schema';
import { loadProgress, saveProgress } from '@/storage/storage';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function TopicDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const topic = getTopicById(params.id);
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

  const completed = Boolean(topic && progress?.completedTopics[topic.id]);
  const checklistProgress = useMemo(() => {
    if (!topic || !progress) {
      return null;
    }

    return getChecklistProgress(topic, progress);
  }, [progress, topic]);

  async function toggleItem(index: number) {
    if (!topic || !progress || completed) {
      return;
    }

    const next = toggleChecklistItem(progress, topic.id, getChecklistItemId(topic.id, index));
    setProgress(next);
    const saveError = await saveProgress(next);
    setError(saveError);
  }

  async function markLearned() {
    if (!topic || !progress || !canMarkTopicLearned(topic, progress)) {
      return;
    }

    const next = markTopicLearned(progress, topic.id, new Date());
    setProgress(next);
    const saveError = await saveProgress(next);
    setError(saveError);
    Alert.alert('Marked learned', 'This topic will stay on the home screen until the next local-day refresh.');
  }

  if (!topic) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Topic not found</Text>
        <Text style={styles.body}>The requested topic is not in the local curriculum.</Text>
      </View>
    );
  }

  if (!progress || !checklistProgress) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.safetyYellow} />
        <Text style={styles.body}>Loading topic progress...</Text>
      </View>
    );
  }

  const module = getModuleById(topic.moduleId);
  const canComplete = canMarkTopicLearned(topic, progress);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.module}>{module?.title}</Text>
      <Text style={styles.title}>{topic.title}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>Difficulty {topic.difficulty}</Text>
        <Text style={styles.meta}>{topic.category}</Text>
        <Text style={styles.meta}>{topic.estimatedMinutes} min</Text>
      </View>

      {completed ? (
        <SafetyCallout tone="info">Completed today. It will rotate out after the next local-day refresh.</SafetyCallout>
      ) : null}
      {error ? <SafetyCallout tone="danger">{error}</SafetyCallout> : null}

      <SafetyCallout>
        Educational only. Do not perform live work, panel work, service work, new circuits, or uncertain wiring. Stop
        and call a licensed electrician when unsure.
      </SafetyCallout>

      <Section title="Lesson">
        <Text style={styles.body}>{topic.lesson}</Text>
      </Section>

      <Section title="Learning objectives">
        {topic.learningObjectives.map((item) => (
          <Bullet key={item}>{item}</Bullet>
        ))}
      </Section>

      <Section title={`Checklist ${checklistProgress.completed}/${checklistProgress.total}`}>
        {topic.checklist.map((item, index) => (
          <ChecklistItem
            key={item}
            label={item}
            checked={(progress.checklistByTopic[topic.id] ?? []).includes(getChecklistItemId(topic.id, index))}
            onToggle={() => toggleItem(index)}
            disabled={completed}
          />
        ))}
      </Section>

      <Section title="Safety notes">
        {topic.safetyNotes.map((item) => (
          <Bullet key={item} tone="warning">
            {item}
          </Bullet>
        ))}
      </Section>

      <Section title="Call a licensed electrician if...">
        {topic.callProIf.map((item) => (
          <Bullet key={item} tone="danger">
            {item}
          </Bullet>
        ))}
      </Section>

      <Section title="Resources">
        {topic.youtubeResources.map((resource) => (
          <ResourceLink key={resource.id} resource={resource} />
        ))}
      </Section>

      {topic.quizQuestions?.length ? (
        <Section title="Quick check">
          {topic.quizQuestions.map((question) => (
            <View key={question.id} style={styles.quizCard}>
              <Text style={styles.quizPrompt}>{question.prompt}</Text>
              <Text style={styles.body}>Answer: {question.answer}</Text>
              <Text style={styles.muted}>{question.explanation}</Text>
            </View>
          ))}
        </Section>
      ) : null}

      <Pressable
        disabled={!canComplete || completed}
        onPress={markLearned}
        style={({ pressed }) => [
          styles.completeButton,
          (!canComplete || completed) && styles.completeButtonDisabled,
          pressed && canComplete && !completed && styles.pressed,
        ]}
      >
        <Text style={styles.completeButtonText}>{completed ? 'Learned today' : 'I learned this'}</Text>
      </Pressable>

      {!canComplete && !completed ? (
        <Text style={styles.helper}>Complete all checklist items before marking this topic learned.</Text>
      ) : null}
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Bullet({ children, tone = 'normal' }: { children: React.ReactNode; tone?: 'normal' | 'warning' | 'danger' }) {
  return (
    <View style={styles.bulletRow}>
      <View style={[styles.dot, tone === 'warning' && styles.warningDot, tone === 'danger' && styles.dangerDot]} />
      <Text style={styles.bulletText}>{children}</Text>
    </View>
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
    padding: spacing.lg,
    gap: spacing.md,
  },
  module: {
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
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  meta: {
    color: colors.steel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: typography.small,
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  body: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  muted: {
    color: colors.textSubtle,
    fontSize: typography.small,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.safetyYellow,
    marginTop: 7,
  },
  warningDot: {
    backgroundColor: colors.warning,
  },
  dangerDot: {
    backgroundColor: colors.danger,
  },
  bulletText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  quizCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    backgroundColor: colors.backgroundElevated,
  },
  quizPrompt: {
    color: colors.text,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  completeButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.completed,
  },
  completeButtonDisabled: {
    backgroundColor: colors.backgroundMuted,
  },
  completeButtonText: {
    color: colors.black,
    fontSize: typography.body,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.78,
  },
  helper: {
    color: colors.textSubtle,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
