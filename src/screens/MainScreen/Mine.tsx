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

class Mine extends PureComponent<NavigationScreenProps, {}> {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Text onPress={() => navigation.navigate('Modal')}>我的</Text>
      </View>
    );
  }
}

export default Mine;
