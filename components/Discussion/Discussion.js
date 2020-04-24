import React, { Component, useState } from 'react';
import { Text, StyleSheet, Button, FlatList, Modal, Image, RefreshControl, TouchableOpacity, Keyboard } from 'react-native';
import { Container, View } from 'native-base';
import Hamburger from '../Hamburger';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import * as Constants from '../../Constants';
import AccioText from '../AccioText';
import Comment from '../Discussion/Comment'

function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

class Discussion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            postContent: "",
            postTitle: "",
            posts: null,
            refreshing: false,
        }
        // this.intervalDiscussions = [];
    }
    onRefresh = () => {
        this.setState({ refreshing: true });
        this.fetchPosts();
        wait(1000).then(() => { this.setState({ refreshing: false }); });
    }

    componentDidMount = () => {
        this.fetchPosts();
        // this.intervalDiscussions = setInterval(this.fetchPosts.bind(this),500);
    }

    // componentWillUnmount() {
    //     clearInterval(this.intervalDiscussions);
    //     this.intervalDiscussions = null;
    // }

    fetchPosts = () => {
        // console.log("mounted ")
        const token = this.props.route.params.token
        const groupID = this.props.route.params.groupId
        // console.log(groupID)
        const url = Constants.baseURL + '/authed/groupbyid?token=' + token + "&groupId=" + groupID;
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((res) => res.json())
            .then((resJson) => {
                this.setState({ posts: resJson.data.group.posts.reverse() })
            });
    }

    renderPost = (itemData) => {
        var postDate = new Date(itemData.item.timestamp)
        var date = new Date();
        var postDaysAgo = Math.floor((date - postDate) / (24 * 60 * 60 * 1000))
        var postHoursAgo = Math.floor((date - postDate) / ((60 * 60 * 1000)))
        var postMinuteAgo = Math.floor((date - postDate) / (60 * 1000));
        console.log(itemData.item.title)
        console.log("Hour ", postHoursAgo)
        console.log("days", postDaysAgo)
        console.log("minute ago", postMinuteAgo)
        var displayTime = null

        if (postMinuteAgo < 60 && postHoursAgo < 24) {
            displayTime = postMinuteAgo + " minutes ago"
        }
        else if (postMinuteAgo > 60 && postHoursAgo < 24) {
            displayTime = postHoursAgo + " hours ago"
        }
        else if (postHoursAgo > 24) {
            displayTime = postDaysAgo + " days ago"
        }
        else {
            displayTime = "a long time ago"
        }
        console.log("displayTime", displayTime)
        return (
            <View style={styles.discussionPost}>
                <View style={{ padding: 30 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image style={styles.avatar} source={{ uri: Constants.baseURL + '/profilePictures/' + itemData.item.owner._id + ".jpg" + '?time=' + new Date() }} defaultSource={require('../../assets/images/default-profile-pic.png')} />
                        <AccioText fontFamily='bold' style={{ paddingTop: 5, fontSize: 18 }}> {itemData.item.owner.firstName} {itemData.item.owner.lastName}</AccioText>
                    </View>
                    <AccioText style={{ marginTop: -12, paddingLeft: 65, fontSize: 12, color: 'gray' }}>@{itemData.item.owner.username}</AccioText>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View style={{ paddingTop: 20, }}>
                                <Text style={styles.discussionPostTitle}>{itemData.item.title}</Text>
                            </View>
                        </View>

                        <Text style={styles.post}>{itemData.item.content}</Text>

                        <View style={styles.commentView}>

                            <Text style={{ fontSize: 12, color: '#c2c2c2' }}>{displayTime}</Text>

                            <View style={{ marginLeft: 'auto' }}>
                                <FontAwesome name="comment-o" size={22} onPress={() => this.props.navigation.navigate('Comment', { postId: itemData.item._id, token: this.props.route.params.token })} />
                            </View>
                        </View>

                    </View>
                </View>
            </View>
        )
    }

    postDiscussion = () => {
        if (this.state.postContent == "" || this.state.postTitle == "") {
            alert("please fill out all fields")
        }
        else {
            fetch(Constants.baseURL + '/authed/createpost', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: this.props.route.params.token,
                    title: this.state.postTitle,
                    content: this.state.postContent,
                    groupId: this.props.route.params.groupId
                }),
            }).then((response) => response.json()).then((responseJson) => {
                console.log(responseJson)
                this.setState({
                    posts: [
                        // responseJson.data.post,
                        ...this.state.posts]
                })
                this.setState({ isModalOpen: false })
            });
        }

    }


    render() {
        // console.log(this.state.posts)
        return (
            < Container >

                <View style={styles.container}>
                    <TouchableOpacity onPress={() => this.setState({ isModalOpen: true })} style={styles.postModalButton}>
                        <AccioText fontFamily='medium' style={styles.postModalButtonText}> Post a Discussion... </AccioText>
                    </TouchableOpacity>
                    <FlatList style={styles.feed} numColumns={1} data={this.state.posts} renderItem={this.renderPost} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />} />
                </View>

                <Modal visible={this.state.isModalOpen} animationType={"fade"}>
                    <View style={styles.postModal}>
                        <View style={styles.titleView}>
                            <AccioText size={16} fontFamily='semiBold'>Post Title</AccioText>
                            <TextInput style={styles.titleInput} placeholder="Title" onChangeText={(text) => this.setState({ postContent: text })} />
                        </View>

                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                            <View style={styles.contentView}>
                                <AccioText size={16} fontFamily='semiBold'>Content</AccioText>
                                <TextInput style={styles.postInputs} placeholder="What's on your mind?" onChangeText={(text) => this.setState({ postTitle: text })} multiline={true} />
                            </View>
                        </TouchableWithoutFeedback>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                            <TouchableOpacity onPress={() => this.setState({ isModalOpen: false })} style={styles.cancelButton}>
                                <AccioText style={styles.buttonText}> Cancel </AccioText>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.postButton} onPress={this.postDiscussion}>
                                <AccioText fontFamily='medium' style={styles.buttonText} >
                                    Post Discussion
                                </AccioText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </Container >
        )

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
    postModalButton: {
        alignItems: 'center',
        margin: 20,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'lightgray'
    },
    postModalButtonText: {
        fontSize: 18,
        color: 'gray'
    },
    postModal: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: 150
    },
    eachPost: {
        margin: 30,

    },
    titleInput: {
        borderColor: 'gray',
        color: 'gray',
        marginTop: 10,
        width: 310,
        height: 30,
        fontFamily: 'Montserrat-Regular',
        borderBottomWidth: 1
    },
    postInputs: {
        width: 310,
        height: 120,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 1,
        marginTop: 30,
        padding: 20,
        paddingTop: 25,
        borderRadius: 5,
        textAlignVertical: 'top', // Only works for Android phones
        fontFamily: 'Montserrat-Regular',

    },
    feed: {
        marginHorizontal: 16
    },
    discussionPost: {
        borderColor: '#ededed',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 15,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 24,
        marginRight: 16
    },
    discussionPostTitle: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 0,
    },
    post: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 13,
        color: "gray",
    },
    postImage: {
        width: undefined,
        height: 150,
        borderRadius: 5,
        marginVertical: 16
    },
    titleView: {
        marginTop: 0,
    },
    contentView: {
        marginTop: 40,
    },
    postTitle: {
        fontWeight: "bold",
        marginBottom: 20
    },
    postButton: {
        width: 200,
        backgroundColor: Constants.defaultColor,
        borderRadius: 6,
        marginTop: 30,
        marginLeft: 5,
        paddingTop: 12,
        paddingBottom: 12,
        alignItems: 'center',
    },
    cancelButton: {
        width: 100,
        backgroundColor: 'lightgray',
        borderRadius: 6,
        marginTop: 30,
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
    commentView: {
        flexDirection: 'row',
        // paddingTop: -10,
        // alignItems: "flex-end",
    }
})
export default Discussion;