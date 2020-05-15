import React, { Component } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Container } from 'native-base';
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
      email: ""
    }
  }

  componentDidMount() {
    this._isMounted = true
    this.setState({
      email: "",
      pendingRequest: false
    });
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  requestPasswordReset() {
    if (this.state.pendingRequest) return;

    this.setState({pendingRequest: true});

    fetch(AccioConsts.baseURL + "/requestPasswordReset?email=" + this.state.email).then(res => {
      this.setState({pendingRequest: false});
      return res.json();
    }).then(resJson => {
      if (resJson.status != "success") {
        alert(resJson.message || resJson.data.message);
      }
      else {
        this.props.navigation.navigate("Login");
      }
    }).catch(err => {
      this.setState({pendingRequest: false});
      console.log(err);
    })
  }



  render() {
    let loginErrComp = <AccioText color='red' size={12} textAlign='center' style={styles.errText}>{this.state.loginErrMsg}</AccioText>

    return (
      <Container>
        <View style={styles.container}>
          <AccioText size={25} weight='600' fontFamily='medium'>Forgot Password?</AccioText>

          <AccioText size={13} color='grey' weight='500' style={{marginTop: 10, }}>Enter your email to get a password reset link.</AccioText>

          <AccioText size={15} color="grey" fontFamily='medium' style={{marginTop: 35}}>
            Email
          </AccioText>

          <TextInput style ={styles.inputBox}
            underlineColorAndroid = 'rgba(0,0,0,0)'
            placeholder="dan@gmail.com"
            value={this.state.email} 
            placeholderTextColor = "grey"
            onChangeText={(text) => this.setState({email: text})}
          />
          {
            this.state.pendingRequest ? 
            <ActivityIndicator size="small" color='red' animating={true} hidesWhenStopped />
            :
            <TouchableOpacity style={styles.button} onPress={this.requestPasswordReset.bind(this)}>
              <AccioText weight='500' size={15} style ={{color: "white",}}>
                Send Email
              </AccioText>
            </TouchableOpacity>
          }
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
    backgroundColor: "#D82327",
    borderRadius: 6,
    marginTop: 30,
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: 'center',
  },
});
