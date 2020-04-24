import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, Dimensions, ActivityIndicator, Image } from 'react-native';
// import { Ionicons } from "@expo/vector-icons";
// import UserPermissions from "../../../utilities/UserPermissions";
// import * as ImagePicker from "expo-image-picker";
import AccioText from '../../AccioText';
import * as Constants from '../../../Constants'


const maxLengthUserName = 15;
const userNameErrMsg = "Username must not be greater than " + maxLengthUserName + " characters."
const passwordErrMsg = "Passwords do not match";
const emailErrMsg = "Invalid email";
const regexTestEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class SignupForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      first: "",
      last: "",
      username: "",
      email: "",
      password: "",
      confirmPass: "",
      errorMessage: "",
      isLoggingIn: false,
    }

    this.validateForm = this.validateForm.bind(this);
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

  clearInput = () => {
    this.setState({
      first: "",
      last: "",
      username: "",
      email: "",
      password: "",
      confirmPass: "",
    })
  }

  // handlePickAvatar = async () => {
  //   UserPermissions.getCameraPermission();

  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3]
  //   });

  //   if (!result.cancelled) {
  //     this.setState({ avatar: result.uri });
  //   }
  // };

  validateForm(first, last, uname, email, pass, confirmPass) {
    let isValid = false;
    let errMsg = "";
    if (uname.length < 1 || email.length < 1 || pass.length < 1 || confirmPass.length < 1 || first.length < 1 || last.length < 1) {
      errMsg = "All fields are required";
    }
    else if (uname.length > maxLengthUserName) {
      errMsg = userNameErrMsg;
    }
    else if (!regexTestEmail.test(email)) {
      errMsg = emailErrMsg;
    }
    else if (pass !== confirmPass) {
      errMsg = passwordErrMsg;
    }
    else {
      isValid = true;
    }

    this.setState({ errorMessage: errMsg })
    return isValid;
  }

  submitSignUp = () => {
    if (!this.validateForm(this.state.first, this.state.last, this.state.username, this.state.email, this.state.password, this.state.confirmPass)) {
      console.log("Form inputs are not correct");
    }
    else {

      this.props.submit(this.state.first, this.state.last, this.state.username, this.state.password, this.state.email)
    }
    // Clear the text inputs after submitting the form
    this.clearInput();
  }


  render() {

    const errMessage = this.state.errorMessage;
    const signupErr = this.props.signupErrorComp;
    const isSigningUp = this.props.isSigningUp;

    return (
      <View style={styles.container}>
        {errMessage.length > 0 ?
          <AccioText size={12} color='red' textAlign='center'> {errMessage} </AccioText> :
          signupErr
        }


        <ScrollView style={styles.scrollView}>
          {/* <TouchableOpacity style={styles.avatarPlaceholder} onPress={this.handlePickAvatar}>
            <Image source={{ uri: this.state.avatar }} style={styles.avatar} />
            <Ionicons
              name="ios-add"
              size={40}
              color="#FFF"
              style={{ marginTop: 6, marginLeft: 2 }}
            ></Ionicons>
          </TouchableOpacity> */}

          <AccioText fontFamily='medium' style={styles.label}>First Name</AccioText>

          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="Dan"
            value={this.state.first}
            placeholderTextColor="grey"
            onChangeText={text => this.onChangeFirstName(text)}
          />

          <AccioText fontFamily='medium' style={styles.label}>Last Name</AccioText>

          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="Evans"
            value={this.state.last}
            placeholderTextColor="grey"
            onChangeText={text => this.onChangeLastName(text)}
          />

          <AccioText fontFamily='medium' style={styles.label}>Username</AccioText>

          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="evans23"
            value={this.state.username}
            placeholderTextColor="grey"
            onChangeText={text => this.onChangeUName(text)}
          />

          <AccioText fontFamily='medium' style={styles.label}>Email</AccioText>


          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="evans23@wustl.edu"
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
          <TouchableOpacity style={styles.button} onPress={this.submitSignUp}>
            {
              isSigningUp ?
                <ActivityIndicator size="small" color='white' animating={true} hidesWhenStopped /> :
                <AccioText size={15} fontFamily='medium' color='white' textAlign='center'> Create Account </AccioText>
            }
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}


const windowHeight = Dimensions.get('window').height;


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    height: windowHeight / 1.5,
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
  avatarPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#E1E2E6",
    borderRadius: 50,
    marginTop: 48,
    justifyContent: "center",
    alignItems: "center"
  }, 
  avatar: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50
  }
});
