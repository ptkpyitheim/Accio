import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import AccioText from '../../AccioText';
import * as Constants from '../../../Constants'

export default class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      pswd: "",
    }
  }

  submitForm = () => {
    const uname = this.state.username;
    const pass = this.state.pswd;

    this.props.submit(uname, pass);

    //reset form
    this.setState({
      username: "",
      pswd: "",
    })
  }


  render() {

    const isLoggingIn = this.props.isLoggingIn;

    return(
      <View style = {styles.container}>

        {this.props.loginErrorComp}
       
        <ScrollView style={styles.scrollView}>

        <AccioText size={15} color="grey" fontFamily='medium' >
          Username
        </AccioText>

        <TextInput style ={styles.inputBox}
          underlineColorAndroid = 'rgba(0,0,0,0)'
          placeholder="Username"
          value={this.state.username} 
          placeholderTextColor = "grey"
          onChangeText={(text) => this.setState({username: text})}
        />

        <AccioText size={15} color="grey" fontFamily='medium'>
          Password
        </AccioText>

        <TextInput style ={styles.inputBox}
        underlineColorAndroid = 'rgba(0,0,0,0)'
        placeholder="•••••••••"
        value={this.state.pswd} 
        secureTextEntry = {true}
        placeholderTextColor = "grey"
        onChangeText={(text) => this.setState({pswd: text})}
        />
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={this.submitForm}>
          {
            isLoggingIn ? 
            <ActivityIndicator size="small" color='white' animating={true} hidesWhenStopped /> :
            <AccioText color='white' weight='500' size={15} >
              Login
            </AccioText>
          }
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    justifyContent:'center',
    marginTop: 50,
    marginBottom: 20,
  },
  inputBox: {
    width: 300,
    height: 50,
    fontSize: 15,
    color: "black",
    marginVertical: 10,
    fontFamily: Constants.defaultFont,
  },
  button: {
    width: 180,
    backgroundColor: Constants.defaultColor,
    borderRadius: 6,
    marginTop: 30,
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: 'center',
  },
});
