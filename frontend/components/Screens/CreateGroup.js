import React, { Component } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { Container, View, Form, Textarea, Button } from 'native-base';
import Hamburger from '../Hamburger';
import AccioText from '../AccioText'
import * as Constants from '../../Constants'

import {connect} from 'react-redux';

function mapStateToProps(state){
  return {
    token: state.reducer.token
  }
}

class CreateGroup extends Component {
 
  constructor(props){
    super(props);
    
    this.state = {
      name: "",
      description: "",
      errorMessage: "",
    }
    this.submitForm = this.submitForm.bind(this)
  }

  isValidCreateGroupForm = (name, desc) => {
    if(name.length < 1 || desc.length < 1) {
      return false;
    }
    
    return true;
  }

  submitForm(){
    if(this.isValidCreateGroupForm(this.state.name, this.state.description)) {
      fetch(Constants.baseURL + '/authed/creategroup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: this.props.token,
          name: this.state.name,
          description: this.state.description
        }),
      })
      .then((response) => response.json())
      .then((responseJson) =>{
        if(responseJson.status == 'fail') {
          alert("Login to create a group");
          //Redirect to Login Page
          // this.props.navigation.navigate('Login')
        }
        else {
        
          //Redirect to MyGroups Page
          this.props.navigation.navigate('GroupDetails', 
            {groupName: responseJson.data.group.name, 
            groupMember: responseJson.data.group.members, 
            token: this.props.token, 
            groupId: responseJson.data.group._id, 
            groupDescription: responseJson.data.group.description, 
            groupDiscussion: responseJson.data.group.posts })
          this.setState({
            name: "",
            description: ""
          })
        }
      }).catch((err) =>{
        console.error("error", err);
      });
    }
    else {
      //display error
      this.setState({
        name: "",
        description: "",
        errorMessage: "All fields are required",
      });
    }

    // reset state
    // this.setState({
    //     name: "",
    //     description: "",
    //     errorMessage: "",
    // });
  }
  render() { 
    const errMessage = this.state.errorMessage;

    return(
      <Container >
        <Hamburger nav={this.props} title="Create Group"/>
        <View style={styles.container}>
        {errMessage.length > 0 ? 
         <AccioText size={12} color='red' textAlign='center'> {errMessage} </AccioText> :
          null
        }
          <Form>
            
            <AccioText size={16} fontFamily='semiBold'>Group Name</AccioText>

            <TextInput 
                placeholder="This is how other users will find your group"
                onChangeText={(text) => this.setState({name: text, description: this.state.description, errorMessage: ""})}  
                value={this.state.name} 
                style={styles.input}
            />
                    
            <AccioText size={16} fontFamily='semiBold'>Group Description</AccioText>

            <Textarea bordered
                placeholder="This is how other users will learn about your group"
                onChangeText={(text) => this.setState({name:this.state.name, description: text, errorMessage: ""})} 
                value={this.state.description} rowSpan={10}  
                style={styles.input}
                placeholderTextColor='#BCBCBC'
            ></Textarea>
      
            <Button full primary
              style={styles.button}
              onPress={this.submitForm}> 
              <AccioText size={16} color='white' fontFamily='medium'>Create</AccioText>
            </Button>
          </Form>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16  
  },
  container: {
    padding: 10,
    margin: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    height: 60,
    width: 300,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    paddingLeft: -5
  },
  button: {
    marginTop: 30,
    borderRadius: 5,
    backgroundColor: Constants.defaultColor,
  }
});

export default connect(mapStateToProps)(CreateGroup);


