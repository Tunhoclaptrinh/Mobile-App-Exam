import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';

export function AppDivider({
  vertical = false,
}: {
  vertical?: boolean;
}): React.JSX.Element {
  return (
    <View
      accessible={false}
      style={vertical ? styles.vertical : styles.horizontal}
    />
  );
}
