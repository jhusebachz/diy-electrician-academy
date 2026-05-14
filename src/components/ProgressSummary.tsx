import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type ProgressSummaryProps = {
  completedCount: number;
  totalCount: number;
  activeCount: number;
  completedMinutes: number;
  currentModuleTitle: string;
};

export function ProgressSummary({
  completedCount,
  totalCount,
  activeCount,
  completedMinutes,
  currentModuleTitle,
}: ProgressSummaryProps) {
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Current module</Text>
      <Text style={styles.module}>{currentModuleTitle}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%` }]} />
      </View>
      <View style={styles.stats}>
        <Stat label="Completed" value={`${completedCount}/${totalCount}`} />
        <Stat label="Active" value={`${activeCount}`} />
        <Stat label="Minutes" value={`${completedMinutes}`} />
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.textSubtle,
    fontSize: typography.small,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  module: {
    color: colors.text,
    fontSize: typography.subheading,
    fontWeight: '800',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.backgroundMuted,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: colors.safetyYellow,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  stat: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    backgroundColor: colors.card,
  },
  statValue: {
    color: colors.text,
    fontSize: typography.subheading,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: spacing.xs,
  },
});
