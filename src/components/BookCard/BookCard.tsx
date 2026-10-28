import React from 'react';
import { View } from 'react-native';
import {
  AppBadge,
  AppCard,
  AppIcon,
  AppText,
  CupertinoIconTile,
  AppSwipeableRow,
} from '../common';
import type { BookCardProps } from './types';
import type { BadgeTone } from '../common/AppBadge/types';
import { styles } from './styles';

const categoryTones: Record<BookCardProps['book']['category'], BadgeTone> = {
  'Giáo trình': 'primary',
  'Tiểu thuyết': 'purple',
  'Khoa học': 'teal',
  'Thiếu nhi': 'success',
};

export function BookCard({
  book,
  onPress,
  onLongPress,
  onEdit,
  swipeOpen,
  onSwipeOpenChange,
  disabled = false,
}: BookCardProps): React.JSX.Element {
  const remaining = book.quantity - book.borrowed;
  const tone = categoryTones[book.category];
  return (
    <AppSwipeableRow
      open={swipeOpen}
      onOpenChange={onSwipeOpenChange}
      disabled={disabled}
      actions={[
        {
          key: 'edit',
          label: 'Sửa',
          accessibilityLabel: `Sửa ${book.title}`,
          icon: <AppIcon name="edit" />,
          onPress: onEdit,
        },
        {
          key: 'delete',
          label: 'Xoá',
          accessibilityLabel: `Xoá ${book.title}`,
          icon: <AppIcon name="trash" tone="error" />,
          destructive: true,
          onPress: onLongPress,
        },
      ]}
    >
      <AppCard
        disabled={disabled}
        onPress={() => (swipeOpen ? onSwipeOpenChange(false) : onPress())}
        onLongPress={onLongPress}
        accessibilityLabel={`${book.title}, ${book.author}, ${book.category}, còn ${remaining} cuốn`}
        accessibilityHint="Nhấn để xem chi tiết. Vuốt trái để sửa hoặc xoá. Nhấn giữ để xoá sách."
        accessibilityActions={[
          { name: 'edit', label: 'Sửa sách' },
          { name: 'delete', label: 'Xoá sách' },
        ]}
        onAccessibilityAction={event => {
          if (disabled) return;
          if (event.nativeEvent.actionName === 'edit') onEdit();
          if (event.nativeEvent.actionName === 'delete') onLongPress();
        }}
        style={styles.surface}
        gap="md"
      >
        <View style={styles.row}>
          <CupertinoIconTile name="book" tone={tone} />
          <View style={styles.info}>
            <AppText variant="subtitle" numberOfLines={2}>
              {book.title}
            </AppText>
            <AppText variant="caption" tone="secondary" numberOfLines={1}>
              {book.author}
            </AppText>
          </View>
          <AppIcon name="chevron" tone="secondary" size="sm" />
        </View>
        <View style={styles.footer}>
          <View style={styles.badges}>
            <AppBadge label={book.category} tone={tone} />
            {remaining === 0 && <AppBadge label="Hết sách" tone="error" />}
          </View>
          <AppText
            variant="caption"
            tone={remaining === 0 ? 'error' : 'secondary'}
          >
            {remaining === 0
              ? `0 / ${book.quantity} cuốn`
              : `${remaining} / ${book.quantity} cuốn còn lại`}
          </AppText>
        </View>
      </AppCard>
    </AppSwipeableRow>
  );
}
