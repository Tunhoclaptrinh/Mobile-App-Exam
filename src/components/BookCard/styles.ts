import { StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants';
export const styles = StyleSheet.create({
  surface: { backgroundColor: Colors.card },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  info: { flex: 1, gap: Spacing.xs },
  badges: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
});
