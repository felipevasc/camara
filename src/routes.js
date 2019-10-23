import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { createDrawerNavigator } from 'react-navigation-drawer'

import Login from './pages/Login'
import Main from './pages/Main'
 
export default createAppContainer(
    createDrawerNavigator({
        Login,
        Main,
    })
)