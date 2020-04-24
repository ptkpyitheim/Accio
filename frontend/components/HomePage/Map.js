import React, { Component } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, OverlayComponent } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Dimensions, StyleSheet } from 'react-native';
import { Container, Content, View } from 'native-base';
import * as Constants from '../../Constants'

import Hamburger from '../Hamburger';
import Live from './Live';
import { connect } from 'react-redux';
import store from '../../store'

function mapStateToProps(state) {
    return {
        token: state.reducer.token,
        me: state.reducer.me
    }
}

class Map extends Component {

    _isMounted = false;

    constructor() {
        super();
        this.state = {
            region: {
                latitude: 360,
                longitude: 360,
                latitudeDelta: 360,
                longitudeDelta: 360,


            },
            memberLocation: []
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.getCurrentPosition().then(pos => {
            const loc = pos.coords;

            this.setMapRegion(loc);

            this.getAllMemberLocation();


            this.getCurrentPosition().then(pos => {
                this.updateLocationOnServer(pos.coords);
            });

            setInterval(this.getAllMemberLocation.bind(this), 5000);
            setInterval(() => {
                this.getCurrentPosition().then(pos => {
                    this.updateLocationOnServer(pos.coords);
                });
            }, 5000)
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    getAllMemberLocation() {
        if (this.props && this.props.token) {
            fetch(Constants.baseURL + '/authed/mygroups?token=' + this.props.token, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((res) => res.json())
                .then((resJson) => {
                    if (resJson.status != 'success') {
                        return;
                    }
                    let groups = resJson.data.groups;
                    let liveMember = {};
                    for (let i = 0; i < groups.length; i++) {
                        for (let j = 0; j < groups[i].liveMembers.length; j++) {
                            let mem = groups[i].liveMembers[j];
                            if (mem._id != this.props.me._id) {
                                liveMember[mem._id] = groups[i].liveMembers[j];
                            }
                        }
                    }
                    this.setState({ memberLocation: Object.values(liveMember) })
                });
        }




    }
    getCurrentLocation = () => {
        return this._getLocationAsync();
    }

    setMapRegion = (reg) => {
        if (this._isMounted) {
            this.setState({
                region: {
                    latitude: reg.latitude,
                    longitude: reg.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }
            });
        }
    }
    state = { modalVisible: false, };

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    updateLocationOnServer(location) {
        return fetch(Constants.baseURL + '/authed/updatelocation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: this.props.token,
                longitude: location.longitude,
                latitude: location.latitude
            })
        });
    }

    async getCurrentPosition() {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
            return Location.getCurrentPositionAsync({});
        }
        else {
            return {};
        }
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
            let region = await Location.getCurrentPositionAsync({});
            this.setMapRegion(region.coords);
            // console.log(JSON.stringify(region));
            // console.log('send the location');

            return this.updateLocationOnServer(region).then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.status == 'fail') {
                        // console.log("User not logged in. Location not saved");
                    }
                    else {
                        // console.log("location updated");
                    }
                }).catch((err) => {
                    // console.error("error", err);
                });
        }
        else {
            // console.log("not granted");
        }
    }

    render() {
        const allMarker = [];
        // TODO: exclude yourself from members

        for (let i = 0; i < this.state.memberLocation.length; i++) {
            let entries = this.state.memberLocation[i];
            // TODO: description should show group name
            allMarker.push(
                <Marker
                    key={entries._id}
                    title={entries.firstName + ' ' + entries.lastName + ' (' + entries.username + ')'}
                    description={entries.liveGroup.name}
                    coordinate={{
                        latitude: entries.location.latitude, longitude: entries.location.longitude
                    }}
                    pinColor={'red'}
                    onCalloutPress={() => alert('Clicked')}
                    onPress={() => console.log('do something')}
                />
            )
        }
        return (
            <View style={styles.container}>
                <View>
                    <MapView
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.mapStyle}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        zoomEnabled={true}
                        showsCompass={true}
                        // followsUserLocation={true}
                        region={this.state.region} // I think this code is causing error where we can't zoom out
                        // initialRegion={this.state.region} // This line lets you zoom out but doesn't center at your current location until you click recenter
                        // onRegionChangeComplete={region => this.setState({ region: region })}
                        loadingEnabled
                    >
                        {allMarker}
                        {/* <Marker
                                title={"CSE437 Fun Group"}
                                description={"Join us in making an app"}
                                coordinate={{
                                    latitude: 38.649103, longitude:-90.306138
                                }}
                                pinColor={ 'green' }
                                onCalloutPress={() => alert('Clicked')}
                                onPress={()=>console.log('do something')}
                            /> */}


                    </MapView>
                    <Hamburger
                        isMap={true}
                        nav={this.props}
                    />
                    <Live />
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    button: {
        backgroundColor: '#FF9800',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0
    },
})

export default connect(mapStateToProps)(Map);