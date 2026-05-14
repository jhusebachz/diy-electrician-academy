import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SafetyCallout } from '@/components/SafetyCallout';
import { safetyDoctrine } from '@/data/safety';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function SafetyScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Safety Doctrine</Text>
      <Text style={styles.subtitle}>
        The app teaches concepts. It does not replace a licensed electrician, local code, permits, or inspections.
      </Text>

      <SafetyCallout tone="danger">
        Electrical work can cause shock, fire, injury, or death. If unsure, stop and call a licensed electrician.
      </SafetyCallout>

      <Section title="General warnings" items={safetyDoctrine.generalWarnings} />
      <Section title="Never attempt as DIY" items={safetyDoctrine.neverAttempt} danger />
      <Section title="Call a licensed electrician when..." items={safetyDoctrine.callProWhen} danger />
      <Section title="Before any hands-on practice" items={safetyDoctrine.beforePracticeBoard} />
      <Section title="Emergency warning signs" items={safetyDoctrine.emergencySigns} danger />
      <Section title="Fire and shock hazard signs" items={safetyDoctrine.hazardSigns} danger />
    </ScrollView>
  );
}

function Section({ title, items, danger = false }: { title: string; items: string[]; danger?: boolean }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item) => (
        <View key={item} style={styles.row}>
          <View style={[styles.dot, danger && styles.dangerDot]} />
          <Text style={styles.item}>{item}</Text>
        </View>
      ))}
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  row: {
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
  dangerDot: {
    backgroundColor: colors.danger,
  },
  item: {
    flex: 1,
    color: colors.textMuted,
    lineHeight: 22,
    fontSize: typography.body,
  },
});
