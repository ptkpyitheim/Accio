import React from 'react'
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { View, Container, Toast } from 'native-base';
import { connect } from 'react-redux';

//for picture handling
import { Ionicons } from "@expo/vector-icons";
import UserPermissions from "../utilities/UserPermissions";
import * as ImagePicker from "expo-image-picker";

import AccioText from './AccioText'
import * as Constants from '../Constants'

function mapStateToProps(state) {
    return {
        token: state.reducer.token,
        me: state.reducer.me,
        avatar: state.reducer.avatar,
    }
}

class Person extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            type: 'none',
            status: "",
            me: this.props.me,
            showToast: false,
            avatar: Constants.baseURL + '/profilePictures/' + this.props.me._id + ".jpg",
        }
    }

    getMe = () => {
        fetch(Constants.baseURL + '/authed/me?token=' + this.props.token, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((res) => res.json())
            .then((resJson) => {
                if (resJson.status !== 'success') {
                    return
                }
                else if (resJson.status === 'success') {
                    this.props.dispatch({ type: 'UPDATE_ME', me: resJson.data.me })
                    this.setState({ me: resJson.data.me })
                }
            }).catch((err) => alert(err))
    }


    toProfile = (user) => {
        (typeof (this.props.route.params) === 'undefined') ?
            this.props.navigation.navigate('ProfileModal', { reqUser: user, mode: "modal" }) :
            this.props.navigation.navigate('Profile', { reqUser: user })
    }

    statusWithUser = (user) => {
        let me = this.props.me
        let myFriends = me.friends.friends
        let myIncomingReqs = me.friends.incomingReq
        let myOutgoingReqs = me.friends.outgoingReq

        if (me._id === user._id) {
            //If it's me just return an empty string
            return ""
        }

        for (let i = 0; i < myFriends.length; i++) {
            if (myFriends[i]._id === user._id) {
                return 'friends'
            }
        }
        for (let i = 0; i < myIncomingReqs.length; i++) {
            if (myIncomingReqs[i]._id === user._id) {
                return 'accept'
            }
        }
        for (let i = 0; i < myOutgoingReqs.length; i++) {
            if (myOutgoingReqs[i]._id === user._id) {
                return 'pending'
            }
        }
        return 'add'
    }

    onChangeFriendStatus = (status) => {
        this.setState({ status: status })
    }

    showToast = (text, type) => {
        Toast.show({
            text: text,
            buttonText: 'OK',
            duration: 3000,
            type: type,
        })
    }

    addFriend = (id) => {
        fetch(Constants.baseURL + "/authed/addfriend", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: this.props.token,
                friendId: id,
            }),
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.status === 'success') {
                    this.showToast('Friend request sent.', 'success')
                    this.getMe()
                    this.onChangeFriendStatus('pending')
                }
                else {
                    Alert.alert("Friend request", "Adding failed. Something is wrong. It's on us :(")
                }
            }).catch((err) => console.log('error in adding friend', err));
    }

    unFriend = (id) => {
        fetch(Constants.baseURL + "/authed/unfriend", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: this.props.token,
                friendId: id
            }),
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.status === 'success') {
                    this.showToast("Successfully unfriended", 'success')
                    this.getMe()
                    this.onChangeFriendStatus('add')
                }
            }).catch((err) => this.showToast('Error unfriending'))
    }

    cancelRequest = (id) => {
        fetch(Constants.baseURL + "/authed/cancelrequest", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: this.props.token,
                friendId: id
            }),
        })
            .then((res) => res.json())
            .then((resJson) => {
                if (resJson.status === 'success') {
                    this.showToast("Cancelled request", 'success')
                    this.getMe()
                    this.onChangeFriendStatus('add')
                }
            }).catch((err) => {
                console.log(err);
                this.showToast('Error cancelling request')
            })
    }

    calculateMutualGroups = (myGroups, theirGroups) => {
        // (myGroups && theirGroups) ? myGroups.filter((val) => theirGroups.indexOf(val) !== -1).length : null
        return (myGroups.filter((val) => theirGroups.indexOf(val) !== -1)).length
    }
    handlePickAvatar = async () => {
        UserPermissions.getCameraPermission();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            base64: true
        });
        if (!result.cancelled) {
            this.setState({ avatar: result.uri });
            fetch(Constants.baseURL + "/authed/uploadProfilePicture", {
                method: "POST",
                body: result.base64,
                headers: new Headers({
                    'Authorization': this.props.token,
                    'Content-Type': 'application/base64'
                })
            }).then(res => {
                // console.log(JSON.stringify(res));
                this.getMe();
            }).catch(err => console.log(err));
        }
    };

    render() {

        let status = this.state.status

        let type = this.props.type
        let firstName = this.props.item.firstName
        let lastName = this.props.item.lastName
        let numMutualGroups = 0
        let username = this.props.item.username
        let person_id = this.props.item._id
        let avatar = Constants.baseURL + '/profilePictures/' + person_id + ".jpg"

        let Buttons = null
        let MemberOrFriends =
            <View>
                <AccioText fontFamily='medium' size={16}>{firstName + ' ' + lastName}</AccioText>
                <AccioText size={12} color="grey" fontFamily='medium'>{'@' + username}</AccioText>
                {/* <AccioText size={12} color="grey">{numMutualGroups} mutual {numMutualGroups > 1 ? "groups" : "group"}</AccioText> */}
            </View>


        if (type === 'incoming') {
            numMutualGroups = this.calculateMutualGroups(this.props.me.groups, this.props.item.groups)
            Buttons =
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <TouchableOpacity style={styles.confirmBtn} onPress={() => this.props.respond(true, person_id)}>
                        <AccioText color="white" weight='500' size={12}>Confirm</AccioText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => this.props.respond(false, person_id)}>
                        <AccioText color="black" weight='500' size={12}>Delete</AccioText>
                    </TouchableOpacity>
                </View>
        }
        else if (type == 'profile') {
            MemberOrFriends =
                <View>
                    <AccioText fontFamily='bold' size={20}>{firstName + ' ' + lastName}</AccioText>
                    <AccioText size={12} color="grey" fontFamily='medium'>{'@' + username}</AccioText>
                    <AccioText size={14} color="grey">Member of {this.props.item.groups.length} {this.props.item.groups.length > 1 ? 'groups' : 'group'}</AccioText>
                </View>

            if (this.statusWithUser(this.props.item) === 'pending' || status === 'pending') {
                //Pending... - Cancel Request button show
                Buttons =
                    <View>
                        <TouchableOpacity style={styles.button} onPress={() => this.cancelRequest(person_id)}>
                            <AccioText color='white' weight='500' size={12} >
                                Cancel Request
                            </AccioText>
                        </TouchableOpacity>
                    </View>

            }
            else if (this.statusWithUser(this.props.item) === 'friends' || status === 'friends') {
                //Unfriend button show
                Buttons =
                    <View style={{ marginLeft: 8 }}>
                        <TouchableOpacity style={styles.button} onPress={() => this.unFriend(person_id)} >
                            <AccioText color='white' weight='500' size={12} >
                                Unfriend
                            </AccioText>
                        </TouchableOpacity>
                    </View>
            }
            else if (this.statusWithUser(this.props.item) === 'accept' || status === 'accept') {
                Buttons =
                    <View style={{ flexDirection: 'row', marginTop: 6 }}>
                        <AccioText color="grey" size={10}>{firstName} sent you a friend request</AccioText>
                    </View>
            }
            else if (this.statusWithUser(this.props.item) === 'add' || status === 'add') {
                Buttons =
                    <View style={{ marginLeft: 8 }}>
                        <TouchableOpacity style={styles.button} onPress={() => this.addFriend(person_id)}>
                            <AccioText color="white" weight='500' size={14}>Add Friend</AccioText>
                        </TouchableOpacity>
                    </View>
            }
        }
        else if (type == 'groupincoming') {
            Buttons =
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <TouchableOpacity style={styles.confirmBtn} onPress={() => this.props.respond(true, this.props.item.group._id, this.props.item.user._id)}>
                        <AccioText color="white" weight='500' size={12}>Confirm</AccioText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => this.props.respond(false, this.props.item.group._id, this.props.item.user._id)}>
                        <AccioText color="black" weight='500' size={12}>Delete</AccioText>
                    </TouchableOpacity>
                </View>

            firstName = this.props.item.user.firstName
            lastName = this.props.item.user.lastName

            MemberOrFriends =
                <View>
                    <AccioText fontFamily='medium' size={16}>{firstName + ' ' + lastName}</AccioText>
                    <AccioText color="grey" size={10}>{firstName} wants to join {this.props.item.group.name}</AccioText>
                </View>

        }

        return (
            <View>
                {
                    type == 'profile' ?
                        <View style={styles.cell} >
                            {this.props.me._id === person_id ?
                                <TouchableOpacity style={styles.avatarPlaceholder} onPress={this.handlePickAvatar}>
                                    <Image source={{ uri: this.state.avatar }} defaultSource={require('../assets/images/default-profile-pic.png')} style={styles.cellImage} />
                                    <Ionicons
                                        name="ios-add"
                                        size={40}
                                        color="#FFF"
                                        style={{ marginTop: 6, marginLeft: 2 }}
                                    ></Ionicons>
                                </TouchableOpacity>
                                :
                                <Image source={{ uri: avatar }} defaultSource={require('../assets/images/default-profile-pic.png')} style={styles.cellImage} />
                            }
                            <View style={{ flexDirection: (type === 'add' || type === 'cancel') ? 'row' : 'column', marginLeft: 30 }}>
                                <View>
                                    {MemberOrFriends}
                                </View>
                                {Buttons}
                            </View>
                        </View> :

                        <View style={{ flexDirection: 'row' }}>

                            <TouchableOpacity style={styles.cell} onPress={() => this.toProfile(this.props.item)}>
                                <Image style={styles.cellImage} source={{ uri: avatar }} defaultSource={require('../assets/images/default-profile-pic.png')} />
                                <View style={{ flexDirection: (type === 'add' || type === 'cancel') ? 'row' : 'column', marginLeft: 30 }}>
                                    <View>
                                        {MemberOrFriends}
                                    </View>
                                    {Buttons}
                                </View>
                            </TouchableOpacity>
                            {
                                person_id === this.props.me._id ?
                                    null :
                                    <TouchableOpacity style={{ paddingTop: 40, paddingLeft: 20 }} onPress={() => this.props.navigation.navigate('Chat', { name: this.props.me.username, friendName: username })}>
                                        <AccioText style={{ color: Constants.defaultColor, fontFamily: 'Montserrat-SemiBold', }}>Message</AccioText>
                                    </TouchableOpacity>
                            }
                        </View>
                }

            </View>
        )
    }
}

export default connect(mapStateToProps)(Person);

const styles = StyleSheet.create({
    cellImage: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
    },
    groupImage: {
        width: 80,
        height: 80
    },
    cell: {
        flexDirection: 'row',
        height: 100,
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
    button: {
        width: 110,
        height: 30,
        backgroundColor: Constants.defaultColor,
        borderRadius: 4,
        paddingVertical: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
    },
    addBtn: {
        width: 100,
        height: 30,
        backgroundColor: Constants.defaultColor,
        borderRadius: 4,
        paddingVertical: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
    },
    cancelBtn: {
        width: 100,
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
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
        backgroundColor: "#E1E2E6",
    },
})
