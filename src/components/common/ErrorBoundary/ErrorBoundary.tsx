import React from 'react';
import type { PropsWithChildren } from 'react';
import { AppText } from '../AppText';
import { AppButton } from '../AppButton';
import { ScreenWrapper } from '../ScreenWrapper';
import { styles } from './styles';

export class ErrorBoundary extends React.Component<
  PropsWithChildren,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <ScreenWrapper topInset contentContainerStyle={styles.content}>
          <AppText variant="title">Không thể hiển thị thư viện</AppText>
          <AppText tone="secondary">
            Vui lòng mở lại màn hình để tiếp tục.
          </AppText>
          <AppButton
            title="Thử lại"
            onPress={() => this.setState({ hasError: false })}
          />
        </ScreenWrapper>
      );
    }
    return this.props.children;
  }
}
