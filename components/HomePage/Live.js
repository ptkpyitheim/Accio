import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Button, Text, Picker, Form, View } from 'native-base';
import * as Constants from '../../Constants'

import { connect } from 'react-redux';

function mapStateToProps(state) {
    return {
        token: state.reducer.token,
        me: state.reducer.me
    }
}

class Live extends Component {
    constructor() {
        super();
        this.state = {
            selected: null,
            showPicker: true,
            showLiveButton: true,
            showEndButton: false,
            mygroups: null
        };
    }
    componentDidMount() {
        //reset values
        this.state = {
            selected: null,
            showPicker: true,
            showLiveButton: true,
            showEndButton: false,
            mygroups: null
        };

        // TODO: move this to a componentDidFocus sort of function instead of polling
        setInterval(this.fetchGroups.bind(this), 5000);

        this.fetchGroups().then(groups => {
            this.setState({selected: ""});
        });
        this.userIsLive().then(isLive => {
            if (isLive) {
                this.setState({
                    showPicker: false,
                    showLiveButton: false,
                    showEndButton: true
                });
            }
        });
    }

    async userIsLive() {
        const res = await fetch(Constants.baseURL + '/authed/me?token=' + this.props.token);
        const resJson = await res.json();
        const me = resJson.data.me;
        
        return me.liveGroup != null;
    }

    pickerChange(a, b) {
        this.setState({selected: a}, () => {
            if (a != "") {
                this.goLive();
            }
        });
    }

    onValueChange(value) {
        // once group is selected, hide picker
        //disable "Go Live" button
        //show "End Live" button
        //send req to go live
        alert(value)
        if (this.props.token != "" || this.props.token != null) {
            fetch(Constants.baseURL + '/authed/golive', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: this.props.token,
                    groupId: this.state.selected
                }),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    // console.log("golive(): ", responseJson);
                    this.setState({
                        selected: value,
                        showPicker: false,
                        showLiveButton: false,
                        showEndButton: true,
                        mygroups: this.state.mygroups
                    });

                }).catch((err) => {
                    // console.error("error", err);
                });

        } else {
            this.setState({
                selected: value,
                showPicker: false,
                showLiveButton: false,
                showEndButton: true,
                mygroups: this.state.mygroups
            });
        }
    }

    async fetchGroups() {
        if (!this.props.token) {
            return;
        }

        let url = Constants.baseURL + '/authed/mygroups?token=' + this.props.token;
        const res = await fetch(url);
        const resJson = await res.json();

        // HACK: the 'select a group' picker.item in render breaks the app on ios
        // this is a fucked up workaround
        // https://github.com/GeekyAnts/NativeBase/issues/983
        const groupsCopy = resJson.data.groups.slice();
        groupsCopy.unshift({_id: "none", name: "Select A Group"});
        this.setState({ mygroups: groupsCopy });

        return resJson.data.groups;
    }

    showHidePicker() {
        //get my groups
        if (this.props.token != "" || this.props.token != null) {
            let url = Constants.baseURL + '/authed/mygroups?token=' + this.props.token;
            fetch(url)
                .then((response) => response.json())
                .then((responseJson) => {

                    // console.log("mygroups(): ", responseJson.data);

                    //show picker form once "Go Live" button is pressed
                    this.setState({
                        selected: null,
                        showPicker: true,
                        showLiveButton: true,
                        showEndButton: false,
                        mygroups: responseJson.data.groups
                    });


                }).catch((err) => {
                    // console.error("error", err); 
                });
        } else {
            // console.log("Must be signed in to Go Live")
        }
    }
    endLive() {
        let url = Constants.baseURL + '/authed/endlive?token=' + this.props.token;
        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 'success') {
                    // console.log("endlive(): ", responseJson);

                    //once live has ended, reset values
                    // this.setState({
                    //     selected: null,
                    //     showPicker: false,
                    //     showLiveButton: true,
                    //     showEndButton: false,
                    //     mygroups: this.state.mygroups
                    // });
                    this.setState({
                        showPicker: true,
                        showLiveButton: true,
                        showEndButton: false
                    });
                }

            }).catch((err) => {
                // console.error("error", err); 
            });

    }

    async goLive() {
        console.log(this.state.selected);
        const res = await fetch(Constants.baseURL + '/authed/golive', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: this.props.token,
                groupId: this.state.selected
            }),
        });
        const resJson = await res.json();
        if (resJson.status === 'success') {
            this.setState({
                showLiveButton: false,
                showPicker: false,
                showEndButton: true,
                selected: ""
            });
        }
    }

    render() {
        return (
            <View style={{ position: "absolute", alignSelf: "center", top: "80%", width: "80%", textAlign:'center' }}>
                <TouchableOpacity style={{ paddingBottom: 12 }}>
                    {this.state.showPicker ?
                        (<Form style={{ backgroundColor: Constants.defaultColor, borderRadius: 10, height: 50, paddingTop: 3}}>
                            <Picker note
                                mode="dropdown"
                                placeholder="Go Live"
                                selectedValue={this.state.selected}
                                placeholderStyle={{color: 'white'}}
                                style={{justifyContent: 'center'}}
                                // onValueChange={this.onValueChange.bind(this)}
                                onValueChange={this.pickerChange.bind(this)}
                            >
                                {/* <Picker.Item label="Select A Group" value="" key="none" /> */}
                                {this.state.mygroups != null ? this.state.mygroups.map((group) => (
                                    <Picker.Item label={group.name} value={group._id} key={group._id} />
                                )) : null}
                            </Picker>
                        </Form>) : null}
                </TouchableOpacity>
                {/* {this.state.showLiveButton ?
                    (<Button full info
                        onPress={this.goLive.bind(this)}>
                        <Text>Go Live</Text>
                    </Button>) : null} */}

                {this.state.showEndButton ?
                    (<Button full danger
                        onPress={this.endLive.bind(this)} 
                        style={{borderRadius: 10}}>
                        <Text>End Live</Text>
                    </Button>) : null}


            </View>
        );
    }
}

export default connect(mapStateToProps)(Live);