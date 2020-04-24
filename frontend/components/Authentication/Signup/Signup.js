import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Container, Toast } from 'native-base';
import Form from './SignupForm';
import { connect } from 'react-redux';
import Constants from 'expo-constants';
import * as AccioConsts from '../../../Constants'
import AccioText from '../../AccioText';

const mapStateToProps = (state) => {
  return {
    token: state.reducer.token
  }
}

class Signup extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      signupErrMsg: "",
      isSigningUp: false,
    }
    this.submit = this.submit.bind(this);
    this.getToken = this.getToken.bind(this);
  }

  componentDidMount() { this._isMounted = true }
  componentWillUnmount() { this._isMounted = false }

  getToken(usr, pswd) {
    this.setState({ isSigningUp: true })

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
        console.log("getToken response Json ", responseJson);
        if (responseJson.status == 'fail') {
          if (this._isMounted) {
            //Don't log in
          }
        }
        else {
          if (this._isMounted) {
            this.props.dispatch({ type: 'SEND_TOKEN', token: responseJson.data.token })

            this.setState({ isSigningUp: false })

            this.getMe()
          }
        }
      }).catch((err) => {
        console.error("error", err);
      });
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

  //clicked sign-up button
  submit(first, last, usr, pswd, email, avatar) {
    this.setState({ isSigningUp: true })

    //ajax request to DB
    fetch(AccioConsts.baseURL + '/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: usr,
        firstName: first,
        lastName: last,
        password: pswd,
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("Sign up response Json ", responseJson);
        if (responseJson.status == 'error') {
          if (this._isMounted) {
            console.log("ERROR SIGNING UP BECAUSE OF .. ", responseJson.message)
            this.setState({ signupErrMsg: responseJson.message, isSigningUp: false })
          }
        }
        else if (responseJson.status == 'fail') {
          this.setState({ signupErrMsg: responseJson.data.message, isSigningUp: false })
        }        
        else if (responseJson.status == 'success') {
          Toast.show({ text: "Account created! Please verify your email before logging in.", buttonText: 'OK', duration: 3000 });
          this.props.navigation.navigate('Login');
          // this.getToken(usr, pswd) //Send that token up to REDUX store
          // this.setState({ isSigningUp: false })
        }
      }).catch((err) => {
        console.error(err);
      });

    // //upload Profile picture
    // if (avatar == "") {
    //   //no profile picture to upload
    //   let defaultAvatar = ImageView.setImageURI(Uri.fromFile(new File('../assets/images/default-profile-pic.png')));;
    //   let formData = new FormData();
    //   formData.append("picture", defaultAvatar);
    //   formData.append("token", this.props.token);
    //   fetch(AccioConsts.baseURL + '/authed/uploadprofilepicture', {
    //     method: "POST", body: formData
    //   }).then((response) => response.json())
    //   .then((responseJson) => {
    //     console.log("Add profile picture", responseJson);
    //     if (responseJson.status == 'error') {
    //       console.log("error");
    //     }
    //     else if (responseJson.status == 'fail') {
    //       this.setState({ signupErrMsg: responseJson.data.message, isSigningUp: false })
    //     }        
    //     else if (responseJson.status == 'success') {
    //       Toast.show({ text: "Account created! Please verify your email before logging in.", buttonText: 'OK', duration: 3000 });
    //       this.props.navigation.navigate('Login');
    //       // this.getToken(usr, pswd) //Send that token up to REDUX store
    //       // this.setState({ isSigningUp: false })
    //     }
    //   }).catch((err) => {
    //     console.error(err);
    //   });
    // }
    // else {
    //   let formData = new FormData();
    //   formData.append("picture", avatar);
    //   formData.append("token", this.props.token);
    //   fetch(AccioConsts.baseURL + '/authed/uploadprofilepicture', {
    //     method: "POST", body: formData
    //   }).then((response) => response.json())
    //   .then((responseJson) => {
    //     console.log("Add profile picture", responseJson);
    //     if (responseJson.status == 'error') {
    //       console.log("error");
    //     }
    //     else if (responseJson.status == 'fail') {
    //       this.setState({ signupErrMsg: responseJson.data.message, isSigningUp: false })
    //     }        
    //     else if (responseJson.status == 'success') {
    //       Toast.show({ text: "Account created! Please verify your email before logging in.", buttonText: 'OK', duration: 3000 });
    //       this.props.navigation.navigate('Login');
    //       // this.getToken(usr, pswd) //Send that token up to REDUX store
    //       // this.setState({ isSigningUp: false })
    //     }
    //   }).catch((err) => {
    //     console.error(err);
    //   });
    // }

  }

  render() {
            let signupErrComp = <AccioText size={12} color="red" textAlign='center'> {this.state.signupErrMsg} </AccioText>

    return (
      <Container>
            <View style={styles.container}>
              <AccioText size={30} fontFamily='medium'>Welcome to Accio</AccioText>

              <KeyboardAvoidingView behavior="padding" enabled>
                <Form type="Sign Up" {...this.state} submit={this.submit} signupErrorComp={signupErrComp} />
              </KeyboardAvoidingView>

              <View style={styles.signupTextCont}>
                <AccioText size={13} color='grey' fontFamily='medium'>
                  {" "}Already have an account?
            </AccioText>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                  <AccioText style={{ paddingVertical: 10 }} color='accio' size={13} fontFamily='bold'> Login </AccioText>
                </TouchableOpacity>
              </View>

            </View>
          </Container>
    )
  }
}

export default connect(mapStateToProps)(Signup);


const windowHeight = Dimensions.get('window').height;


const styles = StyleSheet.create({
            container: {
            flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingLeft: 40,
    paddingRight: 0,
    marginTop: Constants.statusBarHeight + 70,
  },
  signupTextCont: {
            // flexGrow: 1,
            // alignItems: 'flex-end',
            paddingVertical: 30,
    // flexDirection: 'row',
  },
  errText: {
            paddingHorizontal: 3,
  },
});
