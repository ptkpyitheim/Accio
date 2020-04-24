import React, { Component } from 'react';
import { Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Image, ScrollView, ActivityIndicator} from 'react-native';
import { View, Container, Button } from 'native-base';
import Hamburger from '../Hamburger';
import AccioText from '../AccioText'
import * as Constants from '../../Constants'

import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    token: state.reducer.token,
    me: state.reducer.me
  }
}

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

class MyGroupsScreen extends Component {

  constructor(props){
    super(props);
    this.state = {
      isLoaded: false,
      myGroups: [],
      refreshing: false,
    }
    this.intervalGroups = [];
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.fetchGroups();
    wait(1000).then(() => {this.setState({refreshing: false});});
  }

  componentDidMount() {
    this.fetchGroups();
    // this.intervalGroups = setInterval(this.fetchGroups.bind(this), 20000);
  }

  // componentWillUnmount() {
  //   clearInterval(this.intervalGroups);
  //   this.intervalGroups = null;
  // }

  // componentWillMount() {
  //   this.fetchGroups;
  // }

  fetchGroups = () => {
    const URL = Constants.baseURL + '/authed/mygroups?token=' + this.props.token
    fetch( URL , {
        token: this.props.token,

        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    })
    .then((res) => res.json())
    .then((resJson) => {
        if(resJson.status == 'fail') {
        }
        else {
          this.setState({ isLoaded: true, myGroups: resJson.data.groups })
        }
    }).catch((err) =>{
        // console.error("error", err);
    });
  }

  renderGrid = ({ item }) => {
    return (
        <View style={styles.grid}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('GroupDetails', { groupName: item.name, owner: item.owner, groupMember: item.members, token: this.props.token, groupId: item._id, groupDescription: item.description, groupDiscussion: item.posts })}>
                <View>
                    {/* Groups' profile images will replace bottom View */}
                    <Image source={{ uri: Constants.baseURL + '/groupPictures/' + item._id + ".jpg" + '?time='+ new Date() }} defaultSource={require('../../assets/images/blankImage.png')} style={styles.cell} />

                    <AccioText fontFamily="semiBold" style={styles.cellItem}>{item.name}</AccioText>
                    <AccioText style={styles.cellText}>{item.description}</AccioText>

                </View>
            </TouchableOpacity>
        </View>

    );
  }
  toFindGroups = () => {
    return (
        this.props.navigation.navigate('Find Groups')
    )
  }

  render() {
    //const {navigation} = this.props;
    if (this.state.isLoaded) {
      if(this.state.myGroups.length > 0){
          return (
            <Container>
              <Hamburger nav={this.props} title="My Groups"/>
              <FlatList numColumns={2} data={this.state.myGroups} 
              renderItem={this.renderGrid} 
              keyExtractor={item => item._id}
              refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
              />
            </Container>
          )
      }
      else{
          return (
            <Container>
              <Hamburger nav={this.props} title="My Groups"/>
            
              <Container style={styles.container}>
              <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
              >
                <AccioText style={{fontSize:'20'}}>You're not in any groups yet</AccioText>
                <AccioText style={{marginTop: 10}}>Find and join an interest group. You can meet new people, get invited to events, and much more.</AccioText>
                <Button full primary
                  style={styles.button}
                  onPress={this.toFindGroups}
                >
                  <AccioText size={16} color='white' weight='500' >Find Groups</AccioText>
                </Button>
              </ScrollView>
              </Container>
              
            </Container>
          )
      }
    }
    else {
      return (
          <Container>
            <Hamburger nav={this.props} title="My Groups"/>
            <View style={{flex: 0.5, justifyContent: 'center'}}> 
                <ActivityIndicator size="large" color={Constants.defaultColor} animating={true} hidesWhenStopped /> 
              </View>
          </Container>
      )
  }
  } 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    paddingTop: 30
  },
  
  cell: {
    flex: 1,
    borderRadius: 5,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    height: 10,
    width: 161,
    padding: 50,
    backgroundColor: '#d6d6d6'
  },
  cellItem: {
      marginTop: 5,
      width: 161,
      fontSize: 14
  },
  cellText:{
      fontSize: 10,
      width: 161,
      color: '#8f8f8f'
  },
  grid: {
      height: 140,
      margin: 15,
      flex: 1,
  },
  button: {
    marginTop: 30,
    borderRadius: 5,
    backgroundColor: Constants.defaultColor,
  }
  });

  export default connect(mapStateToProps)(MyGroupsScreen);