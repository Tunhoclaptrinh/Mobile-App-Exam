import { StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
  outer: { flex: 1 },
  container: { flex: 1 },
  body: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
});

export function createContentInsets(
  top: number,
  contentStyle: StyleProp<ViewStyle>,
) {
  const content = StyleSheet.flatten(contentStyle) ?? {};
  const padding =
    content.paddingTop ?? content.paddingVertical ?? content.padding ?? 0;
  return StyleSheet.create({
    content: { paddingTop: top + (typeof padding === 'number' ? padding : 0) },
  }).content;
}
