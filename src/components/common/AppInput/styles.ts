import { StyleSheet } from 'react-native';
import { AppRadii, Colors, ControlSize, Spacing } from '@/constants';
import type { ControlSizeKey } from '@/constants';

export const styles = StyleSheet.create({
  wrapper: { gap: Spacing.sm },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: AppRadii.control,
    backgroundColor: Colors.surface,
    borderCurve: 'continuous',
  },
  input: {
    flex: 1,
    height: '100%',
    minWidth: 0,
    paddingVertical: 0,
    color: Colors.text,
    includeFontPadding: false,
  },
  focused: { borderColor: Colors.primary, backgroundColor: Colors.card },
  invalid: { borderColor: Colors.error, backgroundColor: Colors.errorSoft },
  disabled: { backgroundColor: Colors.disabled },
});
const sizes = (size: ControlSizeKey) => {
  const metric = ControlSize[size];
  return StyleSheet.create({
    container: {
      height: metric.height,
      minHeight: metric.height,
      paddingHorizontal: metric.paddingHorizontal,
    },
    text: { fontSize: metric.fontSize, lineHeight: metric.lineHeight },
  });
};
export const inputSizes = { sm: sizes('sm'), md: sizes('md'), lg: sizes('lg') };
