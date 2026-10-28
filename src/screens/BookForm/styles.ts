import { StyleSheet } from 'react-native';
import { Spacing } from '@/constants';
export const styles = StyleSheet.create({
  content: { gap: Spacing.md },
  field: { gap: Spacing.sm },
  footer: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  numbers: { flexDirection: 'row', gap: Spacing.base },
  number: { flex: 1 },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingRight: Spacing.xl,
  },
  noteText: { flex: 1 },
});
