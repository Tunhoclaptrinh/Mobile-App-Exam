import React from 'react';
import { View } from 'react-native';
import {
  AppBadge,
  AppButton,
  AppCard,
  AppDivider,
  AppIcon,
  AppListItem,
  AppScreenLayout,
  AppText,
  CupertinoIconTile,
  EmptyState,
  useToast,
} from '@/components/common';
import { useAppStore } from '@/hooks/useAppStore';
import { useDeleteBook } from '@/hooks/useDeleteBook';
import type { BookDetailScreenProps } from '@/navigation/types';
import { styles } from './styles';

export function BookDetailScreen({
  route,
  navigation,
}: BookDetailScreenProps): React.JSX.Element {
  const { books, busy, borrowBook, returnBook } = useAppStore();
  const confirmDelete = useDeleteBook();
  const toast = useToast();
  const book = books.find(item => item.id === route.params.bookId);
  const header = {
    title: 'Chi tiết sách',
    showBack: true,
    onBack: () => navigation.goBack(),
    titleAlign: 'center' as const,
  };
  if (!book) {
    return (
      <AppScreenLayout header={header}>
        <EmptyState
          title="Không tìm thấy sách"
          description="Sách có thể đã được xoá. Vui lòng quay lại danh sách."
        />
      </AppScreenLayout>
    );
  }
  const remaining = book.quantity - book.borrowed;
  const changeLoan = async (action: 'borrow' | 'return') => {
    try {
      if (action === 'borrow') {
        await borrowBook(book.id);
        toast.success('Đã cho mượn 1 cuốn sách.', book.title);
      } else {
        await returnBook(book.id);
        toast.success('Đã nhận trả 1 cuốn sách.', book.title);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Vui lòng thử lại.');
    }
  };
  return (
    <AppScreenLayout header={header} contentContainerStyle={styles.content}>
      <AppCard variant="hero" padding="lg" gap="base">
        <View style={styles.heading}>
          <CupertinoIconTile name="book" />
          <View style={styles.headingBadges}>
            <AppBadge label={book.category} />
            {remaining === 0 && <AppBadge label="Hết sách" tone="error" />}
          </View>
        </View>
        <View style={styles.title}>
          <AppText variant="header">{book.title}</AppText>
          <AppText tone="secondary">{book.author}</AppText>
        </View>
        <AppDivider />
        <View style={styles.stock} accessibilityLiveRegion="polite">
          <View style={styles.title}>
            <AppText
              variant="title"
              tone={remaining === 0 ? 'error' : 'success'}
            >
              {remaining === 0 ? 'Hết sách' : `Còn lại ${remaining} cuốn`}
            </AppText>
            <AppText variant="caption" tone="secondary">
              {book.borrowed} cuốn đang được mượn / {book.quantity} cuốn
            </AppText>
          </View>
          <AppIcon
            name={remaining ? 'check' : 'clock'}
            tone={remaining ? 'success' : 'error'}
          />
        </View>
      </AppCard>
      <View style={styles.section}>
        <AppText variant="overline" tone="secondary">
          THÔNG TIN XUẤT BẢN
        </AppText>
        <AppCard gap="xs">
          <AppListItem title="Tác giả" value={book.author} />
          <AppDivider />
          <AppListItem title="Thể loại" value={book.category} />
          <AppDivider />
          <AppListItem title="Năm xuất bản" value={book.year} />
          <AppDivider />
          <AppListItem title="Tổng số cuốn" value={book.quantity} />
          <AppDivider />
          <AppListItem title="Đang được mượn" value={book.borrowed} />
        </AppCard>
      </View>
      <View style={styles.section}>
        <AppText variant="overline" tone="secondary">
          MƯỢN & TRẢ SÁCH
        </AppText>
        <View style={styles.actions}>
          <AppButton
            title="Cho mượn"
            leftIcon={
              <AppIcon
                name="borrow"
                tone={busy || !remaining ? 'secondary' : 'white'}
              />
            }
            disabled={busy || remaining === 0}
            onPress={() => changeLoan('borrow')}
          />
          <AppButton
            title="Nhận trả"
            variant="outline"
            leftIcon={
              <AppIcon
                name="return"
                tone={busy || !book.borrowed ? 'secondary' : 'primary'}
              />
            }
            disabled={busy || book.borrowed === 0}
            onPress={() => changeLoan('return')}
          />
        </View>
      </View>
      <View style={styles.actions}>
        <AppButton
          title="Sửa sách"
          variant="tonal"
          leftIcon={<AppIcon name="edit" />}
          disabled={busy}
          onPress={() => navigation.navigate('BookForm', { bookId: book.id })}
        />
        <AppButton
          title="Xoá sách"
          variant="danger"
          leftIcon={<AppIcon name="trash" tone="error" />}
          disabled={busy}
          onPress={() => confirmDelete(book, () => navigation.goBack())}
        />
      </View>
      <AppText variant="caption" tone="secondary" style={styles.id} selectable>
        Mã sách: {book.id}
      </AppText>
    </AppScreenLayout>
  );
}
