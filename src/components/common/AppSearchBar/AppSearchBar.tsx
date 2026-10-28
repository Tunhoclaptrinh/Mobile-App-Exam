import React from 'react';
import { Pressable } from 'react-native';
import { AppInput } from '../AppInput';
import { AppIcon } from '../AppIcon';
import { styles } from './styles';

export function AppSearchBar({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (value: string) => void;
}): React.JSX.Element {
  return (
    <AppInput
      label="Tìm kiếm"
      hideLabel
      placeholder="Tìm tên sách hoặc tác giả"
      value={value}
      onChangeText={onChangeText}
      autoCorrect={false}
      returnKeyType="search"
      leftIcon={<AppIcon name="search" tone="secondary" />}
      rightIcon={
        value ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Xoá nội dung tìm kiếm"
            onPress={() => onChangeText('')}
            style={styles.clear}
          >
            <AppIcon name="close" tone="secondary" size="sm" />
          </Pressable>
        ) : undefined
      }
    />
  );
}
