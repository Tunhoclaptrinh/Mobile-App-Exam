import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderMetrics, Spacing } from '@/constants';
import { AppHeader } from '../AppHeader';
import { ScreenWrapper } from '../ScreenWrapper';
import type { AppScreenLayoutProps } from './types';
import { styles } from './styles';

// Same header/body/footer composition as the base AppScreenLayout.
export function AppScreenLayout({
  header,
  footer,
  scrollable = true,
  children,
  contentContainerStyle,
  headerPlacement = 'overlay',
  ...props
}: AppScreenLayoutProps): React.JSX.Element {
  const { top } = useSafeAreaInsets();
  const estimatedHeaderHeight =
    top +
    Spacing.sm * 2 +
    (header.size === 'lg' ? HeaderMetrics.largeHeight : HeaderMetrics.height);
  return (
    <ScreenWrapper
      {...props}
      scrollable={scrollable}
      header={<AppHeader {...header} />}
      headerPlacement={headerPlacement}
      estimatedHeaderHeight={estimatedHeaderHeight}
      footer={footer}
      contentContainerStyle={[styles.content, contentContainerStyle]}
    >
      {children}
    </ScreenWrapper>
  );
}
