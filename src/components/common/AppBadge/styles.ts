import { StyleSheet } from 'react-native';
import { AppRadii, Colors, ControlSize, Spacing } from '@/constants';

export const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    height: ControlSize.badgeHeightSm,
    justifyContent: 'center',
    borderRadius: AppRadii.badge,
  },
  primary: { backgroundColor: Colors.primarySoft },
  success: { backgroundColor: Colors.successSoft },
  error: { backgroundColor: Colors.errorSoft },
  purple: { backgroundColor: Colors.purpleSoft },
  teal: { backgroundColor: Colors.tealSoft },
  primaryText: { color: Colors.primaryText },
  successText: { color: Colors.success },
  errorText: { color: Colors.error },
  purpleText: { color: Colors.purple },
  tealText: { color: Colors.teal },
});
