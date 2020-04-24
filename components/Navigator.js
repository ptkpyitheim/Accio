import React, { Component } from 'react';

import MyGroupsScreen from './Screens/MyGroups';
import GroupMembersScreen from './Screens/Members'
import Events from './Events/Events'
import EventDetail from './Events/EventDetail'
import CreateGroup from './Screens/CreateGroup';
import Profile from './Profile/Profile';
import EditProfile from './Profile/EditProfile';
import Map from './HomePage/Map';
import Login from './Authentication/Login/Login';
import Signup from './Authentication/Signup/Signup';
import ForgotPassword from './Authentication/ForgotPassword/ForgotPassword';
import Logout from './Authentication/Logout/Logout';
import Groups from './Groups/Groups';
import GroupDetail from './Groups/GroupDetail';
import HomePage from './HomePage/HomePage'
import Discussion from './Discussion/Discussion';
import Comment from './Discussion/Comment';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';
import Chat from './Chat/Chat';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  createDrawerNavigator
} from '@react-navigation/drawer';


import { TouchableOpacity } from 'react-native-gesture-handler';

import { Text, StyleSheet, Button, Image, ActivityIndicator, View } from 'react-native';
import { Container } from 'native-base'
import * as Constants from '../Constants'

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


function mapStateToProps(state) {
  return {
    token: state.reducer.token,
    me: state.reducer.me,
    // avatar: state.reducer.avatar
  }
}

// For more information on drawerNavigator please refer to this page:
// https://reactnavigation.org/docs/en/drawer-navigator.html#edgewidth

function MyGroups() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyGroup" component={MyGroupsScreen}
        options={{
          title: 'My Groups',
          headerShown: false
        }}
      />
      <Stack.Screen name="GroupDetails" component={GroupDetail}
        options={{
          title: 'Group Details',
          headerBackImage: () => (backBtn()),
          headerBackTitle: ' ',
        }}
      />
      <Stack.Screen name="Discussion" component={Discussion}
        options={{
          title: 'Discussions',
          headerBackImage: () => (backBtn()),
          headerBackTitle: ' ',
        }} />
      <Stack.Screen name="Events" component={Events}
        options={{
          title: 'Events',
          headerBackImage: () => (backBtn()),
          headerBackTitle: ' ',
        }} />
      <Stack.Screen name="EventDetails" component={EventDetail}
        options={{
          title: 'Event Details',
          headerBackImage: () => (backBtn()),
          headerBackTitle: ' ',
        }}
      />
      <Stack.Screen name="Group Members" component={GroupMembersScreen}
        options={{
          title: 'Group Members',
          headerBackImage: () => (backBtn()),
          headerBackTitle: ' ',
        }} />
      <Stack.Screen name="Profile" component={Profile}
        options={{
          drawerLabel: 'Profile',
          headerBackImage: () => (backBtn()),
          headerBackTitle: ' ',
        }} />

      <Stack.Screen name="Comment" component={Comment}
        options={{
          title: 'Comment',
          headerBackImage: () => (backBtn()),
          headerBackTitle: ' ',
        }} />
      <Stack.Screen name="Chat" component={Chat}
        options={{
          title: 'Chat',
          headerBackImage: () => (backBtn()),
          headerBackTitle: ' ',
        }} />


    </Stack.Navigator>
  );
}


function FindGroups() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FindGroup" component={Groups} options={{ title: 'Find  ', headerShown: false }} />
      <Stack.Screen name="GroupDetails" component={GroupDetail}
        options={{
          title: 'Group Details',
          headerBackImage: () => (backBtn()),
          headerBackTitle: ' ',
        }} />
      <Stack.Screen name="Discussion" component={Discussion}
        options={{
          title: 'Discussions',
          headerBackImage: () => (backBtn()),
          headerBackTitle: ' ',
        }} />
      <Stack.Screen name="Events" component={Events}
        options={{
          title: 'Events',
          headerBackImage: () => (backBtn()),
          headerBackTitle: ' ',
        }} />
      <Stack.Screen name="EventDetails" component={EventDetail}
        options={{
          title: 'Event Details',
          headerBackImage: () => (backBtn()),
          headerBackTitle: ' ',
        }}
      />
      <Stack.Screen name="Group Members" component={GroupMembersScreen}
        options={{
          title: 'Group Members',
          headerBackImage: () => (backBtn()),
          headerBackTitle: ' ',
        }} />
      <Stack.Screen name="Profile" component={Profile}
        options={{
          drawerLabel: 'Profile',
          headerBackImage: () => (backBtn()),
          headerBackTitle: ' ',
        }} />
    </Stack.Navigator>
  );
}

function CreateGroups() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CreateGroup" component={CreateGroup} options={{ title: 'Find  ', headerShown: false }} />
      <Stack.Screen name="GroupDetails" component={GroupDetail}
        options={{
          title: 'Group Details',
          headerBackImage: () => (backBtn()),
          headerBackTitle: ' ',
        }} />
    </Stack.Navigator>
  );
}

function backBtn() {
  return (
    <Image
      style={styles.backBtn}
      source={require('../assets/back.png')}
    />
  );
}

function modalCloseBtn(navigation) {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} >
      <Image
        style={styles.modalCloseBtn}
        source={require('../assets/closeBtn.png')}
      />
    </TouchableOpacity>
  )
}

//Full Screen Modal - https://reactnavigation.org/docs/modal
const RootStack = createStackNavigator();

function ProfileMainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTransparent: 'true',
          title: '',
        }}
      />
      <Stack.Screen
        name="Edit Profile"
        component={EditProfile}
        options={{
          headerTransparent: 'true',
          title: 'Edit Profile',
        }}
      />
            <Stack.Screen name="Chat" component={Chat}
        options={{
          title: 'Chat',
          headerBackImage: () => (backBtn()),
          headerBackTitle: ' ',
        }} />
    </Stack.Navigator>
  )
}

function ProfileRootStack() {
  return (
    <RootStack.Navigator mode="modal">
      <RootStack.Screen
        name="Profile"
        component={ProfileMainStack}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ProfileModal"
        options={({ navigation }) => ({
          headerRight: () => (modalCloseBtn(navigation)),
          headerBackImage: () => null,
          headerShown: 'false',
          headerBackTitle: ' ',
          title: '',
        })}
        component={Profile} />
    </RootStack.Navigator>
  );

}

function LoginSignupStack(props) {
  return (
    <Stack.Navigator initialRouteName="Accio" {...props}>
      <Stack.Screen name="Accio" component={HomePage} options={{
        headerTransparent: 'true',
        headerShown: 'false',
        title: '',
        headerStatusBarHeight: 6,
      }} />
      <Stack.Screen name="Login" {...props} options={{
        headerTransparent: 'true',
        headerShown: 'false',
        headerBackImage: () => (backBtn()),
        headerBackTitle: ' ',
        title: '',
        headerStatusBarHeight: 40,
      }}>
        {props_ => <Login {...props_} loginUser={props.loginCallBack} />}
      </Stack.Screen>
      <Stack.Screen name="ForgotPassword" {...props} options={{
        headerTransparent: 'true',
        headerShown: 'false',
        headerBackImage: () => (backBtn()),
        headerBackTitle: ' ',
        title: '',
        headerStatusBarHeight: 40,
      }}>
        {props_ => <ForgotPassword {...props_} loginUser={props.loginCallBack} />}
      </Stack.Screen>
      <Stack.Screen name="Signup" options={{
        headerTransparent: 'true',
        headerShown: 'false',
        headerBackImage: () => (backBtn()),
        headerBackTitle: ' ',
        title: '',
        headerStatusBarHeight: 40,
      }}>
        {props_ => <Signup {...props_} loginUser={props.loginCallBack} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}


class Navigator extends Component {

  _isMounted = false;

  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      // avatar: Constants.baseURL + '/profilePictures/' + this.props.me._id + ".jpg",
    }
  }

  componentDidMount() { this._isMounted = true }
  componentWillUnmount() { this._isMounted = false }

  onChangeLoginStatus = (status) => {
    if (this._isMounted) {
      this.setState({ isLoggedIn: status })
    }
  }


  getCustomDrawer = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label={() => <Logout logoutUser={this.onChangeLoginStatus} />}
          style={styles.logoutContainer}
        // options={{drawerIcon: () => (<Image source={require("../assets/images/logout.png")} resizeMode="contain" style={{width: 35, height: 35, }} />) }}
        />
      </DrawerContentScrollView>
    );
  }

  render() {
    //Needs to be if logged in condition instead
    if (!this.state.isLoggedIn) {
      return (
        <LoginSignupStack {...this.props} loginCallBack={this.onChangeLoginStatus} />
      )
    }
    else if (this.state.isLoggedIn && this.props.me) {
      return (
        <Drawer.Navigator
          initialRouteName="My Map"
          hideStatusBar="true"
          drawerContent={props => this.getCustomDrawer(props)}
        >
          <Drawer.Screen name="Profile" component={ProfileRootStack} options={{ drawerLabel: this.props.me.firstName + " " + this.props.me.lastName, drawerIcon: () => (<Image source={{ uri: Constants.baseURL + '/profilePictures/' + this.props.me._id + ".jpg" + '?time=' + new Date() }} defaultSource={require("../assets/images/default-profile-pic.png")} resizeMode="contain" style={{ width: 75, height: 75, }} />) }} />
          <Drawer.Screen name="My Map" component={Map} options={{ drawerLabel: '  My Map', drawerIcon: () => (<Image source={require("../assets/images/map.png")} resizeMode="contain" style={{ width: 35, height: 35, }} />) }} />
          <Drawer.Screen name="My Groups" component={MyGroups} options={{ drawerLabel: 'My Groups', drawerIcon: () => (<Image source={require("../assets/images/groups.png")} resizeMode="contain" style={{ width: 45, height: 45, }} />) }} />
          <Drawer.Screen name="Find Groups" component={FindGroups} options={{ drawerLabel: 'Find Groups', drawerIcon: () => (<Image source={require("../assets/images/findgroups.png")} resizeMode="contain" style={{ width: 45, height: 45, }} />) }} />
          <Drawer.Screen name="Create Group" component={CreateGroups} options={{ drawerLabel: 'Create Group', drawerIcon: () => (<Image source={require("../assets/images/creategroup.png")} resizeMode="contain" style={{ width: 45, height: 45, }} />) }} />
          {/* <Drawer.Screen name="Setting" component={Profile} options={{ drawerLabel: 'Setting', drawerIcon: () => (<Image source={require("../assets/images/setting.png")} resizeMode="contain" style={{ width: 45, height: 45, }} />) }} /> */}
        </Drawer.Navigator>
      );

    }
    return (
      <View style={{ flex: 0.5, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Constants.defaultColor} animating={true} hidesWhenStopped />
      </View>
    )
  }
}





const styles = StyleSheet.create({
  logoutContainer: {
    marginTop: 40,
  },
  backBtn: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  modalCloseBtn: {
    width: 30,
    height: 30,
    marginRight: 15,
  }

});
export default connect(mapStateToProps)(Navigator)