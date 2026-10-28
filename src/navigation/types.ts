import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  BookList: { view?: 'all' | 'borrowed' } | undefined;
  BookForm: { bookId?: string } | undefined;
  BookDetail: { bookId: string };
};

export type BookListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BookList'
>;
export type BookFormScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BookForm'
>;
export type BookDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BookDetail'
>;
