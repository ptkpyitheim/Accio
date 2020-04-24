import React, { useState, useEffect, Component } from 'react';
import { View, FlatList, StyleSheet, Button, Text, Item, RefreshControl, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Hamburger from '../Hamburger';
import { Container } from 'native-base';
import * as Constants from '../../Constants'
import AccioText from '../AccioText'

import { connect } from 'react-redux';

function mapStateToProps(state) {
    return {
        token: state.reducer.token
    }
}

function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

class FindGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            query: '',
            groups: [],
            refreshing: false,
        }
        this.groupsFilter = [];
        this.intervalFindGroups = [];
    }
    onQuery = (text) => {
        this.setState({ query: text });

        const newData = this.groupsFilter.filter(item => {
            const itemData = `${item.name.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            groups: newData,
        });
    }
    onRefresh = () => {
        this.setState({ refreshing: true });
        this.fetchGroups();
        wait(1000).then(() => { this.setState({ refreshing: false }); });
    }
    // setUpGroups = (resJson) => {
    //     console.log(2);
    //     return (
    // this.setState({ isLoaded: true, groups: resJson.data.groups }
    //     )
    // }
    componentDidMount() {
        this.fetchGroups();
        // this.intervalFindGroups = setInterval(this.fetchGroups.bind(this), 2000);
    }

    // componentWillUnmount() {
    //     clearInterval(this.intervalFindGroups);
    //     this.intervalFindGroups = null;
    // }

    fetchGroups = () => {
        console.log("token", this.props.token);
        let url = Constants.baseURL + '/allgroups?excludeByToken=' + this.props.token;
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((res) => res.json())
            .then((resJson) => {
                this.setState({ isLoaded: true, groups: resJson.data.groups })
                this.groupsFilter = resJson.data.groups;
                console.log(this.groupsFilter[0]);
                this.onQuery(this.state.query);
            });
    }

    renderGrid = ({ item }) => {
        return (
            <View style={styles.grid}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('GroupDetails', { groupName: item.name, groupMember: item.members, token: this.props.token, groupId: item._id, groupDescription: item.description, owner: item.owner })}>
                    <View>
                        <Image source={{ uri: Constants.baseURL + '/groupPictures/' + item._id + ".jpg" + '?time='+ new Date()}} defaultSource={require('../../assets/images/blankImage.png')} style={styles.cell} />
                        <AccioText fontFamily="semiBold" size={10} style={styles.cellItem}>{item.name}</AccioText>
                        <AccioText fontFamily="regular" size={10} style={{ width: 161, color: '#8f8f8f', fontSize: 10 }}>{item.description}</AccioText>
                    </View>
                </TouchableOpacity>
            </View>



        )
    }
    render() {
        if (this.state.isLoaded) {
            return (
                <Container>
                    <Hamburger nav={this.props} title="Find Groups" />

                    <SearchBar
                        placeholder="Search for Interest Groups"
                        lightTheme
                        round
                        inputContainerStyle={styles.searchInputContainer}
                        containerStyle={styles.searchContainer}
                        onChangeText={text => this.onQuery(text)}
                        autoCorrect={false}
                        value={this.state.query}
                        placeholderStyle={{ fontFamily: 'Montserrat-Regular' }}
                    />


                    <FlatList numColumns={2} data={this.state.groups} renderItem={this.renderGrid} keyExtractor={(item) => item._id} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />} />

                </Container>




            )
        } else {
            return (
                <Container>
                    <Hamburger nav={this.props} title="Find Groups" />
                    <View style={{ flex: 0.5, justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color={Constants.defaultColor} animating={true} hidesWhenStopped />
                    </View>
                </Container>
            )
        }

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    searchContainer: {
        backgroundColor: 'white',
        borderWidth: 0,
        shadowColor: 'white',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent'
    },
    searchInputContainer: {
        backgroundColor: 'white',
    },
    cell: {
        flex: 1,
        borderRadius: 5,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        height: 10,
        padding: 50,
        width: 161,
        backgroundColor: '#d6d6d6'
    },
    cellItem: {
        marginTop: 5,
        fontSize: 14,
        width: 161,
    },
    cellText: {
        fontSize: 10,
        color: '#8f8f8f'
    },
    grid: {
        height: 140,
        margin: 15,
        flex: 1,
    }
})

export default connect(mapStateToProps)(FindGroup);
