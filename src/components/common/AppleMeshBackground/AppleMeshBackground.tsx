import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';

// The base's minimal mesh palette, rendered by RN 0.87 native gradients.
export function AppleMeshBackground(): React.JSX.Element {
  return (
    <View pointerEvents="none" accessible={false} style={styles.background} />
  );
}
