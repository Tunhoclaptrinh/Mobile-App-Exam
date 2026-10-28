import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Keyboard, Pressable, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { DockMetrics } from '@/constants';
import { AppButton } from '../AppButton';
import { AppIcon } from '../AppIcon';
import { AppText } from '../AppText';
import type { AppBottomNavProps, BottomNavItem } from './types';
import { createBottomInset, createIndicatorStyle, styles } from './styles';

// Base floating dock: controlled selection, spring indicator, badges and FAB slot.
export function AppBottomNav({
  items,
  activeKey,
  onChange,
  centerFab,
}: AppBottomNavProps): React.JSX.Element | null {
  const { bottom } = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [layouts, setLayouts] = useState<
    Record<string, { x: number; width: number }>
  >({});
  const x = useRef(new Animated.Value(0)).current;
  const width = useRef(new Animated.Value(0)).current;
  const initialized = useRef(false);
  const insetStyle = useMemo(() => createBottomInset(bottom), [bottom]);
  const indicator = useMemo(() => createIndicatorStyle(x, width), [x, width]);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  useEffect(() => {
    const layout = layouts[activeKey];
    if (!layout) {
      return;
    }
    const targetX = layout.x + DockMetrics.indicatorInset;
    const targetWidth = Math.max(
      0,
      layout.width - 2 * DockMetrics.indicatorInset,
    );
    if (!initialized.current || reduced) {
      x.setValue(targetX);
      width.setValue(targetWidth);
      initialized.current = true;
      return;
    }
    const motion = Animated.parallel([
      Animated.spring(x, {
        toValue: targetX,
        damping: 24,
        mass: 0.65,
        stiffness: 280,
        useNativeDriver: false,
      }),
      Animated.spring(width, {
        toValue: targetWidth,
        damping: 24,
        mass: 0.65,
        stiffness: 280,
        useNativeDriver: false,
      }),
    ]);
    motion.start();
    return () => motion.stop();
  }, [activeKey, layouts, reduced, x, width]);
  const measure = useCallback((key: string, event: LayoutChangeEvent) => {
    const { x: itemX, width: itemWidth } = event.nativeEvent.layout;
    setLayouts(current =>
      current[key]?.x === itemX && current[key]?.width === itemWidth
        ? current
        : { ...current, [key]: { x: itemX, width: itemWidth } },
    );
  }, []);
  const renderItem = (item: BottomNavItem) => {
    const active = item.key === activeKey;
    return (
      <Pressable
        key={item.key}
        accessibilityRole="tab"
        accessibilityLabel={item.label}
        accessibilityState={{ selected: active, disabled: !!item.disabled }}
        disabled={item.disabled}
        onPress={() => onChange(item.key)}
        onLayout={event => measure(item.key, event)}
        style={({ pressed }) => [
          styles.item,
          active && !layouts[activeKey] && styles.selected,
          pressed && styles.pressed,
          item.disabled && styles.disabled,
        ]}
      >
        <View style={styles.iconRow}>
          <AppIcon
            name={item.icon}
            size={DockMetrics.icon}
            tone={active ? 'primary' : 'secondary'}
          />
          {!!item.badge && (
            <View style={styles.badge}>
              <AppText style={styles.badgeText}>
                {item.badge > 99 ? '99+' : item.badge}
              </AppText>
            </View>
          )}
        </View>
        <AppText
          style={[styles.label, active && styles.activeLabel]}
          tone="secondary"
        >
          {item.label}
        </AppText>
      </Pressable>
    );
  };
  if (keyboardVisible) {
    return null;
  }
  const split = Math.ceil(items.length / 2);
  return (
    <View pointerEvents="box-none" style={[styles.wrapper, insetStyle]}>
      <View style={styles.dock}>
        {!!layouts[activeKey] && (
          <Animated.View
            pointerEvents="none"
            style={[styles.indicator, indicator]}
          />
        )}
        {items.slice(0, split).map(renderItem)}
        {centerFab && (
          <View style={styles.fabSlot}>
            <AppButton
              title={centerFab.title}
              iconOnly
              shape="circle"
              style={styles.fab}
              leftIcon={<AppIcon name="plus" size={24} tone="white" />}
              onPress={centerFab.onPress}
              disabled={centerFab.disabled}
            />
          </View>
        )}
        {items.slice(split).map(renderItem)}
      </View>
    </View>
  );
}
