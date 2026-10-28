import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppBottomNav,
  AppCard,
  AppDivider,
  AppScreenLayout,
  AppSearchBar,
  AppText,
  AppButton,
  AppIcon,
  EmptyState,
} from '@/components/common';
import { BookCard } from '@/components/BookCard';
import { CategoryChips } from '@/components/CategoryChips';
import type { CategoryValue } from '@/components/CategoryChips/types';
import { useAppStore } from '@/hooks/useAppStore';
import { useDeleteBook } from '@/hooks/useDeleteBook';
import type { BookListScreenProps } from '@/navigation/types';
import { filterBooks } from '@/utils/books';
import { createListInsets, styles } from './styles';

export function BookListScreen({
  route,
  navigation,
}: BookListScreenProps): React.JSX.Element {
  const { books, busy } = useAppStore();
  const confirmDelete = useDeleteBook();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryValue>('Tất cả');
  const [openId, setOpenId] = useState<string | null>(null);
  const { bottom } = useSafeAreaInsets();
  const listInsets = useMemo(() => createListInsets(bottom), [bottom]);
  const view = route.params?.view ?? 'all';
  const borrowedOnly = view === 'borrowed';
  const scoped = useMemo(
    () => (borrowedOnly ? books.filter(book => book.borrowed > 0) : books),
    [books, borrowedOnly],
  );
  const filtered = useMemo(
    () => filterBooks(scoped, query, category),
    [scoped, query, category],
  );
  const totalBorrowed = books.reduce((sum, book) => sum + book.borrowed, 0);
  const totalCopies = books.reduce((sum, book) => sum + book.quantity, 0);
  const borrowedTitles = books.filter(book => book.borrowed > 0).length;
  const add = () => {
    setOpenId(null);
    navigation.navigate('BookForm');
  };
  useEffect(() => {
    setOpenId(null);
  }, [query, category, view, busy, books]);

  return (
    <AppScreenLayout
      scrollable={false}
      bottomInset={false}
      contentContainerStyle={styles.layout}
      header={{
        title: borrowedOnly ? 'Đang mượn' : 'Thư viện',
        size: 'lg',
        titleAlign: 'left',
        subtitle: borrowedOnly
          ? 'Theo dõi từng cuốn sách được mượn.'
          : 'Không gian đọc của bạn.',
        rightAction: (
          <AppButton
            title="+ Thêm sách"
            size="sm"
            variant="primary"
            onPress={add}
            disabled={busy}
          />
        ),
        leading: (
          <View style={styles.headerIcon}>
            <AppIcon name={borrowedOnly ? 'clock' : 'book'} size={18} />
          </View>
        ),
      }}
      footer={
        <AppBottomNav
          activeKey={view}
          onChange={key => {
            if (key === 'all' || key === 'borrowed') {
              navigation.setParams({ view: key });
            }
          }}
          items={[
            { key: 'all', label: 'Tủ sách', icon: 'grid' },
            {
              key: 'borrowed',
              label: 'Đang mượn',
              icon: 'clock',
              badge: borrowedTitles,
            },
          ]}
          centerFab={{ title: '+ Thêm sách', onPress: add, disabled: busy }}
        />
      }
    >
      <FlatList
        style={styles.list}
        contentContainerStyle={[styles.content, listInsets]}
        data={filtered}
        keyExtractor={book => book.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setOpenId(null)}
        ListHeaderComponent={
          <View style={styles.header}>
            <AppCard variant="hero" padding="lg" gap="base">
              <AppText variant="overline" tone="secondary">
                TỔNG QUAN THƯ VIỆN
              </AppText>
              <View style={styles.stats}>
                <View style={styles.stat}>
                  <AppText variant="header">
                    {String(books.length).padStart(2, '0')}
                  </AppText>
                  <AppText variant="caption" tone="secondary">
                    Đầu sách
                  </AppText>
                </View>
                <AppDivider vertical />
                <View style={styles.stat}>
                  <AppText variant="header" tone="primary">
                    {String(totalBorrowed).padStart(2, '0')}
                  </AppText>
                  <AppText variant="caption" tone="secondary">
                    Đang mượn
                  </AppText>
                </View>
                <AppDivider vertical />
                <View style={styles.stat}>
                  <AppText variant="header">
                    {String(totalCopies - totalBorrowed).padStart(2, '0')}
                  </AppText>
                  <AppText variant="caption" tone="secondary">
                    Sẵn sàng
                  </AppText>
                </View>
              </View>
              <AppDivider />
              <AppText variant="caption" tone="secondary">
                {totalCopies} cuốn sách ·{' '}
                {new Set(books.map(book => book.category)).size} thể loại
              </AppText>
            </AppCard>
            <AppSearchBar value={query} onChangeText={setQuery} />
            <CategoryChips
              scrollable
              showAll
              value={category}
              onChange={setCategory}
            />
            <View style={styles.results}>
              <AppText variant="subtitle">
                {borrowedOnly ? 'Sách đang được mượn' : 'Bộ sưu tập'}
              </AppText>
              <AppText variant="caption" tone="secondary">
                {filtered.length} kết quả
              </AppText>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title={
              books.length
                ? borrowedOnly
                  ? 'Chưa có sách phù hợp'
                  : 'Không tìm thấy sách'
                : 'Thư viện chưa có sách'
            }
            description={
              books.length
                ? borrowedOnly
                  ? 'Sách đang được mượn sẽ xuất hiện tại đây. Bạn có thể thử đổi từ khoá hoặc thể loại.'
                  : 'Thử tên sách, tác giả hoặc thể loại khác.'
                : 'Nhấn nút + bên dưới để thêm đầu sách đầu tiên.'
            }
          />
        }
        ListFooterComponent={
          filtered.length ? (
            <AppText variant="caption" tone="secondary" style={styles.hint}>
              Vuốt trái để sửa hoặc xoá · Nhấn giữ để xoá
            </AppText>
          ) : undefined
        }
        renderItem={({ item }) => (
          <BookCard
            book={item}
            disabled={busy}
            onPress={() => {
              setOpenId(null);
              navigation.navigate('BookDetail', { bookId: item.id });
            }}
            onEdit={() => {
              setOpenId(null);
              navigation.navigate('BookForm', { bookId: item.id });
            }}
            onLongPress={() => {
              setOpenId(null);
              confirmDelete(item);
            }}
            swipeOpen={openId === item.id}
            onSwipeOpenChange={open =>
              setOpenId(current =>
                open ? item.id : current === item.id ? null : current,
              )
            }
          />
        )}
      />
    </AppScreenLayout>
  );
}
