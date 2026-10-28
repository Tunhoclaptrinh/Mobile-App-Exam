import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, DockMetrics, Spacing } from '@/constants';
export const styles = StyleSheet.create({
  layout: { padding: 0, gap: 0 },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { flex: 1 },
  content: {
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.base,
    gap: Spacing.md,
    flexGrow: 1,
  },
  header: { gap: Spacing.base, paddingBottom: Spacing.xs },
  stats: { flexDirection: 'row', gap: Spacing.md },
  stat: { flex: 1, gap: Spacing.xs },
  results: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  hint: { textAlign: 'center', paddingVertical: Spacing.base },
});
export const createListInsets = (bottom: number) =>
  StyleSheet.create({
    content: {
      paddingBottom:
        DockMetrics.height + Math.max(bottom, Spacing.md) + Spacing.xxl,
    },
  }).content;
