/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu'
});

interface AppState {
  welcome: string;
}

export default class App extends Component<{}, AppState> {
  public onPress: () => void;

  constructor(props: any) {
    super(props);
    this.state = {
      welcome: 'Welcome to React Native!'
    };
    this.onPress = () => {
      this.setState({ welcome: 'Welcome to Use Jest!' });
      console.warn('哈哈😄哈哈');
    };
  }

  public render() {
    const { welcome } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{welcome}</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Text testID="hello_button" onPress={this.onPress}>
          点我吖
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 15
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});
