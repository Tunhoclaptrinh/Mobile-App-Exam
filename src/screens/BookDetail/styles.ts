import { StyleSheet } from 'react-native';
import { Spacing } from '@/constants';
export const styles = StyleSheet.create({
  content: { gap: Spacing.xl },
  title: { gap: Spacing.xs },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  headingBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  stock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  section: { gap: Spacing.md },
  actions: { gap: Spacing.md },
  id: { textAlign: 'center' },
});
