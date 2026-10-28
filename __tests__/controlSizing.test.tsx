import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { StyleSheet, View } from 'react-native';
import { AppButton, AppInput } from '@/components/common';
import type { ControlSizeKey } from '@/constants';

// Base's published size contract: button and input must render at the same size.
test.each<[ControlSizeKey, number, number, number]>([
  ['sm', 36, 13, 18],
  ['md', 44, 15, 20],
  ['lg', 52, 17, 22],
])(
  '%s controls use the base height and text metrics',
  async (size, height, fontSize, lineHeight) => {
    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(
        <View>
          <AppButton title="Lưu sách" size={size} />
          <AppInput label="Tên sách" size={size} />
        </View>,
      );
    });
    try {
      const button = tree.root.findAll(
        node =>
          node.props.accessibilityRole === 'button' &&
          typeof node.props.style === 'function',
      )[0];
      expect(
        StyleSheet.flatten(button.props.style({ pressed: false })),
      ).toMatchObject({ height, minHeight: height, borderRadius: 9999 });
      const input = tree.root.findByType(AppInput);
      const rows = input
        .findAllByType(View)
        .map(node => StyleSheet.flatten(node.props.style))
        .filter(style => style?.borderRadius === 9999);
      expect(
        rows.some(
          style => style.height === height && style.minHeight === height,
        ),
      ).toBe(true);
      const buttonText = tree.root
        .findByType(AppButton)
        .findAll(
          node =>
            node.props.children === 'Lưu sách' &&
            Array.isArray(node.props.style),
        );
      expect(
        buttonText.some(node => {
          const style = StyleSheet.flatten(node.props.style);
          return style.fontSize === fontSize && style.lineHeight === lineHeight;
        }),
      ).toBe(true);
    } finally {
      await act(async () => {
        tree.unmount();
      });
    }
  },
);
