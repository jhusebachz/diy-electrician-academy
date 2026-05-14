import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { validateExternalUrl } from '@/domain/urlAllowlist';
import type { TopicResource } from '@/domain/types';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type ResourceLinkProps = {
  resource: TopicResource;
};

export function ResourceLink({ resource }: ResourceLinkProps) {
  async function openResource() {
    const validation = validateExternalUrl(resource.url);

    if (!validation.ok) {
      Alert.alert('Link blocked', validation.reason);
      return;
    }

    try {
      await Linking.openURL(validation.url);
    } catch {
      Alert.alert('Could not open link', 'The link passed validation, but Android could not open it right now.');
    }
  }

  return (
    <Pressable onPress={openResource} style={({ pressed }) => [styles.resource, pressed && styles.pressed]}>
      <View style={styles.header}>
        <Text style={styles.type}>{resource.type}</Text>
        {resource.providerOrChannel ? <Text style={styles.provider}>{resource.providerOrChannel}</Text> : null}
      </View>
      <Text style={styles.title}>{resource.title}</Text>
      <Text style={styles.notes}>{resource.notes}</Text>
      <Text style={styles.safety}>{resource.safetyDisclaimer}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  resource: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.backgroundElevated,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.82,
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  type: {
    color: colors.safetyYellow,
    fontWeight: '900',
    fontSize: typography.tiny,
    textTransform: 'uppercase',
  },
  provider: {
    color: colors.textSubtle,
    fontSize: typography.tiny,
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  notes: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 18,
  },
  safety: {
    color: colors.warning,
    fontSize: typography.small,
    lineHeight: 18,
    marginTop: spacing.sm,
  },
});
