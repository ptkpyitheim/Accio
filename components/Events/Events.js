import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity, Modal, Image, RefreshControl, Keyboard, FlatList, ScrollView, Platform } from 'react-native';
import { View, Container, Button } from 'native-base';
import { SearchBar } from 'react-native-elements';
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Hamburger from '../Hamburger';
import * as Constants from '../../Constants';
import AccioText from '../AccioText';
import RNDateTimePicker from '@react-native-community/datetimepicker';

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

class Events extends Component {
      constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            events: [],
            eventName: '',
            eventAddress: '',
            eventDescription: '',
            refreshing: false,
            keyboardSpace: 0,
            modalVisible: true,
            date: new Date(),
            time: new Date(),
            query: '',
        }
      
        this.eventsFilter = [];
    }

    setDate = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        Platform.OS == 'ios';
        this.setState({date: selectedDate});
    }
    setTime = (event, selectedTime) => {
        const currentTime = selectedTime || new Date();
        Platform.OS == 'ios';
        this.setState({time: selectedTime});
    }
    onRefresh = () => {
        this.setState({refreshing: true});
        this.fetchEvents();
        wait(1000).then(() => {this.setState({refreshing: false});});
      }
    onQuery = (text) => {
        this.setState({ query: text });

        const newData = this.eventsFilter.filter(item => {
            const itemData = `${item.name.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            events: newData,
        });
    }
    componentDidMount = () => {
        this.fetchEvents();
    }

    fetchEvents = () => {
        // console.log("mounted ")
        const token = this.props.route.params.token
        const groupID = this.props.route.params.groupId
        // console.log(groupID)
        url = Constants.baseURL + '/authed/groupbyid?token=' + token + "&groupId=" + groupID;
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((res) => res.json())
            .then((resJson) => {
                this.setState({ events: resJson.data.group.events })
                this.eventsFilter = resJson.data.group.events;
                this.onQuery(this.state.query);
            });
        console.log('id',this.props.route.params.userId)
    }
    renderPastEvent = (itemData) => {
        var eventDate = new Date(itemData.item.datetime)
        var date = new Date();
        if (date < eventDate) {return}
        else {
        var postYearsAgo = Math.floor((date - eventDate) / (24 * 60 * 60 * 1000 * 365))
        var postMonthsAgo = Math.floor((date - eventDate) / (24 * 60 * 60 * 1000 * 30))
        var postDaysAgo = Math.floor((date - eventDate) / (24 * 60 * 60 * 1000))
        var postHoursAgo = Math.floor((date - eventDate) / ((60 * 60 * 1000)))
        var postMinuteAgo = Math.floor((date - eventDate) / (60 * 1000));
        // console.log(postDaysAgo)
        var displayTime = null;
        if (postYearsAgo >= 1) {
            displayTime = postYearsAgo + " years ago"
        }
        else if (postMonthsAgo >= 1) {
            displayTime = postMonthsAgo + " months ago"
        }
        else if (postDaysAgo >= 1) {
            displayTime = postDaysAgo + " days ago"
        }
        else if (postHoursAgo >= 1) {
            displayTime = postHoursAgo + " hours ago"
        }
        else {
            displayTime = postMinuteAgo + " minutes ago"
        }
        var going = itemData.item.participants.length;
        const userId = this.props.route.params.userId;
        const find =  itemData.item.participants.filter(Element => {
            return Element === userId;
        });
        const isMyEvent = find.length > 0;
        var upcoming = false;
        return (
            <View style={{ flex: 1, backgroundColor: 'white'}}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('EventDetails', { upcoming: upcoming, isMyEvent: isMyEvent, going: going, isMyEvent: isMyEvent, userId: this.props.route.params.userId, token: this.props.route.params.token, groupId: this.props.route.params.groupId, eventId:itemData.item._id, eventName: itemData.item.name, host: itemData.item.host, time: itemData.item.datetime, address: itemData.item.address, description: itemData.item.description, participants: itemData.item.participants })}>
                    <View style={{ height: 160, backgroundColor: 'white'}}>
                        <View style={{ height:160, width: 200, marginLeft: 20, borderWidth: 0.5, borderRadius: 7, borderColor: '#dddddd', shadowRadius: 50, shadowColor: '#dddddd', shadowOffset: {width: 10, height: 20},}}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.postTime}>{displayTime}</Text>
                                <Text style={styles.eventPostName}>{itemData.item.name}</Text>
                                <Text style={styles.postLocation}>{itemData.item.address}</Text> 
                                {/* <Text style={styles.postMember}>{itemData.item.description}</Text>  */}
                                <Text style={styles.postMember}>{going} {going > 1 ? 'members' : 'member'} went</Text> 
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
        }
    }
    renderUpcomingEvent = (itemData) => {
        var eventDate = new Date(itemData.item.datetime)
        var date = new Date();
        if (date > eventDate) {return}
        else {
        // console.log(postDaysAgo)
        var displayTime = null
        var displayDate = null
        if (eventDate.getHours() > 14) var hour = eventDate.getHours() - 14
        else var hour = eventDate.getHours() + 24 - 14
        if (hour < 10) hour = `0${hour}`
        if (eventDate.getMinutes() < 10) var minute = `0${eventDate.getMinutes()}`
        else var minute = eventDate.getMinutes()
        displayTime = `${hour}:${minute}`
        displayDate = eventDate.toDateString()
        var going = itemData.item.participants.length
        const userId = this.props.route.params.userId;
        const find =  itemData.item.participants.filter(Element => {
            return Element === userId;
        });
        const isMyEvent = find.length > 0;
        var upcoming = true;
        return (
            <View style={{ flex: 1, backgroundColor: 'white'}}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('EventDetails', { upcoming: upcoming, isMyEvent: isMyEvent, going: going, userId: this.props.route.params.userId,token: this.props.route.params.token, groupId: this.props.route.params.groupId, eventId:itemData.item._id,  eventName: itemData.item.name, host: itemData.item.host, time: itemData.item.datetime, address: itemData.item.address, description: itemData.item.description, participants: itemData.item.participants })}>
                    <View style={{ height: 160, backgroundColor: 'white'}}>
                        <View style={{ height:160, width: 200, marginLeft: 20, borderWidth: 0.5, borderRadius: 7, borderColor: '#dddddd', shadowRadius: 50, shadowColor: '#dddddd', shadowOffset: {width: 10, height: 20},}}>
                            <View style={{ flex: 1 }}>
                                {/* <AccioText fontFamily='bold' style={{ fontSize: 18}}> {itemData.item.host.firstName} {itemData.item.host.lastName}</AccioText> */}
                                <Text style={styles.eventUpcomingName}>{itemData.item.name}</Text>
                                <Text style={styles.upcomingTime}>Date: {displayDate}</Text> 
                                <Text style={styles.upcomingTime}>Time: {displayTime}</Text> 
                                <Text style={styles.postLocation}>{itemData.item.address}</Text> 
                                {/* <Text style={styles.postMember}>{itemData.item.description}</Text>  */}
                                <Text style={styles.postMember}>{going} {going > 1 ? 'members are' : 'member is'} going</Text> 
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
        }
    }
    formatDate = (date, time) => {
        if (date.getDate() < 10) var day = `0${date.getDate()}`
        else var day = `${date.getDate()}`
        if (date.getMonth() < 9) var month = `0${date.getMonth()+1}`
        else var month = `${date.getMonth()+1}`
        if (time.getHours() < 10) var hour = `0${time.getHours()}`
        else var hour = `${time.getHours()}`
        if (time.getMinutes() < 9) var minute = `0${time.getMinutes()}`
        else var minute = `${time.getMinutes()}`
        return `${date.getFullYear()}-${month}-${day}T${hour}:${minute}:00Z`;
        };
    postEvent = () => {
        if (this.state.eventDescription == "" || this.state.eventName == "" || this.state.eventTime == "" || this.state.eventAddress == "") {
            alert("please fill out all fields")
        }
        else if (this.state.eventTime < new Date()) alert("please specify a valid event time")
        else {
            fetch(Constants.baseURL + '/authed/createevent', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: this.props.route.params.token,
                    name: this.state.eventName,
                    description: this.state.eventDescription,
                    address: this.state.eventAddress,
                    datetime: this.formatDate(this.state.date, this.state.time),
                    groupId: this.props.route.params.groupId,
                }),
            }).then((response) => response.json()).then((responseJson) => {
                // console.log(responseJson)
                this.setState({ events: [
                    // responseJson.data.post,
                     ...this.state.events] })
                this.setState({ isModalOpen: false })
            });
        }

    }

    render() {
        if (this.state.events.length == 0){
            return (
                <Container>
                <View style={styles.container}>
                    <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />} showsVerticalScrollIndicator={false}>
                        <AccioText fontFamily='medium' style={{paddingTop: 40,padding: 20,fontFamily: 'Montserrat-Regular',fontSize:20}}>There is no event for this group. Create an event instead :) </AccioText>
                    </ScrollView>
                    <TouchableOpacity onPress={() => this.setState({ isModalOpen: true })} style={styles.postModalButton}>
                        <AccioText fontFamily='medium' style={styles.postModalButtonText}> Create an Event </AccioText>
                    </TouchableOpacity>
                </View>

                <Modal style={{position: 'absolute',bottom: 0,top: this.state.keyboardSpace?-10-this.state.keyboardSpace: -250,
    padding: 10,
    width: 250,
    height: 150,
    borderRadius: 15   
  }} visible={this.state.isModalOpen} animationType={"fade"} isOpen={this.state.modalVisible} position={"bottom"} ref={"modal"} onClosed={()=> {this.setState({modalVisible:false});}}>
                    <View style={styles.postModal}>
                        <View style={styles.titleView}>
                            <AccioText style={{marginTop: 3,width: 310,height: 20,}} size={16} fontFamily='semiBold'>Event name</AccioText>
                            <TextInput style={styles.titleInput} placeholder="Name" onChangeText={(text) => this.setState({ eventName: text })} />
                        </View>

                        <View style={styles.titleView}>
                            <AccioText style={{marginTop: 3,width: 310,height: 20,}} size={16} fontFamily='semiBold'>Event address</AccioText>
                            <TextInput style={styles.titleInput} placeholder="Address" onChangeText={(text) => this.setState({ eventAddress: text })} />
                        </View>

                        <TouchableWithoutFeedback style={{}}onPress={Keyboard.dismiss} accessible={false} >
                            <View style={styles.titleView} >
                                <AccioText style={{marginTop: 3,width: 310,height: 20,}} size={16} fontFamily='semiBold'>Event description</AccioText>
                                <TextInput style={styles.postInputs} placeholder="What's the event about?" onChangeText={(text) => this.setState({ eventDescription: text })} multiline={true} />            
                            </View>
                        </TouchableWithoutFeedback>

                        <View style={styles.titleView}>
                            <AccioText style={{marginTop: 3,width: 310,height: 20,}} size={16} fontFamily='semiBold'>Event date</AccioText>
                            {/* <TextInput style={styles.titleInput} placeholder="Date and Time" onChangeText={(text) => this.setState({ eventTime: text })} /> */}
                            <RNDateTimePicker
                                testID="dateTimePicker"
                                timeZoneOffsetInMinutes={0}
                                value={this.state.date}
                                mode={'date'}
                                is24Hour={true}
                                display="default"
                                onChange={this.setDate}
                                minimumDate={new Date()}
                                style={{height: 105}}
                            />
                            <AccioText style={{marginTop: 3,width: 310,height: 20,}} size={16} fontFamily='semiBold'>Event time</AccioText>

                            <RNDateTimePicker
                                testID="dateTimePicker"
                                timeZoneOffsetInMinutes={0}
                                value={this.state.time}
                                mode={'time'}
                                is24Hour={true}
                                display="default"
                                onChange={this.setTime}
                                style={{height: 105}}
                            />
                        </View>
                         
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                            <TouchableOpacity onPress={() => this.setState({ isModalOpen: false })} style={styles.cancelButton}>
                                <AccioText style={styles.buttonText}> Cancel </AccioText>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.postButton} onPress={this.postEvent}>
                                <AccioText fontFamily='medium' style={styles.buttonText} >
                                    Post Event
                                </AccioText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </Container>
            ) 
        }
        else{
            return(
            <Container>
 
                <SearchBar
                    placeholder="Search for Events"
                    lightTheme
                    round
                    inputContainerStyle={styles.searchInputContainer}
                    containerStyle={styles.searchContainer}
                    onChangeText={text => this.onQuery(text)}
                    autoCorrect={false}
                    value={this.state.query}
                    placeholderStyle = {{ fontFamily:'Montserrat-Regular'}}
                />

                <View style={styles.container}>
                    <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />} showsVerticalScrollIndicator={false}>
                        <AccioText fontFamily='bold' style={{paddingTop : 15, fontSize: 20, marginLeft: 30, paddingBottom: 15}}>Upcoming events:</AccioText>
                        <FlatList horizontal={true} style={styles.feed} inverted={false} numColumns={1} data={this.state.events.sort((a,b) => a.datetime.localeCompare(b.datetime))} renderItem={this.renderUpcomingEvent} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} />
                        <AccioText fontFamily='bold' style={{paddingTop : 30, fontSize: 20, marginLeft: 30, paddingBottom: 15}}>Past events:</AccioText>
                        <FlatList horizontal={true} style={styles.feed} inverted={false} numColumns={1} data={this.state.events} renderItem={this.renderPastEvent} inverted={true} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} />
                    </ScrollView>
                    <TouchableOpacity onPress={() => this.setState({ isModalOpen: true })} style={styles.postModalButton}>
                        <AccioText fontFamily='medium' style={styles.postModalButtonText}> Create an Event </AccioText>
                    </TouchableOpacity>
                </View>

                <Modal visible={this.state.isModalOpen} animationType={"fade"}>
                    <View style={styles.postModal}>
                        <View style={styles.titleView}>
                            <AccioText style={{marginTop: 3,width: 310,height: 20,}} size={16} fontFamily='semiBold'>Event name</AccioText>
                            <TextInput style={styles.titleInput} placeholder="Name" onChangeText={(text) => this.setState({ eventName: text })} />
                        </View>

                        <View style={styles.titleView}>
                            <AccioText style={{marginTop: 3,width: 310,height: 20,}} size={16} fontFamily='semiBold'>Event address</AccioText>
                            <TextInput style={styles.titleInput} placeholder="Address" onChangeText={(text) => this.setState({ eventAddress: text })} />
                        </View>

                        <TouchableWithoutFeedback style={{}}onPress={Keyboard.dismiss} accessible={false} >
                            <View style={styles.titleView} >
                                <AccioText style={{marginTop: 3,width: 310,height: 20,}} size={16} fontFamily='semiBold'>Event description</AccioText>
                                <TextInput style={styles.postInputs} placeholder="What's the event about?" onChangeText={(text) => this.setState({ eventDescription: text })} multiline={true} />            
                            </View>
                        </TouchableWithoutFeedback>

                        <View style={styles.titleView}>
                            <AccioText style={{marginTop: 3,width: 310,height: 20,}} size={16} fontFamily='semiBold'>Event date</AccioText>
                            {/* <TextInput style={styles.titleInput} placeholder="Date and Time" onChangeText={(text) => this.setState({ eventTime: text })} /> */}
                            <RNDateTimePicker
                                testID="dateTimePicker"
                                timeZoneOffsetInMinutes={0}
                                value={this.state.date}
                                mode={'date'}
                                is24Hour={true}
                                display="default"
                                onChange={this.setDate}
                                minimumDate={new Date()}
                                style={{height: 105}}
                            />
                            <AccioText style={{marginTop: 3,width: 310,height: 20,}} size={16} fontFamily='semiBold'>Event time</AccioText>

                            <RNDateTimePicker
                                testID="dateTimePicker"
                                timeZoneOffsetInMinutes={0}
                                value={this.state.time}
                                mode={'time'}
                                is24Hour={true}
                                display="default"
                                onChange={this.setTime}
                                style={{height: 105}}
                            />
                        </View>
                         
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                            <TouchableOpacity onPress={() => this.setState({ isModalOpen: false })} style={styles.cancelButton}>
                                <AccioText style={styles.buttonText}> Cancel </AccioText>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.postButton} onPress={this.postEvent}>
                                <AccioText fontFamily='medium' style={styles.buttonText} >
                                    Post Event
                                </AccioText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* <Form> */}

            </Container>
        )
    }
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
  },
  postTextFieldButton: {
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 5,
  },
  postModalButton:{
      alignItems: 'center', 
      margin: 20, 
      paddingTop: 8, 
      paddingBottom: 8, 
      borderRadius: 5, 
      borderWidth: 1, 
      borderColor: '#D82121'
  },
  postModalButtonText: {
      fontSize: 18, 
      color: '#D82121'
  },
  postModal: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      marginTop: 20
  },
  eachPost: {
      margin: 5,
  },
  titleInput: {
      borderColor: 'gray',
      color: 'gray',
      marginTop: 7,
      width: 310,
      height: 20,
      fontFamily: 'Montserrat-Regular',
      borderBottomWidth: 1
  },
    titleView: {
      marginTop: 15,
  },
    contentView: {
      marginTop: 15,
  },
  postInputs: {
      width: 310,
      height: 120,
      borderColor: 'lightgray',
      borderWidth: 1,
      borderRadius: 1,
      marginTop: 10,
      padding: 20,
      paddingTop: 25,
      borderRadius: 5,
      textAlignVertical: 'top', // Only works for Android phones
      fontFamily: 'Montserrat-Regular',

  },
  feed: {
      marginHorizontal: 12
  },
  avatar: {
      width: 45,
      height: 45,
      borderRadius: 24,
      marginRight: 16
  },
  eventPostName: {
      fontSize: 17, 
      fontWeight: '500',
      paddingTop: 7,
      fontWeight: 'bold',
      marginLeft: 17,
      fontFamily: 'Montserrat-Bold',
  },
  eventUpcomingName: {
    fontSize: 17, 
    fontWeight: '500',
    paddingTop: 13,
    fontWeight: '800',
    fontFamily: 'Montserrat-Bold',
    marginLeft: 17,
},
  postTime: {
      marginTop: 13,
      fontSize: 13,
      color: "#D82121",
      fontWeight: '600',
      marginLeft: 17
  },
  upcomingTime: {
    marginTop: 5,
    fontSize: 12,
    color: "#D82121",
    fontWeight: '600',
    marginLeft: 17
  },
    postLocation: {
      marginTop: 10,
      fontSize: 13,
      color: "#838899",
      fontWeight: '600',
      marginLeft: 17
  },
    postMember: {
      marginTop: 14,
      fontSize: 12,
    //   color: "#838899",
      fontWeight: '600',
      marginLeft: 17
  },
  postImage: {
      width: undefined,
      height: 150,
      borderRadius: 5,
      marginVertical: 16
  },
  postName: {
      fontWeight: "bold",
      marginBottom: 20
  },
  postButton: {
      width: 200,
      backgroundColor: Constants.defaultColor,
      borderRadius: 6,
      marginTop: 20,
      marginLeft: 5,
      paddingTop: 12,
      paddingBottom: 12,
      alignItems: 'center',
  },
  cancelButton:{
      width: 100,
      backgroundColor: 'lightgray',
      borderRadius: 6,
      marginTop: 20,
      marginRight: 5,
      paddingTop: 12,
      paddingBottom: 12,
      alignItems: 'center',
  },
  buttonText: {
      color: 'white',
      fontWeight: '500',
      fontSize: 15,
  },
  searchContainer: {
        backgroundColor: 'white',
        borderWidth: 10,
        shadowColor: 'white',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        // borderColor: 'transparent',
    },
  searchInputContainer: {
        backgroundColor: 'white' ,
    },
})

export default Events;
