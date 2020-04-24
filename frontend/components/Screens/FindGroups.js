import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Container, View } from 'native-base';
import Hamburger from '../Hamburger';


export class GroupDetailsScreen extends Component {
    render() {
      const {navigation} = this.props;
      return (
        <Container>
        <View style={styles.container}>
          <Image 
             style={styles.pic} 
             source={require('../../assets/images/A.png')} 
           />
          <AccioText style={styles.instructions}>
            Group A  
          </AccioText>
          <AccioText style={styles.description}>
            We all love minions! If you do too, please join us.
          </AccioText>
        </View>
        <View>
          <TouchableOpacity onPress={() => alert('In dev...')}>
            <AccioText style={styles.button}>Join</AccioText>
          </TouchableOpacity>
        </View>
        </Container>
      );
    }
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    logo: {
        width: 150,
        height: 150,
        margin: 10,
        marginBottom: 10,
        alignContent: 'flex-start',
      },
    name: {
        color: '#d2691e',
        textAlign: 'center',
        fontSize: 16,
        marginHorizontal: 15,
        marginBottom: 30,
      },
    pic: {
      height: 320,
      width: 320,
      marginBottom: 10,
      alignItems: 'center', 
      },
    instructions: {
        color: '#d2691e',
        textAlign: 'center',
        fontSize: 26,
        margin: 15,
        marginBottom: 20,
      },
    description: {
        color: '#999',
        textAlign: 'center',
        fontSize: 16,
        margin: 10,
        marginBottom: 10,
      },
    button: {
        color: '#6495ed',
        textAlign: 'center',
        fontSize: 40,
        marginHorizontal: 15,
        marginBottom: 50,
      },
  });

