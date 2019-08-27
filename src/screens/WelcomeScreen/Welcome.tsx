import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

class Welcome extends PureComponent<NavigationScreenProps, {}> {
  private timer: number;

  constructor(props: NavigationScreenProps) {
    super(props);
    this.timer = 0;
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.timer = setTimeout(() => navigation.navigate('Modal'), 3000);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Text onPress={() => navigation.replace('Main')}>rndiy,欢迎你</Text>
      </View>
    );
  }
}

export default Welcome;
