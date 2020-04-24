import React from 'react';
import { Right, Header, Body, Title, Icon, Button, Left } from 'native-base';
import { StyleSheet, View, Dimensions } from 'react-native';



export default class Hamburger extends React.Component {

    render() {

        if (this.props.isMap) {
            return (
                <View style={styles.mapOverlay}>
                    <Button
                        transparent
                        onPress={() => this.props.nav.navigation.openDrawer()}>
                        <Icon
                            name='menu'
                            ios='ios-menu'
                            android="md-menu"
                            style={{ textAlign: 'center', fontSize: 40, color: 'black', padding: 0 }}
                        />
                    </Button>
                </View>
            );
        }
        return (
            <Header style={styles.header} >
                <Left>
                    <Button
                        transparent={this.props.isMap !== 'undefined' ? true : false}
                        onPress={() => this.props.nav.navigation.openDrawer()}>
                        <Icon
                            name='menu'
                            ios='ios-menu'
                            android="md-menu"
                            style={{ fontSize: 40, color: 'black', padding: 10 }}
                        />
                    </Button>
                </Left>
                <Body>
                    <Title style={{ fontFamily: 'Montserrat-Regular', fontSize: 18 }}>{this.props.title}</Title>
                </Body>
                <Right />

            </Header>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'transparent',
        height: 80,
        paddingBottom: 10,
        borderBottomColor: 'transparent',
    },
    mapOverlay: {
        position: 'absolute',
        top: "4%",
        width: 60,
        height: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        shadowColor: 'grey',
        shadowOpacity: 1,
        shadowOffset: { height: 2 },
        borderRadius: 30,
        marginLeft: 10
    }
})