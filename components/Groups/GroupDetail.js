import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { Container, Icon, Toast } from 'native-base';
import AccioText from '../AccioText';
import { Dimensions } from 'react-native';
import * as Constants from '../../Constants'

//for picture handling
import { Ionicons } from "@expo/vector-icons";
import UserPermissions from "../../utilities/UserPermissions";
import * as ImagePicker from "expo-image-picker";
import { connect } from 'react-redux';
function mapStateToProps(state) {
    return {
        token: state.reducer.token,
        me: state.reducer.me,
        avatar: state.reducer.avatar,
    }
}

class GroupDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myID: "",
            isLoaded: false,
            isMyGroup: false,
            members: [],
            isJoining: false,
            isLeaving: false,
            isRequested: false,
            isCanceling: false,
            image: Constants.baseURL + '/groupPictures/' + this.props.route.params.groupId + ".jpg"
        }
    }
    componentDidMount() {
        this.props.navigation.setOptions({
            title: this.props.route.params.groupName,
        })
        fetch(Constants.baseURL + '/authed/me?token=' + this.props.route.params.token, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((res) => res.json())
            .then((resJson) => {
                this.setState({ myID: resJson.data.me._id });
                console.log('id1', resJson.data.me._id)
                if (resJson.data.me.groups.includes(this.props.route.params.groupId)) {
                    this.setState({ isMyGroup: true, isLoaded: true })
                }
                else if (resJson.data.me.outgoingGroupReq.find(g => this.props.route.params.groupId === g._id) != undefined) {
                    this.setState({ isRequested: true, isLoaded: true })
                }
                this.setState({ isLoaded: true })
            });

        //Get information for the group
        this.getInfoForGroup();
    }

    getInfoForGroup = () => {
        fetch(Constants.baseURL + '/authed/groupbyid?token=' + this.props.route.params.token + '&groupId=' + this.props.route.params.groupId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((res) => res.json())
            .then((resJson) => {
                this.setState({ members: resJson.data.group.members });
                // console.log('Members:', resJson.data.group.members)
            });
    }

    showToast = (text, type) => {
        Toast.show({
            text: text,
            buttonText: 'OK',
            duration: 3000,
            type: type,
        })
    }

    addGroup = () => {
        this.setState({ isJoining: true })

        fetch(Constants.baseURL + '/authed/addgroup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: this.props.route.params.token,
                gid: this.props.route.params.groupId,
                uid: this.props.route.params.owner
            }),

        })
            .then((res) => res.json())
            .then((resJson) => {
                this.showToast("Request sent.", "success")
                this.setState({ isMyGroup: false, isJoining: false, isRequested: true })
                //Refetch the data after joining
                this.getInfoForGroup();
            })
            .catch((err) => console.error("Error joining group ", err));
    }

    cancelReq = () => {
        this.setState({ isCanceling: true })

        fetch(Constants.baseURL + '/authed/cancelgroup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: this.props.route.params.token,
                gid: this.props.route.params.groupId,
                uid: this.props.route.params.owner
            }),

        })
            .then((res) => res.json())
            .then((resJson) => {
                this.showToast("Request cancelled")
                this.setState({ isMyGroup: false, isJoining: false, isRequested: false, isCanceling: false })
            })
            .catch((err) => console.error("Error cancelling group req: ", err));
    }

    leaveGroup = () => {
        this.setState({ isLeaving: true })

        fetch(Constants.baseURL + '/authed/leavegroup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: this.props.route.params.token,
                groupId: this.props.route.params.groupId
            }),

        })
            .then((res) => res.json())
            .then((resJson) => {
                console.log(resJson)
                this.setState({ isMyGroup: false, isLeaving: false })
                //Refetch the data after leaving
                this.getInfoForGroup();
            })
            .catch((err) => console.error("Error Leaving group ", err));
    }

    toDiscussionPage = () => {
        this.setState({ isTransitioningToNextScreen: true })
        return (
            this.props.navigation.navigate('Discussion', { groupId: this.props.route.params.groupId, token: this.props.route.params.token })
        )
    }

    toMembersPage = () => {

        return (
            this.props.navigation.navigate('Group Members', { groupMembers: this.state.members, myId: this.props.me.username })
        )
    }

    toEventsPage = () => {
        this.setState({ isTransitioningToNextScreen: true })
        return (
            this.props.navigation.navigate('Events', { userId: this.state.myID, groupId: this.props.route.params.groupId, token: this.props.route.params.token })
        )
    }

    handlePickImage = async () => {
        console.log("groupID:", this.props.route.params.groupId);
        console.log("token:", this.props.route.params.token);

        UserPermissions.getCameraPermission();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            base64: true
        });
        if (!result.cancelled) {
            this.setState({ image: result.uri });
            fetch(Constants.baseURL + "/authed/uploadGroupPicture?groupId=" + this.props.route.params.groupId, {
                method: "POST",
                body: result.base64,
                headers: new Headers({
                    'Authorization': this.props.route.params.token,
                    'Content-Type': 'application/base64'
                })
            }).then(res => {
                console.log(JSON.stringify(res));
            }).catch(err => console.log(err));
        }
    };

    render() {
        //Props constants
        const groupName = this.props.route.params.groupName;
        const groupDesc = this.props.route.params.groupDescription;

        //States contants
        const isJoining = this.state.isJoining;
        const isLeaving = this.state.isLeaving;
        const isRequested = this.state.isRequested;
        const isCanceling = this.state.isCanceling;
        const isMyGroup = this.state.isMyGroup;
        const numMembers = this.state.members.length;

        //Components  
        // cancel add request
        const CancelBtn =
            <View>
                <TouchableOpacity style={styles.button} onPress={this.cancelReq}>
                    {isCanceling ?
                        <ActivityIndicator size="small" color='white' animating={true} hidesWhenStopped /> :
                        <AccioText color='white' fontFamily='medium' size={15} >
                            Cancel Request
                        </AccioText>
                    }
                </TouchableOpacity>
            </View>
        // create add request
        const AddBtn =
            <View style={{ paddingBottom: 20 }}>
                <TouchableOpacity style={styles.button} onPress={this.addGroup}>
                    {isJoining ?
                        <ActivityIndicator size="small" color='white' animating={true} hidesWhenStopped /> :
                        <AccioText color='white' fontFamily='medium' size={15} >
                            Join Group
                        </AccioText>
                    }

                </TouchableOpacity>
            </View>

        const DetailBtn = isRequested ? CancelBtn : AddBtn

        const LeaveBtn =
            <View style={{ paddingBottom: 20 }}>
                <TouchableOpacity style={styles.button} onPress={this.leaveGroup}>
                    {isLeaving ?
                        <ActivityIndicator size="small" color='white' animating={true} hidesWhenStopped /> :
                        <AccioText color='white' fontFamily='medium' size={15} >
                            Leave Group
                    </AccioText>}
                </TouchableOpacity>
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
                <TouchableOpacity
                    style={styles.viewDetailsBtn}
                    onPress={this.toEventsPage}
                >
                    <AccioText color="grey" fontFamily='medium' size={18} >
                        Events
                    </AccioText>
                    {rightArrow}
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.viewDetailsBtn}
                    onPress={this.toDiscussionPage}
                >
                    <AccioText color="grey" fontFamily='medium' size={18} >
                        Discussion
                    </AccioText>
                    {rightArrow}
                </TouchableOpacity>
            </View>


        return (
            <Container style={styles.container}>
                <View style={styles.container}>
                    {/* <Image
                        style={styles.image}
                        resizeMode="center"
                        source={require('../../assets/images/blankImage.png')}
                    /> */}
                    {isMyGroup ?
                        <TouchableOpacity style={styles.image} onPress={this.handlePickImage}>
                            <Image source={{ uri: this.state.image }} defaultSource={require('../../assets/images/blankImage.png')} style={styles.image} />
                            <Ionicons
                                name="ios-add"
                                size={40}
                                color="#FFF"
                                style={{ marginTop: 6, marginLeft: 2 }}
                            ></Ionicons>
                        </TouchableOpacity>
                        :
                        <Image source={{ uri: this.state.image }} defaultSource={require('../../assets/images/blankImage.png')} style={styles.image} />
                    }
                    <ScrollView style={styles.body}>
                        <AccioText color="black" fontFamily='bold' size={25} style={styles.groupNameStyle} >
                            {groupName}
                        </AccioText>
                        <AccioText color="black" fontFamily='medium' size={15} style={styles.textBody} >
                            {numMembers} {numMembers > 1 ? 'members' : 'member'} in {groupName}
                        </AccioText>
                        <AccioText color="grey" size={15} >
                            {groupDesc}
                        </AccioText>
                        {!this.state.isLoaded ?
                            <View style={{ flex: 0.5, justifyContent: 'center' }}>
                                <ActivityIndicator size="large" color={Constants.defaultColor} animating={true} hidesWhenStopped />
                            </View>
                            :
                            isMyGroup ? [ViewDetailsComponent, LeaveBtn] : DetailBtn
                        }

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
    groupNameStyle: {
        paddingVertical: 15,
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
export default connect(mapStateToProps)(GroupDetail);