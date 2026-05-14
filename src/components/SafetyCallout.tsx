import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type SafetyCalloutProps = {
  title?: string;
  children: React.ReactNode;
  tone?: 'warning' | 'danger' | 'info';
};

export function SafetyCallout({ title = 'Safety reminder', children, tone = 'warning' }: SafetyCalloutProps) {
  return (
    <View style={[styles.callout, tone === 'danger' && styles.danger, tone === 'info' && styles.info]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  callout: {
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: 8,
    padding: spacing.md,
    backgroundColor: '#2a2418',
    marginBottom: spacing.lg,
  },
  danger: {
    borderColor: colors.danger,
    backgroundColor: '#2b1b1d',
  },
  info: {
    borderColor: colors.borderStrong,
    backgroundColor: colors.backgroundElevated,
  },
  title: {
    color: colors.safetyYellow,
    fontSize: typography.small,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  body: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 21,
  },
});
