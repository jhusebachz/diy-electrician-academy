import Constants from 'expo-constants';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { SafetyCallout } from '@/components/SafetyCallout';
import { curriculumTopics } from '@/data/curriculum';
import type { ProgressState } from '@/storage/schema';
import { loadProgress, resetStoredProgress, saveProgress } from '@/storage/storage';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const REFRESH_HOURS = [3, 4, 5, 6];

export default function SettingsScreen() {
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      loadProgress(curriculumTopics).then((result) => {
        if (!mounted) {
          return;
        }

        setProgress(result.data);
        setMessage(result.error);
      });

      return () => {
        mounted = false;
      };
    }, []),
  );

  async function setRefreshHour(hour: number) {
    if (!progress) {
      return;
    }

    const next = {
      ...progress,
      settings: {
        ...progress.settings,
        dailyRefreshHour: hour,
      },
    };
    setProgress(next);
    setMessage(await saveProgress(next));
  }

  function confirmReset() {
    Alert.alert(
      'Reset local progress?',
      'This clears active topics, checklist state, and completed transcript on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const result = await resetStoredProgress(curriculumTopics);
            setProgress(result.data);
            setMessage(result.error ?? 'Progress reset.');
          },
        },
      ],
    );
  }

  if (!progress) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.safetyYellow} />
        <Text style={styles.body}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Local-only controls for the daily learning flow.</Text>

      {message ? (
        <SafetyCallout tone={message === 'Progress reset.' ? 'info' : 'danger'}>{message}</SafetyCallout>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily refresh time</Text>
        <Text style={styles.body}>
          Completed active topics rotate out when the local learning day advances. Default is 4:00 AM.
        </Text>
        <View style={styles.optionRow}>
          {REFRESH_HOURS.map((hour) => (
            <Pressable
              key={hour}
              onPress={() => setRefreshHour(hour)}
              style={[styles.option, progress.settings.dailyRefreshHour === hour && styles.optionActive]}
            >
              <Text style={[styles.optionText, progress.settings.dailyRefreshHour === hour && styles.optionTextActive]}>
                {hour}:00
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reset progress</Text>
        <Text style={styles.body}>Reset is local to this device and requires confirmation.</Text>
        <Pressable onPress={confirmReset} style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}>
          <Text style={styles.resetButtonText}>Reset local progress</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>App and update notes</Text>
        <Text style={styles.body}>Version: {Constants.expoConfig?.version ?? '1.0.0'}</Text>
        <Text style={styles.body}>
          EAS Update can deliver curriculum, UI, and JavaScript changes after a compatible APK is installed.
        </Text>
        <Text style={styles.body}>
          New native modules, permissions, app icons, or native config changes require a new APK build.
        </Text>
      </View>

      <SafetyCallout>
        Stored data is non-sensitive local learning progress only. No backend, login, analytics, ads, or push
        notifications are used in this MVP.
      </SafetyCallout>
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
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.lg,
    backgroundColor: colors.backgroundElevated,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  option: {
    minHeight: 44,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 8,
  },
  optionActive: {
    backgroundColor: colors.safetyYellow,
    borderColor: colors.safetyYellow,
  },
  optionText: {
    color: colors.text,
    fontWeight: '900',
  },
  optionTextActive: {
    color: colors.black,
  },
  resetButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.danger,
    marginTop: spacing.lg,
  },
  resetButtonText: {
    color: colors.white,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.8,
  },
});
