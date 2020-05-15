import React, { Component } from 'react';
import Navigator from './components/Navigator';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import { View } from 'react-native';
import { Root } from 'native-base';

import { Provider } from 'react-redux';

import store from './store'
import HomePage from './components/HomePage/HomePage';

import { YellowBox } from 'react-native'

/**************************************** PTK ****************************************/
const Stack = createStackNavigator();

export default class App extends Component {
  _mount = false
  state = {
    loading: true
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
      'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
      'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
      'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
    });
    this.setState({ loading: false })
  }


  render() {
    console.disableYellowBox = true; // True: hides yellow warning boxes; False: shows yellow warning boxes

    if (this.state.loading) {
      return (<View></View>)
    }
    return (
      <Provider store={store}>
        <Root>
          <NavigationContainer>
            <Navigator />
          </NavigationContainer>
        </Root>
      </Provider>
    );
  }
}
/**************************************** PTK ****************************************/

