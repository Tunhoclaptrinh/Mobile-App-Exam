import React from 'react';
import { View } from 'react-native';
import { AppText } from '../AppText';
import { CupertinoIconTile } from '../CupertinoIconTile';
import type { EmptyStateProps } from './types';
import { styles } from './styles';

export function EmptyState({
  title,
  description,
}: EmptyStateProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <CupertinoIconTile name="book" />
      <AppText variant="title" style={styles.text}>
        {title}
      </AppText>
      <AppText tone="secondary" style={styles.text}>
        {description}
      </AppText>
    </View>
  );
}
