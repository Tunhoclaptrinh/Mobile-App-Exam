import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { PanResponder, Text } from 'react-native';
import { AppSwipeableRow } from '@/components/common/AppSwipeableRow';
import {
  shouldCaptureSwipe,
  shouldOpenSwipe,
  clampSwipe,
} from '@/components/common/AppSwipeableRow/gesture';

jest.mock('@/hooks/useReducedMotion', () => ({ useReducedMotion: () => true }));

test('horizontal reveal does not steal vertical scrolling or a tap', () => {
  expect(shouldCaptureSwipe(-80, 12, false)).toBe(true);
  expect(shouldCaptureSwipe(-12, 80, false)).toBe(false);
  expect(shouldCaptureSwipe(-6, 1, false)).toBe(false);
  expect(shouldCaptureSwipe(80, 2, false)).toBe(false);
  expect(shouldCaptureSwipe(80, 2, true)).toBe(true);
  expect(clampSwipe(-500, 152)).toBe(-152);
  expect(clampSwipe(80, 152)).toBe(0);
  expect(shouldOpenSwipe(-20, 0, 152)).toBe(false);
  expect(shouldOpenSwipe(-90, 0, 152)).toBe(true);
  expect(shouldOpenSwipe(-90, 0.8, 152)).toBe(false);
});

test('full swipe only reveals actions, cancellation restores state, and disabled rows cannot swipe', async () => {
  const create = jest.spyOn(PanResponder, 'create');
  const onOpenChange = jest.fn();
  const onDelete = jest.fn();
  let tree!: renderer.ReactTestRenderer;
  const props = {
    open: false,
    onOpenChange,
    actions: [{ key: 'delete', label: 'Xoá', onPress: onDelete }],
  };
  await act(async () => {
    tree = renderer.create(
      <AppSwipeableRow {...props}>
        <Text>Book</Text>
      </AppSwipeableRow>,
    );
  });
  try {
    const handlers = create.mock.calls.at(-1)![0];
    const event = {} as never;
    const gesture = { dx: -300, dy: 1, vx: -0.8 } as never;
    expect(handlers.onMoveShouldSetPanResponder!(event, gesture)).toBe(true);
    await act(async () => {
      handlers.onPanResponderGrant!(event, gesture);
      handlers.onPanResponderMove!(event, gesture);
      handlers.onPanResponderRelease!(event, gesture);
    });
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(onDelete).not.toHaveBeenCalled();
    onOpenChange.mockClear();
    await act(async () => {
      handlers.onPanResponderTerminate!(event, gesture);
    });
    expect(onOpenChange).not.toHaveBeenCalled();
    await act(async () => {
      tree.update(
        <AppSwipeableRow {...props} disabled>
          <Text>Book</Text>
        </AppSwipeableRow>,
      );
    });
    expect(handlers.onMoveShouldSetPanResponder!(event, gesture)).toBe(false);
  } finally {
    await act(async () => {
      tree.unmount();
    });
    create.mockRestore();
  }
});

test('actions are hidden when closed, explicit presses close first, and disabled actions do not run', async () => {
  const events: string[] = [];
  const onOpenChange = jest.fn(() => events.push('close'));
  const onDelete = jest.fn(() => events.push('delete'));
  let tree!: renderer.ReactTestRenderer;
  const props = {
    onOpenChange,
    actions: [{ key: 'delete', label: 'Xoá', onPress: onDelete }],
  };
  await act(async () => {
    tree = renderer.create(
      <AppSwipeableRow {...props} open={false}>
        <Text>Book</Text>
      </AppSwipeableRow>,
    );
  });
  const button = () =>
    tree.root.findAll(
      node =>
        node.props.accessibilityLabel === 'Xoá' &&
        typeof node.props.style === 'function',
    )[0];
  try {
    expect(button().props.disabled).toBe(true);
    await act(async () => {
      button().props.onPress();
    });
    expect(events).toEqual([]);
    await act(async () => {
      tree.update(
        <AppSwipeableRow {...props} open>
          <Text>Book</Text>
        </AppSwipeableRow>,
      );
    });
    await act(async () => {
      button().props.onPress();
      button().props.onPress();
    });
    expect(events).toEqual(['close', 'delete']);
    events.length = 0;
    await act(async () => {
      tree.update(
        <AppSwipeableRow
          {...props}
          open
          actions={[{ ...props.actions[0], disabled: true }]}
        >
          <Text>Book</Text>
        </AppSwipeableRow>,
      );
    });
    await act(async () => {
      button().props.onPress();
    });
    expect(events).toEqual([]);
  } finally {
    await act(async () => {
      tree.unmount();
    });
  }
});
