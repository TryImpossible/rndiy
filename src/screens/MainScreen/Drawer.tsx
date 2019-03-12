import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

class Drawer extends PureComponent<{}, {}> {
  render() {
    return (
      <View style={styles.container}>
        <Text>抽屉</Text>
      </View>
    );
  }
}

export default Drawer;
