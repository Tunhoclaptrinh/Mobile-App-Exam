import { StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants';

export const styles = StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginVertical: Spacing.sm,
    backgroundColor: Colors.separator,
  },
});
