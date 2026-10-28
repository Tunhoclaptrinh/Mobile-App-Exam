import { StyleSheet } from 'react-native';
import { Colors, Typography } from '@/constants';

export const styles = StyleSheet.create({
  ...Typography,
  default: { color: Colors.text },
  secondary: { color: Colors.textSecondary },
  error: { color: Colors.error },
  success: { color: Colors.success },
  primary: { color: Colors.primary },
});
