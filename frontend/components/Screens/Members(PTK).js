import React, { Component } from 'react';
import { Platform, Text, StyleSheet, TouchableOpacity, Modal, Image, ScrollView, FlatList } from 'react-native';
import { View, Container } from 'native-base';
import Hamburger from '../Hamburger';
import * as Constants from '../../Constants'
import AccioText from '../AccioText'
import Person from '../Person(PTK)'
import { connect } from 'react-redux';



function mapStateToProps(state) {
    return {
        me: state.reducer.me,
    }
}

class GroupMembersScreen extends Component {

    /**************************************** PTK ****************************************/

    renderGrid = ({ item }) => {
        return (
            <View style={styles.eachMember}>
                <Person item={item} {...this.props} />
            </View>
        )
    }
    
    /**************************************** PTK ****************************************/


    render() {
        var members = this.props.route.params.groupMembers;
        return (
            <Container>
                <View style={styles.container}>
                    <FlatList numColumns={1}
                        data={members.sort((a, b) => a.firstName.localeCompare(b.firstName))}
                        renderItem={this.renderGrid}
                    />
                </View>
            </Container>
        );
    }
}

export default connect(mapStateToProps)(GroupMembersScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 10,
        paddingHorizontal: 10
    },
    eachMember: {
        flexDirection: 'row',
    }
});