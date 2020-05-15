import React, { Component } from 'react';
import { Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, FlatList, Alert, ScrollView, TextInput } from 'react-native';
import { Container, View, Toast } from 'native-base';
import Hamburger from '../Hamburger(PTK)';
import AccioText from '../AccioText'
import * as Constants from '../../Constants'

import { connect } from 'react-redux';
import Person from '../Person(PTK)';

function mapStateToProps(state) {
    return {
        token: state.reducer.token,
        me: state.reducer.me,
        // avatar: state.reducer.avatar
    }
}

class Profile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            token: "",
            user: "",
            isLoaded: false,
            friends: [],
            incomingRequests: [],
        }
        this.intervalGroups = [];
    }

    async componentDidMount() {
        this.fetchNumGroups();
        this.intervalGroups = setInterval(this.fetchNumGroups.bind(this), 500);
    }

    componentWillUnmount() {
        clearInterval(this.intervalGroups);
        this.intervalGroups = null;
    }

    fetchNumGroups = async () => {
        try {
            await fetch(Constants.baseURL + '/authed/me?token=' + this.props.token, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((res) => res.json())
                .then((resJson) => {
                    this.props.dispatch({ type: 'UPDATE_ME', me: resJson.data.me })

                    this.setState({ user: resJson.data.me, incomingRequests: resJson.data.me.friends.incomingReq, friends: resJson.data.me.friends.friends, isLoaded: true });
                });
        }
        catch (error) {
            this.setState({ isLoaded: false })
        }
    }

    respondToFriendRequest = (response, id) => {
        fetch(Constants.baseURL + "/authed/respondtofriendrequest", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: this.props.token,
                friendId: id,
                accept: response,
            }),
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.status === 'success') {
                    let filteredReqs = this.state.incomingRequests.filter(el => el._id === id)
                    this.setState({ incomingRequests: filteredReqs })
                    this.fetchNumGroups()
                    let text = (response) ? 'Confirmed request' : 'Deleted request'
                    let type = (response) ? 'success' : 'undefined'
                    Toast.show({
                        text: text,
                        buttonText: 'OK',
                        duration: 3000,
                        type: type
                    })
                }
                else if (resJson.status === 'fail') {
                    Alert.alert("Friend request failed")
                }
            })
            .catch((err) => alert(err));
    }
    joinGroup = (response, group_id, user_id) => {
        fetch(Constants.baseURL + "/authed/joingroup", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: this.props.token,
                uid: user_id,
                gid: group_id,
                accept: response
            })
        })
            .then((res) => res.json())
            .then((resJson) => {
                console.log(resJson)
                if (resJson.status == 'success') {
                    // remove group from incoming Group Req
                    const n = this.props.me.incomingGroupReq.filter(el => el.group._id === group_id)
                    this.props.me.incomingGroupReq = n
                    this.props.dispatch({ type: 'UPDATE_ME', me: this.props.me })

                    let text = (response) ? 'Confirmed request' : 'Deleted request'
                    let type = (response) ? 'success' : 'undefined'
                    Toast.show({
                        text: text,
                        buttonText: 'OK',
                        duration: 3000,
                        type: type
                    })
                }
                else if (resJson.status == 'fail') {
                    console.log("fail ", resJson)
                    Alert.alert("error: ", resJson)
                }
            })
            .catch((err) => alert(err));
    }


    renderFriends = ({ item }) => {
        return (
            <View>
                <Person item={item} {...this.props} />
            </View>
        )
    }

    renderIncomingReqs = ({ item }) => {
        return (
            <View>
                <Person item={item} respond={this.respondToFriendRequest} type='incoming' {...this.props} />
            </View>
        )
    }

    renderGroupReqs = ({ item }) => {
        return (
            <View>
                <Person type="groupincoming" item={item} id={item._id} mutual={5} respond={this.joinGroup} {...this.props} />
            </View>
        )
    }
    editProfile = () => {
        Alert.alert("Would you like to edit your profile?",
            " ",
            [
                {
                    text: "Cancel",
                },
                {
                    text: "Edit Profile",
                    onPress: () => {
                        return (
                            this.props.navigation.navigate('Edit Profile', { token: this.props.token, user: this.state.user }));
                    }
                },
            ],
            { cancelable: true }
        );
    }

    render() {

        let user = this.state.user
        let hamburger = <Hamburger nav={this.props} title="My Profile" />
        let incomingReqs = this.state.incomingRequests // incoming friend reqs
        let groupReqs = this.props.me.incomingGroupReq // incoming group reqs
        let friends = this.state.friends

        //If a profile is redirected from GroupDetails
        if (typeof (this.props.route.params) !== 'undefined') {
            user = this.props.route.params.reqUser
            hamburger = <View></View>
        }

        return (
            <Container>
                {hamburger}
                {!this.state.isLoaded ?
                    <View style={{ flex: 0.5, justifyContent: 'center' }}>
                        <ActivityIndicator size="small" color={Constants.defaultColor} animating={true} hidesWhenStopped />
                    </View> :
                    <ScrollView style={styles.container}>
                        <View style={styles.cell}>
                            <Person type='profile' respond={this.respondToFriendRequest} item={user} />
                        </View>

                        <View style={styles.content}>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                                <AccioText fontFamily='semiBold' style={{ color: Constants.defaultColor }}>ABOUT</AccioText>
                                {(user._id === this.props.me._id) ?
                                    <TouchableOpacity onPress={this.editProfile}><AccioText size={12} color="grey" fontFamily='medium'>edit</AccioText></TouchableOpacity> :
                                    <AccioText size={12} color="grey" fontFamily='medium'></AccioText>
                                }

                            </View>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <AccioText style={styles.contentText}>Email </AccioText>
                                {(user._id === this.props.me._id) ?
                                    <TouchableOpacity onPress={this.editProfile}><AccioText style={styles.contentText}>{user.email}</AccioText></TouchableOpacity> :
                                    <AccioText style={styles.contentText}>{user.email}</AccioText>
                                }
                            </View>

                            {
                                (user._id !== this.props.me._id) ?
                                    null :
                                    <View>
                                        <AccioText fontFamily='semiBold' style={{ color: Constants.defaultColor }}>FRIENDS</AccioText>

                                        {
                                            friends.length === 0 ?
                                                <AccioText style={{ marginBottom: 20, marginTop: 5 }} size={12}>You have no friends yets :( </AccioText> :
                                                <View>
                                                    <FlatList numColumns={1}
                                                        data={friends}
                                                        renderItem={this.renderFriends}
                                                    />
                                                </View>
                                        }


                                        <AccioText fontFamily='semiBold' style={{ color: Constants.defaultColor, marginTop: 10 }}>FRIEND REQUESTS</AccioText>

                                        {
                                            this.props.me.friends.incomingReq.length === 0 ?
                                                <AccioText style={{ marginBottom: 20, marginTop: 5 }} size={12}>You have no incoming friend requests yet </AccioText> :
                                                <View>
                                                    <FlatList numColumns={1}
                                                        data={incomingReqs}
                                                        renderItem={this.renderIncomingReqs}
                                                    />
                                                </View>
                                        }
                                        <AccioText fontFamily='semiBold' style={{ color: Constants.defaultColor, marginTop: 10 }}>GROUP REQUESTS</AccioText>

                                        {
                                            this.props.me.incomingGroupReq.length === 0 ?
                                                <View style={{ marginBottom: 20, marginTop: 5 }} >
                                                    <AccioText size={12}>You have no incoming group requests yet. </AccioText>
                                                </View> :
                                                <View>
                                                    <FlatList numColumns={1}
                                                        data={groupReqs}
                                                        renderItem={this.renderGroupReqs}
                                                    />
                                                </View>
                                        }

                                    </View>
                            }

                        </View>

                    </ScrollView>
                }

            </Container>
        )

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 40,
    },
    cell: {
        flexDirection: 'row',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        paddingVertical: 10,
        // borderWidth: 0.5,
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingTop: 30
    },
    cellText: {
        marginTop: 20,
        fontSize: 20,
        flexWrap: 'wrap'
    },
    subtitleText: {
        color: 'grey',
        fontSize: 14,
    },
    contentText: {
        marginLeft: 20,
        marginBottom: 30,
        fontSize: 14,
        marginTop: 5
    },
    cellImage: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
    },
    button: {
        width: 100,
        marginTop: 10,
        backgroundColor: Constants.defaultColor,
        borderRadius: 6,
        paddingVertical: 10,
        alignItems: 'center',
    },
    confirmBtn: {
        width: 70,
        height: 30,
        backgroundColor: Constants.defaultColor,
        borderRadius: 4,
        paddingVertical: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },
    deleteBtn: {
        width: 70,
        height: 30,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: 'black',
        borderRadius: 4,
        paddingVertical: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },
});

export default connect(mapStateToProps)(Profile);