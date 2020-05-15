import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, Dimensions, ActivityIndicator, Image } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AccioText from '../AccioText';
import * as Constants from '../../Constants';
import { Row } from 'native-base';


const maxLengthUserName = 15;
const userNameErrMsg = "Username must not be greater than " + maxLengthUserName + " characters."
const emailErrMsg = "Invalid email";
const passwordErrMsg = "Passwords do not match";
const regexTestEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class EditProfile extends Component {

  constructor(props) {
    super(props)
    this.state = {
      token: this.props.route.params.token,
      user: this.props.route.params.user,
      first: "",
      last: "",
      username: "",
      email: "",
      password: "",
      confirmPass: "",
      errorMessage: "",
    }

    // this.validateForm = this.validateForm.bind(this);
  }
  onChangeUName = (e) => {
    this.setState({
      username: e,
      errorMessage: (e.length > 15) ? userNameErrMsg : "",
    });
  }
  onChangeFirstName = (e) => { this.setState({ first: e }) }
  onChangeLastName = (e) => { this.setState({ last: e }) }
  onChangeEmail = (e) => { this.setState({ email: e }); }
  onChangePassword = (e) => { this.setState({ password: e }); }
  onChangeConfirmPassword = (e) => {
    this.setState({
      confirmPass: e,
      errorMessage: (e !== this.state.password) ? passwordErrMsg : "",
    });
  }

  validateForm(uname, email, pass, confirmPass) {
    let isValid = false;
    let errMsg = "";
    if (uname.length > 0 && uname.length > maxLengthUserName) {
      console.log("username not valid");
      errMsg = userNameErrMsg;
    }

    else if (email.length > 0 && !regexTestEmail.test(email)) {
      console.log("email not valid");
      errMsg = emailErrMsg;
    }
    else if (pass.length > 0 && pass !== confirmPass) {
      errMsg = passwordErrMsg;
      console.log("password doesnt match");
    }

    else {
      isValid = true;
    }
    this.setState({ errorMessage: errMsg });
    return isValid;
  }

  submitEdit = () => {
    if (this.validateForm(this.state.username, this.state.email, this.state.password, this.state.confirmPass) == false) {
      console.log("Form inputs are not correct");
    }
    else {
      //if fields are empty i.e user doesnt want to change so fill in with user info
      if (this.state.first.length == 0) {
        this.setState({ first: this.state.user.firstName });
      }
      if (this.state.last.length == 0) {
        this.setState({ last: this.state.user.lastName });
      }
      if (this.state.username.length == 0) {
        this.setState({ username: this.state.user.username });
      }
      if (this.state.email.length == 0) {
        this.setState({ email: this.state.user.email });
      }
      //not changing password
      if (this.state.password.length == 0) {
        fetch(Constants.baseURL + "/authed/updateMe?token=" + this.state.token, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstName: this.state.first,
            lastName: this.state.last,
            username: this.state.username,
            email: this.state.email,
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.status == 'error') {
              console.log("ERROR EDITING UP BECAUSE OF .. ", responseJson.message);
            }
            if (responseJson.status == 'fail') {
              console.log("ERROR EDITING UP BECAUSE OF .. ", responseJson.message);
            }
            else if (responseJson.status == 'success') {
              this.props.navigation.navigate('Profile');
            }
          }).catch((err) => {
            console.error(err);
          });
      }
      else {
        fetch(Constants.baseURL + "/authed/updateMe?token=" + this.state.token, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstName: this.state.first,
            lastName: this.state.last,
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.status == 'error') {
              console.log("ERROR EDITING UP BECAUSE OF .. ", responseJson.message);
            }
            if (responseJson.status == 'fail') {
              console.log("ERROR EDITING UP BECAUSE OF .. ", responseJson.message);
            }
            else if (responseJson.status == 'success') {
              this.props.navigation.navigate('Profile');
            }
          }).catch((err) => {
            console.error(err);
          });
      }
    }
  }


  render() {
    const errMessage = this.state.errorMessage;
    return (
      <View style={styles.container}>

        <ScrollView style={styles.ScrollView}>
        {errMessage.length > 0 ?
          <AccioText size={12} color='red' textAlign='center'> {errMessage} </AccioText> :
          <AccioText></AccioText>
        }
          <AccioText fontFamily='medium' style={styles.label}>First Name</AccioText>
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder={this.state.user.firstName}
            value={this.state.first}
            placeholderTextColor="grey"
            onChangeText={text => this.onChangeFirstName(text)}

          />

          <AccioText fontFamily='medium' style={styles.label}>Last Name</AccioText>
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder={this.state.user.lastName}
            value={this.state.last}
            placeholderTextColor="grey"
            onChangeText={text => this.onChangeLastName(text)}

          />

          <AccioText fontFamily='medium' style={styles.label}>Username</AccioText>
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder={this.state.user.username}
            value={this.state.username}
            placeholderTextColor="grey"
            onChangeText={text => this.onChangeUName(text)}
          />

          <AccioText fontFamily='medium' style={styles.label}>Email</AccioText>
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder={this.state.user.email}
            placeholderTextColor="grey"
            value={this.state.email}
            onChangeText={text => this.onChangeEmail(text)}
          />

          <AccioText fontFamily='medium' style={styles.label}>Password</AccioText>
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="•••••••••"
            value={this.state.password}
            secureTextEntry={true}
            placeholderTextColor="grey"
            onChangeText={text => this.onChangePassword(text)}
          />

          <AccioText fontFamily='medium' style={styles.label}>Confirm Password</AccioText>

          <TextInput style={styles.inputBoxLastEntry}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="•••••••••"
            secureTextEntry={true}
            placeholderTextColor="grey"
            value={this.state.confirmPass}
            onChangeText={text => this.onChangeConfirmPassword(text)}
          />
        </ScrollView>
        <View>
          <TouchableOpacity style={styles.button} onPress={this.submitEdit}>
            <AccioText size={15} fontFamily='medium' color='white' textAlign='center'> Submit Changes </AccioText>
          </TouchableOpacity>
        </View>
        <KeyboardSpacer/>

      </View>
    )
  }
}


const windowHeight = Dimensions.get('window').height;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    justifyContent: 'center'
  },
  ScrollView: {
    marginVertical: 10,
    paddingVertical: 60
  },
  inputBox: {
    width: 300,
    height: 50,
    fontSize: 15,
    color: "black",
    marginVertical: 10,
    fontFamily: Constants.defaultFont,
  },
  label: {
    color: 'grey',
    fontSize: 15,
  },
  button: {
    width: 200,
    alignSelf: 'center',
    backgroundColor: Constants.defaultColor,
    borderRadius: 6,
    marginVertical: 5,
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: 'center',
  },
  errText: {
    paddingHorizontal: 3,
  },
  inputBoxLastEntry: {
    width: 300,
    height: 50,
    fontSize: 15,
    color: "black",
    marginTop: 10,
    marginBottom: 40,
    fontFamily: Constants.defaultFont,
  },

});
