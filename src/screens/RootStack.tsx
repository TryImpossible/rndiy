import { createAppContainer, createStackNavigator } from 'react-navigation';
import MainScreen from './MainScreen';
import WelcomeScreen from './WelcomeScreen';

const RootStack = createStackNavigator({
  Welcome: { screen: WelcomeScreen, navigationOptions: () => ({ header: null }) },
  Main: { screen: MainScreen, navigationOptions: () => ({ header: null }) }
});

export default createAppContainer(RootStack);
