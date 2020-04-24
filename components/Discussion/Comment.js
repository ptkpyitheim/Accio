import React, { Component, useState } from 'react';
import { Text, StyleSheet, Button, FlatList, Modal, Image, RefreshControl, TouchableOpacity, Keyboard, KeyboardAvoidingView } from 'react-native';
import { Container, View } from 'native-base';
import Hamburger from '../Hamburger';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Ionicons } from "@expo/vector-icons";
import * as Constants from '../../Constants';
import AccioText from '../AccioText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

function mapStateToProps(state) {
    return {
        token: state.reducer.token,
        me: state.reducer.me,
        // avatar: state.reducer.avatar
    }
}

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: null,
            postContent: "",
        }
        // this.intervalDiscussions = [];
    }


    componentDidMount = () => {
        this.fetchComment();
    }
    fetchComment = () => {
        console.log("fetching")
        const token = this.props.route.params.token
        const postId = this.props.route.params.postId
        // console.log(groupID)
        url = Constants.baseURL + '/authed/getCommentsByPost?token=' + token + "&postId=" + postId;
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((res) => res.json())
            .then((resJson) => {
                this.setState({ comments: resJson.data.comments.reverse() })
                // console.log(resJson)
            });
    }
    postComment = () => {
        if (this.state.postContent == "") {
            alert("please fill out all fields")
        }
        else {
            fetch(Constants.baseURL + '/authed/addComment', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: this.props.route.params.token,
                    text: this.state.postContent,
                    postId: this.props.route.params.postId
                }),
            }).then((response) => response.json()).then((responseJson) => {
                console.log("Post user", responseJson)
                this.setState({
                    postContent: "",
                    comments: [responseJson.data.comment, ...this.state.comments]
                })
                this.componentDidMount();
                console.log("postcontent", this.state.postContent)
            });
        }

    }
    renderComment = (itemData) => {
        // console.log("Data HERE!!!!!", itemData)
        return (

            <View style={styles.comment}>
                <Image style={styles.avatar} source={require('../../assets/images/default-profile-pic.png')} />
                <View>
                    <Text style={{ paddingTop: 5, fontSize: 12, fontWeight: 'bold' }}>@{itemData.item.author.username}</Text>
                    <AccioText style={{ paddingTop: 5, fontSize: 20 }}> {itemData.item.text}</AccioText>
                </View>

            </View>

        )

    }
    render() {

        return (

            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View>
                    <View style={styles.commentSection}>
                        <View style={styles.commentArea}>
                            <TextInput value={this.state.postContent} placeholder={"Add a comment..."} clearButtonMode='always' onChangeText={(text) => this.setState({ postContent: text })} />
                        </View>
                        <TouchableOpacity style={styles.postButton} onPress={this.postComment}>
                            <AccioText style={{ color: "white" }}>Comment</AccioText>
                        </TouchableOpacity>
                    </View>
                </View>

                <FlatList style={styles.flatlist} data={this.state.comments} renderItem={this.renderComment} />


            </View>



        )

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        height: '100%',
    },
    commentSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        marginBottom: 20,
    },
    commentArea: {
        paddingBottom: 10,
        borderWidth: 0.5,
        borderColor: 'lightgray',
        borderRadius: 5,
        paddingTop: 10,
        paddingLeft: 15,
        backgroundColor: 'white',
        width: 250,
        height: 40,
        marginRight: 10,
    },
    postButton: {

        width: 90,
        height: 40,
        backgroundColor: Constants.defaultColor,
        color: 'white',
        borderRadius: 6,
        paddingTop: 12,
        paddingLeft: 7,
        paddingRight: 7,
        paddingBottom: 12,
        alignItems: 'center',
    },
    flatlist: {
        marginHorizontal: 16,
        backgroundColor: '#fff',
        // height: '50%',
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 24,
        marginRight: 16
    },
    comment: {
        flexDirection: 'row',
        margin: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
        paddingBottom: 10,
    }

})
export default Comment;