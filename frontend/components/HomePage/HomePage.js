import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import AccioText from '../AccioText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Constants from '../../Constants'


class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return(
            <ImageBackground source={require('../../assets/activity.jpg')} style={styles.containerView}>
                <AccioText color='white' size={40} weight='600' fontFamily='semiBold' textAlign='center' style={styles.titleText} > 
                    accio 
                </AccioText>
 
                <View style={styles.contentView}>
                    <AccioText color='white' size={20} fontFamily='semiBold'> 
                        Welcome 
                    </AccioText>

                    <AccioText color='white' weight='300' style={{textAlign: 'center', paddingVertical: 5,}}> 
                        Connect with your interest groups and locate your friends 
                    </AccioText>

                    <TouchableOpacity style={styles.signupBtn} onPress={() => this.props.navigation.navigate('Signup')}>
                        <AccioText color='white' weight='500' textAlign='center' fontFamily='medium'>
                            Create Account
                        </AccioText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginBtn} onPress={() => this.props.navigation.navigate('Login')}>
                        <AccioText color="black" weight="500" textAlign='center' fontFamily='medium'> 
                            Login
                        </AccioText>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }
}



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    containerView: {
        flex: 1, 
        width: null,
        height: null,
        resizeMode: 'cover',
    },
    contentView: {
        paddingLeft: 50,
        paddingRight: 50,
        flexGrow: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        top: (windowHeight/8) + 70,
    },
    signupBtn: {
        marginTop: 10,
        paddingTop:10,
        paddingBottom:10,
        width: 260,
        backgroundColor: Constants.defaultColor,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Constants.defaultColor,
    },
    loginBtn: {
        marginTop: 10,
        width: 260,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'white',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'white',
    },
    titleText: {        
        top: windowHeight/8,
    },   
})

export default HomePage;