export const BOOK_CATEGORIES = [
  'Giáo trình',
  'Tiểu thuyết',
  'Khoa học',
  'Thiếu nhi',
] as const;
export type BookCategory = (typeof BOOK_CATEGORIES)[number];

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  year: number;
  quantity: number;
  borrowed: number;
}

export type BookInput = Omit<Book, 'id' | 'borrowed'>;
export interface BookFormValues {
  title: string;
  author: string;
  category: BookCategory;
  year: string;
  quantity: string;
}
export type BookFormErrors = Partial<Record<keyof BookFormValues, string>>;
