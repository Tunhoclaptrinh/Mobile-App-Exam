import { StyleSheet } from 'react-native';
import { Spacing } from '@/constants';

export const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  body: { flex: 1, gap: Spacing.xs },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  value: { flexShrink: 1, textAlign: 'right' },
  pressed: { opacity: 0.6 },
  disabled: { opacity: 0.5 },
});
