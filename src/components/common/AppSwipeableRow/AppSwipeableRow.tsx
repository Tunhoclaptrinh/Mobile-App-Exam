import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, PanResponder, Pressable, View } from 'react-native';
import { AppText } from '../AppText';
import { useSwipeableAppearance } from './useSwipeableAppearance';
import type { AppSwipeableRowProps } from './types';
import {
  clampSwipe,
  shouldCaptureSwipe,
  shouldOpenSwipe,
  SWIPE_ACTION_WIDTH,
} from './gesture';
import { createTranslationStyle } from './styles';

// Controlled reveal only: even a full swipe must never run a destructive action.
export function AppSwipeableRow({
  children,
  actions,
  open,
  onOpenChange,
  disabled = false,
  style,
}: AppSwipeableRowProps): React.JSX.Element {
  const { styles, reducedMotion } = useSwipeableAppearance();
  const translateX = useRef(new Animated.Value(0)).current;
  const start = useRef(0);
  const position = useRef(0);
  const actionTaken = useRef(false);
  const latest = useRef({
    open,
    disabled,
    actions,
    onOpenChange,
    reducedMotion,
  });
  latest.current = { open, disabled, actions, onOpenChange, reducedMotion };
  const width = actions.length * SWIPE_ACTION_WIDTH;
  const translation = useMemo(
    () => createTranslationStyle(translateX),
    [translateX],
  );
  const settle = useMemo(
    () => (nextOpen: boolean) => {
      const current = latest.current;
      const toValue = nextOpen
        ? -current.actions.length * SWIPE_ACTION_WIDTH
        : 0;
      translateX.stopAnimation();
      if (current.reducedMotion) {
        translateX.setValue(toValue);
      } else {
        Animated.spring(translateX, {
          toValue,
          damping: 26,
          stiffness: 280,
          mass: 0.7,
          useNativeDriver: true,
        }).start();
      }
    },
    [translateX],
  );
  useEffect(() => {
    const id = translateX.addListener(({ value }) => {
      position.current = value;
    });
    return () => {
      translateX.removeListener(id);
      translateX.stopAnimation();
    };
  }, [translateX]);
  useEffect(() => {
    if (open) actionTaken.current = false;
    settle(open && !disabled);
  }, [open, disabled, width, reducedMotion, settle]);
  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => {
          const current = latest.current;
          return (
            !current.disabled &&
            current.actions.length > 0 &&
            shouldCaptureSwipe(gesture.dx, gesture.dy, current.open)
          );
        },
        onPanResponderGrant: () => {
          translateX.stopAnimation();
          start.current = position.current;
        },
        onPanResponderMove: (_, gesture) => {
          if (latest.current.disabled) return;
          translateX.setValue(
            clampSwipe(
              start.current + gesture.dx,
              latest.current.actions.length * SWIPE_ACTION_WIDTH,
            ),
          );
        },
        onPanResponderRelease: (_, gesture) => {
          const current = latest.current;
          const actionWidth = current.actions.length * SWIPE_ACTION_WIDTH;
          const offset = clampSwipe(start.current + gesture.dx, actionWidth);
          const nextOpen =
            !current.disabled &&
            shouldOpenSwipe(offset, gesture.vx, actionWidth);
          settle(nextOpen);
          current.onOpenChange(nextOpen);
        },
        onPanResponderTerminate: () => {
          settle(latest.current.open && !latest.current.disabled);
        },
        onPanResponderTerminationRequest: () => true,
        onShouldBlockNativeResponder: () => true,
      }),
    [settle, translateX],
  );
  return (
    <View style={[styles.container, style]}>
      <View
        style={styles.actions}
        pointerEvents={open && !disabled ? 'auto' : 'none'}
        accessibilityElementsHidden={!open || disabled}
        importantForAccessibility={
          open && !disabled ? 'auto' : 'no-hide-descendants'
        }
      >
        {actions.map(action => (
          <Pressable
            key={action.key}
            accessibilityRole="button"
            accessibilityLabel={action.accessibilityLabel ?? action.label}
            accessibilityState={{ disabled: disabled || !!action.disabled }}
            disabled={disabled || action.disabled || !open}
            onPress={() => {
              if (
                latest.current.disabled ||
                !latest.current.open ||
                action.disabled ||
                actionTaken.current
              )
                return;
              actionTaken.current = true;
              latest.current.onOpenChange(false);
              action.onPress();
            }}
            style={({ pressed }) => [
              styles.action,
              action.destructive && styles.destructive,
              pressed && styles.pressed,
              (disabled || action.disabled) && styles.disabled,
            ]}
          >
            {action.icon}
            <AppText
              variant="caption"
              style={[
                styles.label,
                action.destructive && styles.destructiveLabel,
              ]}
            >
              {action.label}
            </AppText>
          </Pressable>
        ))}
      </View>
      <Animated.View
        {...responder.panHandlers}
        style={[styles.foreground, translation]}
      >
        {children}
      </Animated.View>
    </View>
  );
}
