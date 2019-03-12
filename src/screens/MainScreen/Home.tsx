import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

class Home extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text>首页</Text>
      </View>
    );
  }
}

export default Home;
