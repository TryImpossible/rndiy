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

class Modal extends PureComponent<NavigationScreenProps, {}> {
  render() {
    return (
      <View style={styles.container}>
        <Text>Modal</Text>
      </View>
    );
  }
}

export default Modal;
