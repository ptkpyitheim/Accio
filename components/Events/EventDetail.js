import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { Container } from 'native-base';
import AccioText from '../AccioText';
import { Dimensions } from 'react-native';
import * as Constants from '../../Constants'

class EventDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.route.params.userId,
            isLoaded: false,
            // isMyGroup: false,
            participants: [],
            isJoining: false,
            isLeaving: false,
            isMyEvent: this.props.route.params.isMyEvent,
        }
    }
    // componentDidMount() {
    //     this.props.navigation.setOptions({
    //         name: this.props.route.params.eventName,
    //     })
    //     fetch(Constants.baseURL + '/authed/me?token=' + this.props.route.params.token, {
    //         method: 'GET',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //         }
    //     }).then((res) => res.json())
    //         .then((resJson) => {

    //             this.setState({ myID: resJson.data.me._id });
    //             if (resJson.data.me.groups.includes(this.props.route.params.groupId)) {
    //                 this.setState({ isMyGroup: true, isLoaded: true })
    //             }
    //             this.setState({ isLoaded: true })
    //         });

    //     //Get information for the group
    //     // this.getInfoForGroup();
    // }

    // getInfoForGroup = () => {
    //     fetch(Constants.baseURL + '/authed/groupbyid?token=' + this.props.route.params.token + '&groupId=' + this.props.route.params.groupId, {
    //         method: 'GET',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         }
    //     }).then((res) => res.json())
    //         .then((resJson) => {
    //             this.setState({ members: resJson.data.group.members });
    //             // console.log('Members:', resJson.data.group.members)
    //         });
    // }

    joinEvent = () => {
        this.setState({ isJoining: true })
        console.log(this.props.route.params.participants)
        fetch(Constants.baseURL + '/authed/joinevent', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: this.props.route.params.token,
                groupId: this.props.route.params.groupId,
                eventId: this.props.route.params.eventId,
            }),

        })
            .then((res) => res.json())
            .then((resJson) => {
                console.log(resJson)
                this.setState({ isMyEvent: true, isJoining: false })
                //Refetch the data after joining
                // this.getInfoForGroup();
            })
            .catch((err) => console.error("Error joining event ", err));
            console.log('id',this.props.route.params.userId)
    }

    render() {
        //Props constants
        const eventName = this.props.route.params.eventName;
        const host = this.props.route.params.host;
        const time = this.props.route.params.time;
        const me = this.props.route.params.token;
        const address = this.props.route.params.address;
        const description = this.props.route.params.description;
        const participants = this.props.route.params.participants;
        var going = this.props.route.params.participants.length;
        // const join = participants.include(me);
        const userId = this.props.route.params.userId;
        const find =  this.props.route.params.participants.filter(item => {
            return item === userId;
        });
        const isMyEvent = find.length > 0;
        const upcoming = this.props.route.params.upcoming;

        console.log('id',this.props.route.params.userId);
        console.log('id',userId)
        console.log('id',going)

        var eventDate = new Date(time)
        var date = new Date();
        var displayTime = null
        var displayDate = null
        if (eventDate.getHours() > 14) var hour = eventDate.getHours() - 14
        else var hour = eventDate.getHours() + 24 - 14
        if (hour < 10) hour = `0${hour}`
        if (eventDate.getMinutes() < 10) var minute = `0${eventDate.getMinutes()}`
        else var minute = eventDate.getMinutes()
        displayTime = `${hour}:${minute}`
        displayDate = eventDate.toDateString()

        //Components            
        const JoinBtn =
            <View style={{ paddingBottom: 20 }}>
                {this.props.route.params.upcoming ?
                <TouchableOpacity style={styles.button} onPress={this.joinEvent}>
                    {this.state.isJoining ?
                        <ActivityIndicator size="small" color='white' animating={true} hidesWhenStopped /> :
                        <AccioText color='white' fontFamily='medium' size={15} >
                            Going?
                        </AccioText>
                    }
                </TouchableOpacity>
                : <AccioText style={{ backgroundColor: Constants.defaultColor, color: 'white', padding:10, width: 180, marginVertical:50}} fontFamily='medium' size={15} >
                    You didn't go to the event...
                </AccioText> }
                
            </View>

        const GoBtn =
            <View style={{ paddingBottom: 20 }}>
                {/* <TouchableOpacity style={styles.button}> */}
                    {this.state.isJoining ?
                        <ActivityIndicator size="small" color='white' animating={true} hidesWhenStopped /> :
                        this.props.route.params.upcoming ?
                        <AccioText style={{backgroundColor: Constants.defaultColor, color: 'white', padding:10, width: 180, marginVertical:50}} fontFamily='medium' size={15} >
                            You are going for the event!
                        </AccioText>
                        : <AccioText style={{ backgroundColor: Constants.defaultColor, color: 'white', padding:10, width: 180, marginVertical:20}} fontFamily='medium' size={15} >
                            You went to the event!
                        </AccioText>}
                {/* </TouchableOpacity> */}
            </View>

        const rightArrow =
            <Image
                source={require('../../assets/rightArrow.png')}
                style={styles.rightArrowBtn}
            />

        const ViewDetailsComponent =
            <View style={{ borderTopColor: 'grey', borderTopWidth: 0.7, marginTop: 30 }}>
                <TouchableOpacity
                    style={styles.viewDetailsBtn}
                    onPress={this.toMembersPage}
                >
                    <AccioText color="grey" fontFamily='medium' size={18} >
                        Members
                    </AccioText>
                    {rightArrow}
                </TouchableOpacity>
            </View>


        return (
            <Container style={styles.container}>
                <View style={styles.container}>
                    <ScrollView style={styles.body}>
                        <AccioText color="black" size={30} style={styles.eventNameStyle} >
                            {eventName}
                        </AccioText>
                        <View style={{ borderBottomColor: 'lightgrey', borderBottomWidth: 1, }}/>
                        <AccioText color="black" size={15} style={{fontFamily: 'Montserrat-Bold',paddingTop: 20,paddingBottom: 10,paddingHorizontal: 15,}} >
                            Event date and time:
                        </AccioText>
                        <AccioText color="black" size={15} style={{paddingTop: 0,paddingBottom: 10,paddingHorizontal: 15,}} >
                            {displayDate}
                        </AccioText>
                        <AccioText color="grey" size={15} style={{paddingTop: 0,paddingBottom: 10,paddingHorizontal: 15,}} >
                            {displayTime}
                        </AccioText>
                        <AccioText color="black" size={15} style={{fontFamily: 'Montserrat-Bold',paddingTop: 10,paddingBottom: 10,paddingHorizontal: 15,}} >
                            Event address:
                        </AccioText>
                        <AccioText color="black" size={15} style={{paddingTop: 0,paddingBottom: 30,paddingHorizontal: 15,}} >
                            {address}
                        </AccioText>
                        <AccioText color="black" size={15} style={{paddingTop: 0,paddingBottom: 20,paddingHorizontal: 15,}} >
                            {going} {going > 1 ? 'members are' : 'member is'} going
                        </AccioText>
                        <View style={{ borderBottomColor: 'lightgrey', borderBottomWidth: 1, }}/>
                        <AccioText color="black" size={15} style={{fontFamily: 'Montserrat-Bold',paddingTop: 20,paddingBottom: 10,paddingHorizontal: 15,}} >
                            Event description:
                        </AccioText>
                        <AccioText color="black" size={15} style={{paddingTop: 0,paddingBottom: 20,paddingHorizontal: 15,}} >
                            {description}
                        </AccioText>
                        
                        {this.state.isMyEvent ? GoBtn:
                            [JoinBtn]}

                    </ScrollView>
                </View>
            </Container>

        );

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        paddingHorizontal: 40,
        paddingBottom: 80,
    },
    cell: {
        flex: 1,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: { width: 1, height: 1 },
        padding: 10,
    },
    grid: {
        height: 40,
        margin: 15,
        flex: 1,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
    },
    title: {
        fontSize: 20,
    },
    button: {
        width: 140,
        backgroundColor: Constants.defaultColor,
        borderRadius: 6,
        marginTop: 30,
        paddingTop: 12,
        paddingBottom: 12,
        alignItems: 'center',
    },
    image: {
        width: Dimensions.get('window').width,
        height: 240,
    },
    eventNameStyle: {
        paddingTop: 20,
        paddingBottom: 10,
        // paddingHorizontal: 5,
        fontFamily: 'Montserrat-Bold',
        fontWeight: '300',
    },
    textBody: {
        paddingVertical: 10,
    },
    viewDetailsBtn: {
        borderBottomWidth: 0.7,
        borderBottomColor: 'grey',
        flexDirection: 'row',
        paddingVertical: 10,
    },
    rightArrowBtn: {
        width: 18,
        height: 18,
        marginLeft: 'auto',
        alignSelf: 'center',
    }
})
export default EventDetail;