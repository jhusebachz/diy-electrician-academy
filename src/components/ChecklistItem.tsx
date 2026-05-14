import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type ChecklistItemProps = {
  label: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

export function ChecklistItem({ label, checked, onToggle, disabled = false }: ChecklistItemProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={onToggle}
      style={({ pressed }) => [styles.row, checked && styles.rowChecked, pressed && !disabled && styles.pressed]}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        <Text style={styles.boxText}>{checked ? 'OK' : ''}</Text>
      </View>
      <Text style={[styles.label, checked && styles.labelChecked]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowChecked: {
    borderColor: colors.completed,
  },
  pressed: {
    opacity: 0.82,
  },
  box: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    borderColor: colors.completed,
    backgroundColor: colors.completed,
  },
  boxText: {
    color: colors.black,
    fontWeight: '800',
    fontSize: typography.tiny,
  },
  label: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 21,
  },
  labelChecked: {
    color: colors.textMuted,
  },
});
