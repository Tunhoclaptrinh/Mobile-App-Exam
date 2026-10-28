import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import {
  AppButton,
  AppText,
  ErrorBoundary,
  ScreenWrapper,
  ToastProvider,
  useToast,
} from '@/components/common';
import { Colors } from '@/constants';
import { AppStoreProvider, useAppStore } from '@/hooks/useAppStore';
import { AppNavigator } from '@/navigation/AppNavigator';
import { styles } from '@/appStyles';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.card,
    text: Colors.text,
    border: Colors.border,
  },
};

function AppContent(): React.JSX.Element {
  const {
    loading,
    error,
    recovered,
    canRestoreSamples,
    reload,
    restoreSamples,
  } = useAppStore();
  const toast = useToast();
  useEffect(() => {
    if (recovered) {
      toast.warning(
        'Đã khôi phục bản sao gần nhất. Vui lòng kiểm tra các thay đổi gần đây.',
        'Thư viện đã được khôi phục',
      );
    }
  }, [recovered, toast]);
  if (loading || error) {
    return (
      <ScreenWrapper topInset contentContainerStyle={styles.status}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : null}
        <AppText tone={error ? 'error' : 'secondary'}>
          {error ?? 'Đang mở thư viện…'}
        </AppText>
        {error ? (
          <AppButton
            title="Thử lại"
            onPress={() => {
              reload();
            }}
          />
        ) : null}
        {error && canRestoreSamples ? (
          <AppButton
            title="Khôi phục dữ liệu mẫu"
            variant="danger"
            onPress={() => {
              Alert.alert(
                'Khôi phục thư viện?',
                'Thay dữ liệu hiện tại bằng 5 sách mẫu? Dữ liệu lỗi sẽ được giữ riêng để kiểm tra.',
                [
                  { text: 'Huỷ', style: 'cancel' },
                  {
                    text: 'Khôi phục',
                    style: 'destructive',
                    onPress: () => {
                      restoreSamples();
                    },
                  },
                ],
              );
            }}
          />
        ) : null}
      </ScreenWrapper>
    );
  }
  return (
    <NavigationContainer theme={navigationTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <ErrorBoundary>
        <ToastProvider>
          <AppStoreProvider>
            <AppContent />
          </AppStoreProvider>
        </ToastProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
