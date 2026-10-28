import { StyleSheet } from 'react-native';
import { Colors, Gradients } from '@/constants';

export const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
    backgroundImage: Gradients.minimal,
  },
});
