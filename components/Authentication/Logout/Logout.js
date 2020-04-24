import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

import {connect} from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AccioText from '../../AccioText'
import * as Constants from '../../../Constants'

class Logout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoggingOut: false,
        }
    }

    Logout = () => {
        this.setState({ isLoggingOut: true })
        setTimeout(() => console.log('Logging out . . .'), 2000)
        this.props.deleteToken();
        this.props.logoutUser(false);
        setTimeout(() => console.log('Logging out to false . . .'), 2000)
        this.setState({ isLoggingOut: false })
    }

    render() {
        return(
            <View style={styles.logoutComp}>
                <TouchableOpacity onPress={this.Logout}>
                    { this.state.isLoggingOut ?
                        <ActivityIndicator size="large" color={Constants.defaultColor} animating={true} hidesWhenStopped /> :
                        <AccioText weight="600" color="accio">Logout</AccioText>
                    }
                </TouchableOpacity>
            </View>
        );
    }
}


function mapStateToProps(state) {
    return {
        token: ""
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteToken: () => dispatch({
            type: 'SEND_TOKEN',
            token: ""
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);

const styles = StyleSheet.create({
    logoutComp: {
        marginTop: 50,
        borderTopWidth: 0.5, 
        borderTopColor: 'grey',
        paddingVertical: 20,
        width: 200,
    },
  });


