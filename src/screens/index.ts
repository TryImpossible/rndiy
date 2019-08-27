import { Animated, Easing } from 'react-native';
import {
  createAppContainer,
  createStackNavigator,
  NavigationTransitionProps,
  StackViewTransitionConfigs
} from 'react-navigation';
import MainScreen from './MainScreen';
import ModalScreen from './ModalScreen';
import WelcomeScreen from './WelcomeScreen';

const MainStack = createStackNavigator({
  Welcome: { screen: WelcomeScreen, navigationOptions: () => ({ header: null }) },
  Main: { screen: MainScreen, navigationOptions: () => ({ header: null }) }
});

/* The screens you add to IOS_MODAL_ROUTES will have the modal transition.  */
const IOS_MODAL_ROUTES = ['Modal'];

const dynamicModalTransition = (
  transitionProps: NavigationTransitionProps,
  prevTransitionProps: NavigationTransitionProps
) => {
  const isModal = IOS_MODAL_ROUTES.some(
    screenName =>
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)
  );
  return StackViewTransitionConfigs.defaultTransitionConfig(transitionProps, prevTransitionProps, true);
};

const RootStack = createStackNavigator(
  {
    MainStack,
    Modal: ModalScreen
  },
  {
    mode: 'card',
    headerMode: 'none',
    // transitionConfig: dynamicModalTransition
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const width = layout.initWidth;
        const translateX = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [width, 0, 0]
        });

        const height = layout.initHeight;
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0]
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1]
        });

        return { opacity, transform: scene.route.routeName !== 'Modal' ? [{ translateX }] : [{ translateY }] };
      }
    }),
    defaultNavigationOptions: {
      gesturesEnabled: true
    }
  }
);

// console.log(RootStack.prototype);
// console.log(RootStack.childContextTypes);
// console.log(RootStack.contextType);
// console.log(RootStack.contextTypes);
// console.log(RootStack.defaultProps);
// console.log(RootStack.displayName);
// console.log(RootStack.getDerivedStateFromError);
// console.log(RootStack.getDerivedStateFromProps);
// console.log(RootStack.length);
// console.log(RootStack.name);
// console.log(RootStack.navigationOptions);
// console.log(RootStack.propTypes);
// console.log(RootStack.router);
// console.log(RootStack.screenProps);
// console.log(RootStack.state);

// 自定义导航操作
// const defaultGetStateForAction = RootStack.router.getStateForAction;
// RootStack.router.getStateForAction = (action, state) => {
//   if (state && action.type === 'Navigation/NAVIGATE') {
//     const routes = [
//       ...state.routes,
//       { key: 'A', routeName: 'Modal', params: { name: '123' } },
//       { key: 'B', routeName: 'Modal', params: { name: '321' } }
//     ];
//     return { ...state, routes, index: routes.length - 1 };
//   }
//   return defaultGetStateForAction(action, state);
// };

const AppContainer = createAppContainer(RootStack);

export default AppContainer;
