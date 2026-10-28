import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppleMeshBackground } from '../AppleMeshBackground';
import type { ScreenWrapperProps } from './types';
import { createContentInsets, styles } from './styles';

// Base composition: mesh background, fixed header/footer, safe area and keyboard.
export function ScreenWrapper({
  children,
  scrollable = false,
  topInset = false,
  contentContainerStyle,
  header,
  headerPlacement = 'fixed',
  estimatedHeaderHeight = 0,
  footer,
  bottomInset = true,
}: ScreenWrapperProps): React.JSX.Element {
  const [headerHeight, setHeaderHeight] = useState<number>();
  const overlay = !!header && headerPlacement === 'overlay';
  const top = overlay ? headerHeight ?? estimatedHeaderHeight : 0;
  const insetStyle = useMemo(
    () => createContentInsets(top, contentContainerStyle),
    [top, contentContainerStyle],
  );
  const renderContent = typeof children === 'function';
  const content = renderContent ? children({ top }) : children;
  return (
    <View style={styles.outer}>
      <AppleMeshBackground />
      <SafeAreaView
        style={styles.container}
        edges={
          topInset
            ? ['top', 'bottom', 'left', 'right']
            : bottomInset
            ? ['bottom', 'left', 'right']
            : ['left', 'right']
        }
      >
        <KeyboardAvoidingView
          style={styles.body}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {!overlay && header}
          {scrollable ? (
            <ScrollView
              style={styles.body}
              contentContainerStyle={[
                styles.scrollContent,
                contentContainerStyle,
                insetStyle,
              ]}
              contentInsetAdjustmentBehavior="never"
              automaticallyAdjustContentInsets={false}
              scrollIndicatorInsets={{ top }}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            >
              {content}
            </ScrollView>
          ) : (
            <View
              style={[
                styles.body,
                contentContainerStyle,
                !renderContent && insetStyle,
              ]}
            >
              {content}
            </View>
          )}
          {footer}
          {overlay && (
            <View
              pointerEvents="box-none"
              style={styles.headerOverlay}
              onLayout={event => {
                const height = Math.ceil(event.nativeEvent.layout.height);
                setHeaderHeight(current =>
                  current === height ? current : height,
                );
              }}
            >
              {header}
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
