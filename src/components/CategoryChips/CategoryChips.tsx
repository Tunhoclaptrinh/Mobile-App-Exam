import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { BOOK_CATEGORIES } from '@/types/book';
import { AppText } from '../common';
import type { CategoryChipsProps, CategoryValue } from './types';
import { styles } from './styles';

export function CategoryChips({
  value,
  onChange,
  showAll = false,
  disabled = false,
  scrollable = false,
}: CategoryChipsProps): React.JSX.Element {
  const options: readonly CategoryValue[] = showAll
    ? ['Tất cả', ...BOOK_CATEGORIES]
    : BOOK_CATEGORIES;
  const chips = options.map(category => (
    <Pressable
      key={category}
      accessibilityRole="button"
      accessibilityLabel={`Thể loại ${category}`}
      accessibilityState={{ selected: category === value, disabled }}
      disabled={disabled}
      onPress={() => onChange(category)}
      style={({ pressed }) => [
        styles.chip,
        category === value && styles.selected,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <AppText
        variant="caption"
        style={category === value && styles.selectedText}
      >
        {category}
      </AppText>
    </Pressable>
  ));
  return scrollable ? (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.singleRow}
    >
      {chips}
    </ScrollView>
  ) : (
    <View style={styles.row}>{chips}</View>
  );
}
