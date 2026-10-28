import { BOOK_CATEGORIES } from '@/types/book';
import type {
  Book,
  BookFormErrors,
  BookFormValues,
  BookInput,
} from '@/types/book';

export function validateBookForm(
  values: BookFormValues,
  borrowed = 0,
): BookFormErrors {
  const errors: BookFormErrors = {};
  if (!values.title.trim()) {
    errors.title = 'Vui lòng nhập tên sách.';
  }
  if (!values.author.trim()) {
    errors.author = 'Vui lòng nhập tác giả.';
  }
  if (!BOOK_CATEGORIES.includes(values.category)) {
    errors.category = 'Vui lòng chọn thể loại hợp lệ.';
  }
  const year = Number(values.year);
  const currentYear = new Date().getFullYear();
  if (
    !/^\d+$/.test(values.year.trim()) ||
    !Number.isSafeInteger(year) ||
    year < 1900 ||
    year > currentYear
  ) {
    errors.year = `Năm xuất bản phải là số nguyên từ 1900 đến ${currentYear}.`;
  }
  const quantity = Number(values.quantity);
  if (
    !/^\d+$/.test(values.quantity.trim()) ||
    !Number.isSafeInteger(quantity) ||
    quantity <= 0
  ) {
    errors.quantity = 'Số lượng phải là số nguyên lớn hơn 0.';
  } else if (quantity < borrowed) {
    errors.quantity = `Số lượng không được nhỏ hơn ${borrowed} cuốn đang mượn.`;
  }
  return errors;
}

export function toBookInput(values: BookFormValues): BookInput {
  return {
    title: values.title.trim(),
    author: values.author.trim(),
    category: values.category,
    year: Number(values.year),
    quantity: Number(values.quantity),
  };
}

export function assertBookInput(input: BookInput, borrowed = 0): void {
  const errors = validateBookForm(
    { ...input, year: String(input.year), quantity: String(input.quantity) },
    borrowed,
  );
  const error = Object.values(errors)[0];
  if (error) {
    throw new Error(error);
  }
}

export function normalizeBookInput(input: BookInput, borrowed = 0): BookInput {
  assertBookInput(input, borrowed);
  return {
    title: input.title.trim(),
    author: input.author.trim(),
    category: input.category,
    year: input.year,
    quantity: input.quantity,
  };
}

export function filterBooks(
  books: Book[],
  query: string,
  category: Book['category'] | 'Tất cả',
): Book[] {
  const search = query.trim().toLocaleLowerCase('vi');
  return books.filter(
    book =>
      (category === 'Tất cả' || book.category === category) &&
      (book.title.toLocaleLowerCase('vi').includes(search) ||
        book.author.toLocaleLowerCase('vi').includes(search)),
  );
}

export function changeBorrowed(book: Book, delta: 1 | -1): Book {
  const borrowed = book.borrowed + delta;
  if (borrowed < 0) {
    throw new Error('Sách này không có cuốn nào đang được mượn.');
  }
  if (borrowed > book.quantity) {
    throw new Error('Sách đã hết, không thể cho mượn thêm.');
  }
  return { ...book, borrowed };
}

export function assertCanDelete(book: Book): void {
  if (book.borrowed > 0) {
    throw new Error(
      'Không thể xoá sách đang có người mượn. Vui lòng nhận trả hết sách trước.',
    );
  }
}

export function isBook(value: unknown): value is Book {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const book = value as Book;
  return (
    typeof book.id === 'string' &&
    !!book.id.trim() &&
    typeof book.title === 'string' &&
    !!book.title.trim() &&
    typeof book.author === 'string' &&
    !!book.author.trim() &&
    BOOK_CATEGORIES.includes(book.category) &&
    Number.isSafeInteger(book.year) &&
    book.year >= 1900 &&
    book.year <= new Date().getFullYear() &&
    Number.isSafeInteger(book.quantity) &&
    book.quantity > 0 &&
    Number.isSafeInteger(book.borrowed) &&
    book.borrowed >= 0 &&
    book.borrowed <= book.quantity
  );
}
