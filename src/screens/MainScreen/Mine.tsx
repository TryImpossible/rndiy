import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

class Mine extends PureComponent<{}, {}> {
  render() {
    return (
      <View style={styles.container}>
        <Text>我的</Text>
      </View>
    );
  }
}

export default Mine;
