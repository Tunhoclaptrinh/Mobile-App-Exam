import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, ControlSize, Spacing } from '@/constants';
export const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  singleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  chip: {
    minHeight: ControlSize.sm.height,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.glassBorder,
    backgroundColor: Colors.surface,
  },
  selected: {
    backgroundColor: Colors.primarySoft,
    borderColor: Colors.primarySoft,
  },
  selectedText: { color: Colors.primary, fontWeight: '600' },
  pressed: { opacity: 0.65 },
  disabled: { opacity: 0.5 },
});
