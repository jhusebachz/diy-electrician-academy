import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type ModuleProgressProps = {
  title: string;
  summary: string;
  completed: number;
  total: number;
};

export function ModuleProgress({ title, summary, completed, total }: ModuleProgressProps) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.count}>
          {completed}/{total}
        </Text>
      </View>
      <Text style={styles.summary}>{summary}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    backgroundColor: colors.backgroundElevated,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: typography.subheading,
    fontWeight: '900',
  },
  count: {
    color: colors.safetyYellow,
    fontWeight: '900',
  },
  summary: {
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    lineHeight: 19,
  },
  track: {
    height: 7,
    backgroundColor: colors.backgroundMuted,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: 7,
    backgroundColor: colors.completed,
  },
});
