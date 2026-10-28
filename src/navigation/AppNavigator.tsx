import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { BookListScreen } from '@/screens/BookList';
import { BookFormScreen } from '@/screens/BookForm';
import { BookDetailScreen } from '@/screens/BookDetail';
import type { RootStackParamList } from './types';
import { styles } from './styles';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator(): React.JSX.Element {
  const reduced = useReducedMotion();
  return (
    <Stack.Navigator
      initialRouteName="BookList"
      screenOptions={{
        headerShown: false,
        animation: reduced ? 'none' : 'slide_from_right',
        contentStyle: styles.content,
      }}
    >
      <Stack.Screen
        name="BookList"
        component={BookListScreen}
        options={{ title: 'Thư viện' }}
      />
      <Stack.Screen
        name="BookForm"
        component={BookFormScreen}
        options={({ route }) => ({
          title: route.params?.bookId ? 'Sửa sách' : 'Thêm sách',
        })}
      />
      <Stack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{ title: 'Chi tiết sách' }}
      />
    </Stack.Navigator>
  );
}
