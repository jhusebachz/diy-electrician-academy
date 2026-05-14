import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ChecklistProgress } from '@/domain/progress';
import type { Topic } from '@/domain/types';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type TopicCardProps = {
  topic: Topic;
  moduleTitle: string;
  checklistProgress: ChecklistProgress;
  completed: boolean;
  onOpen: () => void;
};

export function TopicCard({ topic, moduleTitle, checklistProgress, completed, onOpen }: TopicCardProps) {
  return (
    <View style={[styles.card, completed && styles.completedCard]}>
      <View style={styles.header}>
        <Text style={styles.module}>{moduleTitle}</Text>
        <View style={[styles.badge, completed && styles.completedBadge]}>
          <Text style={[styles.badgeText, completed && styles.completedBadgeText]}>
            {completed ? 'Completed today' : `Difficulty ${topic.difficulty}`}
          </Text>
        </View>
      </View>
      <Text style={styles.title}>{topic.title}</Text>
      <Text style={styles.summary}>{topic.summary}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{topic.category}</Text>
        <Text style={styles.meta}>{topic.estimatedMinutes} min</Text>
      </View>
      <Text style={styles.progressText}>
        Checklist {checklistProgress.completed}/{checklistProgress.total}
      </Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${checklistProgress.percent}%` }]} />
      </View>
      <Pressable onPress={onOpen} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
        <Text style={styles.buttonText}>Open topic</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  completedCard: {
    borderColor: colors.completed,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  module: {
    flex: 1,
    color: colors.textSubtle,
    fontSize: typography.small,
    fontWeight: '800',
  },
  badge: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.safetyYellow,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    color: colors.safetyYellow,
    fontSize: typography.tiny,
    fontWeight: '900',
  },
  completedBadge: {
    borderColor: colors.completed,
    backgroundColor: '#16351f',
  },
  completedBadgeText: {
    color: colors.completed,
  },
  title: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  summary: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
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
  progressText: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  progressTrack: {
    height: 7,
    backgroundColor: colors.backgroundMuted,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 7,
    backgroundColor: colors.completed,
  },
  button: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.safetyYellow,
    borderRadius: 8,
    marginTop: spacing.lg,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: colors.black,
    fontSize: typography.body,
    fontWeight: '900',
  },
});
