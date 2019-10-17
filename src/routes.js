import { createAppContainer, createSwitchNavigator, createDrawerNavigator } from 'react-navigation'
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs'

import Login from './pages/Login'
import Main from './pages/Main'
 
export default createAppContainer(
    createDrawerNavigator({
        Login,
        Main,
    })
)