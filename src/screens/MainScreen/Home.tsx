import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import Theme from '../../resources/themes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

class Home extends PureComponent<NavigationScreenProps, {}> {
  static navigationOptions = ({ navigation }) => ({
    title: '首页'
  });

  render() {
    console.warn(Theme.a);
    return (
      <View style={styles.container}>
        <Text>首页</Text>
      </View>
    );
  }
}

export default Home;
