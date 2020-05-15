import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Container } from 'native-base';
import Form from './LoginForm';
import Constants from 'expo-constants';
import * as AccioConsts from '../../../Constants';
import { connect } from 'react-redux';
import AccioText from '../../AccioText';

const mapStateToProps = (state) => {
  return {
    token: state.reducer.token,
    me: state.reducer.me
  }
}

class Login extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      loginErrMsg: "",
      isLoggedIn: false,
      isLoggingIn: false,
    }
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  LoginAPICall = (usr, pswd) => {
    if (this._isMounted) {
      this.setState({ isLoggingIn: true })

      fetch(AccioConsts.baseURL + '/authtoken', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: usr,
          password: pswd
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status == 'fail') {
            console.log("Login failed. Response is : ")
            console.log(responseJson)
            if (this._isMounted) {
              this.setState({ loginErrMsg: responseJson.data.message, isLoggingIn: false });
            }
          }
          else {
            console.log("Login successful. Response is : ")
            if (this._isMounted) {
              this.props.dispatch({ type: 'SEND_TOKEN', token: responseJson.data.token })

              this.setState({ loginErrMsg: "", isLoggedIn: true, isLoggingIn: false });

              this.getMe()
            }
          }
        }).catch((err) => {
          console.error("error", err);
        });
    }
  }

  async getMe() {
    if (this.props && this.props.token) {
      console.log("get me")
      const res = await fetch(AccioConsts.baseURL + '/authed/me?token=' + this.props.token);
      const resJson = await res.json();
      const me = resJson.data.me;
      this.props.dispatch({ type: 'UPDATE_ME', me: me })

      this.props.loginUser(true) //Calls the callback function from Navigator.js

      return;
    }
  }



  render() {
    let loginErrComp = <AccioText color='red' size={12} textAlign='center' style={styles.errText}>{this.state.loginErrMsg}</AccioText>

    return (
      <Container>
        <View style={styles.container}>
          <AccioText size={30} weight='600' fontFamily='medium'>Welcome back</AccioText>

          <AccioText size={15} color='grey' weight='500'>Login to continue using Accio</AccioText>

          <KeyboardAvoidingView behavior="padding" enabled>
            <Form type="Login" {...this.state} submit={this.LoginAPICall} loginErrorComp={loginErrComp} />
          </KeyboardAvoidingView>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
              <AccioText size={13} weight='500' color='gray'> Forgot Password? </AccioText>
          </TouchableOpacity>

          <View style={styles.signupTextCont}>
          
            <AccioText size={13} color='grey' fontFamily='medium'>{" "}Don't have an account? </AccioText>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
              <AccioText style={{ paddingVertical: 10 }} size={13} weight='600' color='accio' fontFamily='bold'> Create an Account </AccioText>
            </TouchableOpacity>

           
          </View>
        </View>
      </Container>
    )
  }
}

export default connect(mapStateToProps)(Login);

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: Constants.statusBarHeight + 100,
  },
  signupTextCont: {
    paddingVertical: 60,
  },
  errText: {
    paddingHorizontal: 3,
    paddingVertical: 2,
  },
});
