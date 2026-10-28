import { StyleSheet } from 'react-native';
import { Spacing } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  text: { textAlign: 'center' },
});
