import React, { useEffect, useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import { usePreventRemove } from '@react-navigation/native';
import {
  AppButton,
  AppInput,
  AppText,
  EmptyState,
  AppScreenLayout,
  AppCard,
  AppIcon,
  useToast,
} from '@/components/common';
import { CategoryChips } from '@/components/CategoryChips';
import { useAppStore } from '@/hooks/useAppStore';
import type { BookFormScreenProps } from '@/navigation/types';
import type { BookFormValues } from '@/types/book';
import { toBookInput, validateBookForm } from '@/utils/books';
import { styles } from './styles';

export function BookFormScreen({
  route,
  navigation,
}: BookFormScreenProps): React.JSX.Element {
  const { books, busy, addBook, updateBook } = useAppStore();
  const toast = useToast();
  const bookId = route.params?.bookId;
  const book = books.find(item => item.id === bookId);
  const [values, setValues] = useState<BookFormValues>(() => ({
    title: book?.title ?? '',
    author: book?.author ?? '',
    category: book?.category ?? 'Giáo trình',
    year: book ? String(book.year) : '',
    quantity: book ? String(book.quantity) : '',
  }));
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const initialValues = useRef(values).current;
  const submitting = useRef(false);
  const errors = validateBookForm(values, book?.borrowed ?? 0);
  const disabled = busy || saving || saved;
  const dirty = (Object.keys(values) as Array<keyof BookFormValues>).some(
    key => values[key] !== initialValues[key],
  );

  usePreventRemove((dirty || saving) && !saved, ({ data }) => {
    if (submitting.current) {
      return;
    }
    Alert.alert(
      'Bỏ thay đổi?',
      'Thông tin chưa lưu sẽ bị mất nếu bạn rời màn hình này.',
      [
        { text: 'Tiếp tục nhập', style: 'cancel' },
        {
          text: 'Bỏ thay đổi',
          style: 'destructive',
          onPress: () => navigation.dispatch(data.action),
        },
      ],
    );
  });
  useEffect(() => {
    if (saved) {
      navigation.goBack();
    }
  }, [saved, navigation]);

  const setField = <K extends keyof BookFormValues>(
    key: K,
    value: BookFormValues[K],
  ) => {
    setValues(current => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    setSubmitted(true);
    if (Object.keys(errors).length || disabled || submitting.current) {
      return;
    }
    submitting.current = true;
    setSaving(true);
    try {
      if (bookId) {
        await updateBook(bookId, toBookInput(values));
      } else {
        await addBook(toBookInput(values));
      }
      toast.success(
        bookId ? 'Đã cập nhật thông tin sách.' : 'Đã thêm sách vào thư viện.',
        values.title.trim(),
      );
      setSaved(true);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Không thể lưu sách. Vui lòng thử lại.',
      );
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  };

  const header = {
    title: bookId ? 'Sửa sách' : 'Thêm sách',
    showBack: true,
    onBack: () => navigation.goBack(),
    titleAlign: 'center' as const,
  };

  if (bookId && !book) {
    return (
      <AppScreenLayout header={header}>
        <EmptyState
          title="Không tìm thấy sách"
          description="Sách có thể đã được xoá. Vui lòng quay lại danh sách."
        />
      </AppScreenLayout>
    );
  }

  return (
    <AppScreenLayout
      header={header}
      contentContainerStyle={styles.content}
      footer={
        <View style={styles.footer}>
          <AppButton
            title={saving ? 'Đang lưu…' : 'Lưu sách'}
            loading={saving}
            disabled={busy}
            onPress={handleSave}
            leftIcon={
              !saving ? <AppIcon name="check" tone="white" /> : undefined
            }
          />
          <AppButton
            title="Huỷ"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onPress={() => navigation.goBack()}
          />
        </View>
      }
    >
      <AppText variant="overline" tone="secondary">
        THÔNG TIN SÁCH
      </AppText>
      <AppCard padding="lg" gap="lg">
        <AppInput
          label="Tên sách"
          placeholder="Nhập tên sách"
          value={values.title}
          onChangeText={value => setField('title', value)}
          error={submitted ? errors.title : undefined}
          editable={!disabled}
        />
        <AppInput
          label="Tác giả"
          placeholder="Nhập tên tác giả"
          value={values.author}
          onChangeText={value => setField('author', value)}
          error={submitted ? errors.author : undefined}
          editable={!disabled}
        />
        <View style={styles.field}>
          <AppText variant="caption" tone="secondary">
            Thể loại
          </AppText>
          <CategoryChips
            value={values.category}
            disabled={disabled}
            onChange={value => {
              if (value !== 'Tất cả') {
                setField('category', value);
              }
            }}
          />
          {submitted && !!errors.category && (
            <AppText variant="caption" tone="error">
              {errors.category}
            </AppText>
          )}
        </View>
        <View style={styles.numbers}>
          <View style={styles.number}>
            <AppInput
              label="Năm xuất bản"
              placeholder={`1900 – ${new Date().getFullYear()}`}
              value={values.year}
              onChangeText={value => setField('year', value)}
              keyboardType="number-pad"
              error={submitted ? errors.year : undefined}
              editable={!disabled}
            />
          </View>
          <View style={styles.number}>
            <AppInput
              label="Tổng số cuốn"
              placeholder="Nhập số lượng"
              value={values.quantity}
              onChangeText={value => setField('quantity', value)}
              keyboardType="number-pad"
              error={submitted ? errors.quantity : undefined}
              editable={!disabled}
            />
          </View>
        </View>
      </AppCard>
      {book && (
        <AppCard variant="flat" gap="sm">
          <View style={styles.note}>
            <AppIcon name="info" tone="secondary" size="sm" />
            <AppText variant="caption" tone="secondary" style={styles.noteText}>
              Đang có {book.borrowed} cuốn được mượn. Tổng số cuốn phải từ{' '}
              {Math.max(1, book.borrowed)} trở lên.
            </AppText>
          </View>
        </AppCard>
      )}
      <AppText variant="caption" tone="secondary">
        Tên sách và tác giả là bắt buộc. Số lượng luôn bao gồm cả các cuốn đang
        được mượn.
      </AppText>
    </AppScreenLayout>
  );
}
