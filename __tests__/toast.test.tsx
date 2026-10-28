import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { AccessibilityInfo } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  AppToast,
  ToastProvider,
  useToast,
} from '@/components/common/AppToast';

let toast: ReturnType<typeof useToast>;
let tree: renderer.ReactTestRenderer;
function Consumer(): null {
  toast = useToast();
  return null;
}

beforeEach(() => {
  jest.useFakeTimers();
  jest
    .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
    .mockResolvedValue(true);
});
afterEach(async () => {
  await act(async () => {
    tree?.unmount();
  });
  jest.restoreAllMocks();
  jest.useRealTimers();
});

async function mount(): Promise<void> {
  await act(async () => {
    tree = renderer.create(
      <SafeAreaProvider>
        <ToastProvider>
          <Consumer />
        </ToastProvider>
      </SafeAreaProvider>,
    );
  });
}

test('replacing a toast cancels the old timer and the new message dismisses at its own duration', async () => {
  await mount();
  await act(async () => {
    toast.show({ message: 'Thông báo đầu', duration: 100 });
  });
  await act(async () => {
    jest.advanceTimersByTime(80);
  });
  await act(async () => {
    toast.show({ message: 'Thông báo mới', duration: 100 });
  });
  await act(async () => {
    jest.advanceTimersByTime(30);
  });
  expect(tree.root.findByType(AppToast).props.message).toBe('Thông báo mới');
  await act(async () => {
    jest.advanceTimersByTime(70);
  });
  expect(tree.root.findAllByType(AppToast)).toHaveLength(0);
});

test('toast is accessible, closes manually and invokes onClose only once', async () => {
  const close = jest.fn();
  const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
  await mount();
  await act(async () => {
    toast.show({ title: 'Đã lưu', message: 'Sách mới', onClose: close });
  });
  expect(announce).toHaveBeenCalledWith('Đã lưu. Sách mới');
  expect(tree.root.findAllByType(AppToast)).toHaveLength(1);
  const dismiss = tree.root.findAll(
    item =>
      item.props.accessibilityLabel === 'Đóng thông báo' &&
      typeof item.props.onPress === 'function',
  )[0];
  await act(async () => {
    dismiss.props.onPress();
  });
  await act(async () => {
    jest.advanceTimersByTime(5000);
  });
  expect(tree.root.findAllByType(AppToast)).toHaveLength(0);
  expect(close).toHaveBeenCalledTimes(1);
});

test('duplicate dismiss callbacks cannot close a replacement toast created by onClose', async () => {
  await mount();
  const close = jest.fn(() => toast.success('Thông báo tiếp theo'));
  await act(async () => {
    toast.show({ message: 'Thông báo đầu', onClose: close });
  });
  const dismiss = tree.root.findByType(AppToast).props.onDismiss;
  await act(async () => {
    dismiss();
    dismiss();
  });
  expect(close).toHaveBeenCalledTimes(1);
  expect(tree.root.findByType(AppToast).props.message).toBe(
    'Thông báo tiếp theo',
  );
});
