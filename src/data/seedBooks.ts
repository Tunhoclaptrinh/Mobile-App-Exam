import type { Book } from '@/types/book';

export const SEED_BOOKS: Book[] = [
  {
    id: 'seed-1',
    title: 'Lập trình React Native',
    author: 'Nguyễn Văn An',
    category: 'Giáo trình',
    year: 2024,
    quantity: 5,
    borrowed: 2,
  },
  {
    id: 'seed-2',
    title: 'Dế Mèn phiêu lưu ký',
    author: 'Tô Hoài',
    category: 'Thiếu nhi',
    year: 2020,
    quantity: 4,
    borrowed: 0,
  },
  {
    id: 'seed-3',
    title: 'Nhà giả kim',
    author: 'Paulo Coelho',
    category: 'Tiểu thuyết',
    year: 2021,
    quantity: 3,
    borrowed: 3,
  },
  {
    id: 'seed-4',
    title: 'Lược sử thời gian',
    author: 'Stephen Hawking',
    category: 'Khoa học',
    year: 2019,
    quantity: 6,
    borrowed: 1,
  },
  {
    id: 'seed-5',
    title: 'Cấu trúc dữ liệu và giải thuật',
    author: 'Trần Minh Đức',
    category: 'Giáo trình',
    year: 2023,
    quantity: 7,
    borrowed: 0,
  },
];
