import { SEED_BOOKS } from '@/data/seedBooks';
import type { BookFormValues } from '@/types/book';
import {
  assertCanDelete,
  changeBorrowed,
  filterBooks,
  validateBookForm,
} from '@/utils/books';

const valid: BookFormValues = {
  title: 'Sách mới',
  author: 'Tác giả',
  category: 'Giáo trình',
  year: '2020',
  quantity: '3',
};

describe('Book rules', () => {
  test('requires title and author after trimming whitespace', () => {
    expect(
      validateBookForm({ ...valid, title: '  ', author: '\n' }),
    ).toMatchObject({ title: expect.any(String), author: expect.any(String) });
  });

  test.each([
    '',
    'abc',
    '1899',
    String(new Date().getFullYear() + 1),
    '2020.5',
    '2e3',
    'Infinity',
  ])('rejects invalid publication year %s', year => {
    expect(validateBookForm({ ...valid, year }).year).toBeDefined();
  });

  test('accepts both year boundaries', () => {
    expect(validateBookForm({ ...valid, year: '1900' })).toEqual({});
    expect(
      validateBookForm({ ...valid, year: String(new Date().getFullYear()) }),
    ).toEqual({});
  });

  test.each(['', '0', '-1', '1.5', 'hello', '9007199254740992'])(
    'rejects invalid quantity %s',
    quantity => {
      expect(validateBookForm({ ...valid, quantity }).quantity).toBeDefined();
    },
  );

  test('cannot reduce total quantity below the borrowed count', () => {
    expect(validateBookForm(valid, 4).quantity).toBeDefined();
    expect(validateBookForm(valid, 3)).toEqual({});
  });

  test('combines case-insensitive title/author search with category filtering', () => {
    expect(
      filterBooks(SEED_BOOKS, 'REACT NATIVE', 'Giáo trình').map(
        book => book.id,
      ),
    ).toEqual(['seed-1']);
    expect(
      filterBooks(SEED_BOOKS, 'TÔ HOÀI', 'Tất cả').map(book => book.id),
    ).toEqual(['seed-2']);
    expect(filterBooks(SEED_BOOKS, 'TÔ HOÀI', 'Khoa học')).toEqual([]);
  });

  test('borrowing and returning enforce the stock boundaries', () => {
    const full = { ...SEED_BOOKS[0], borrowed: 5 };
    expect(() => changeBorrowed(full, 1)).toThrow('hết');
    expect(changeBorrowed(full, -1).borrowed).toBe(4);
    const available = { ...full, borrowed: 0 };
    expect(() => changeBorrowed(available, -1)).toThrow('không có');
    expect(changeBorrowed(available, 1).borrowed).toBe(1);
    expect(available.borrowed).toBe(0);
  });

  test('blocks deletion until all borrowed copies have been returned', () => {
    expect(() => assertCanDelete(SEED_BOOKS[0])).toThrow('Không thể xoá');
    expect(() =>
      assertCanDelete({ ...SEED_BOOKS[0], borrowed: 0 }),
    ).not.toThrow();
  });
});
