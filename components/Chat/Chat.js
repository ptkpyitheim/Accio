// @flow
import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import { View, StyleSheet, Button, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import Fire from './Fire';


class Chat extends Component {


    state = {
        messages: [],
    };

    get user() {
        return {
            name: this.props.route.params.name,
            _id: Fire.shared.uid,
        };
    }
    sendMessage = (e) => {

        Fire.shared.send(e)

    }

    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={message => this.sendMessage(message)}
                user={this.user}
            />
            // <View>
            //     <Text>HI</Text>
            // </View>
        );
    }

    componentDidMount() {

        let combindedID = this.props.route.params.name + this.props.route.params.friendName
        let alphanumCombinedID = combindedID.replace(/[^a-z0-9]/gi, '')
        let sentID = alphanumCombinedID.split('').sort().join('')
        console.log(alphanumCombinedID)
        Fire.shared.setId(sentID)
        Fire.shared.on(message =>
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, message),
            }))
        );
    }
    componentWillUnmount() {
        Fire.shared.off();
    }
}

export default Chat;
