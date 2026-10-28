import { StyleSheet } from 'react-native';
import { Colors, Typography } from '@/constants';

export const styles = StyleSheet.create({
  header: { backgroundColor: Colors.card },
  headerTitle: { ...Typography.subtitle },
  content: { backgroundColor: Colors.background },
});
