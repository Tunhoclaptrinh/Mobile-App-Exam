import { StyleSheet } from 'react-native';
import { Colors } from '@/constants';

export const styles = StyleSheet.create({
  canvas: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  book: { width: 17, height: 21, borderWidth: 1.7, borderRadius: 3 },
  spine: {
    position: 'absolute',
    left: 4,
    top: 0,
    bottom: 0,
    borderLeftWidth: 1.4,
  },
  bookLine: { position: 'absolute', left: 7, right: 2, top: 5, height: 1.4 },
  grid: {
    width: 19,
    height: 19,
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 3,
  },
  square: { width: 8, height: 8, borderRadius: 2, borderWidth: 1.5 },
  circle: {
    width: 20,
    height: 20,
    borderWidth: 1.6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockHand: { position: 'absolute', width: 1.5, height: 6, top: 3, left: 8 },
  clockMinute: { position: 'absolute', width: 6, height: 1.5, top: 8, left: 8 },
  horizontal: { position: 'absolute', width: 18, height: 1.8, borderRadius: 1 },
  vertical: { position: 'absolute', width: 1.8, height: 18, borderRadius: 1 },
  diagonal: { transform: [{ rotate: '45deg' }] },
  reverseDiagonal: { transform: [{ rotate: '-45deg' }] },
  chevron: {
    width: 8,
    height: 8,
    borderTopWidth: 1.7,
    borderRightWidth: 1.7,
    transform: [{ rotate: '45deg' }],
  },
  back: { transform: [{ rotate: '-135deg' }] },
  search: {
    width: 15,
    height: 15,
    borderWidth: 1.7,
    borderRadius: 8,
    position: 'absolute',
    top: 2,
    left: 2,
  },
  handle: {
    width: 9,
    height: 1.7,
    position: 'absolute',
    right: 0,
    bottom: 4,
    transform: [{ rotate: '45deg' }],
  },
  check: {
    width: 8,
    height: 14,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    transform: [{ rotate: '45deg' }],
    marginTop: -4,
  },
  info: { fontSize: 15, fontWeight: '700', lineHeight: 18 },
  pen: {
    width: 6,
    height: 19,
    borderWidth: 1.6,
    borderRadius: 2,
    transform: [{ rotate: '40deg' }],
  },
  bin: {
    width: 13,
    height: 15,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    marginTop: 5,
  },
  lid: { width: 19, height: 1.5, position: 'absolute', top: 4 },
  lidHandle: { width: 7, height: 1.5, position: 'absolute', top: 1 },
  arrowLine: { width: 1.7, height: 18, position: 'absolute' },
  arrowHead: {
    width: 9,
    height: 9,
    borderTopWidth: 1.7,
    borderRightWidth: 1.7,
    position: 'absolute',
    top: 3,
    transform: [{ rotate: '-45deg' }],
  },
  down: { transform: [{ rotate: '180deg' }] },
});

export const createIconSize = (size: number) =>
  StyleSheet.create({
    frame: {
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
    },
    drawing: { transform: [{ scale: size / 24 }] },
  });

const tone = (color: string) =>
  StyleSheet.create({
    stroke: { borderColor: color },
    fill: { backgroundColor: color },
    text: { color },
  });
export const iconStyles = {
  primary: tone(Colors.primary),
  secondary: tone(Colors.textSecondary),
  white: tone(Colors.card),
  success: tone(Colors.success),
  error: tone(Colors.error),
  purple: tone(Colors.purple),
  teal: tone(Colors.teal),
};
