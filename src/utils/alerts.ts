import { Alert } from 'react-native';

export function showOperationError(error: unknown): void {
  Alert.alert(
    'Không thể thực hiện',
    error instanceof Error
      ? error.message
      : 'Đã có lỗi xảy ra. Vui lòng thử lại.',
  );
}
