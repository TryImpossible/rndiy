import { createBottomTabNavigator, createDrawerNavigator } from 'react-navigation';
import Drawer from './Drawer';
import Home from './Home';
import Mine from './Mine';

const MainTab = createBottomTabNavigator({
  Home,
  Mine
});

export default createDrawerNavigator({
  MainTab,
  Drawer
});
