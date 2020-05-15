import React, { Component } from 'react'
import { Text } from 'react-native';
import * as Constants from '../Constants'


/**************************************** PTK ****************************************/


/** 
 * ** CUSTOM TEXT COMPONENT FOR ACCIO **
 * Acceptable props
 * fontFamily - 'medium', 'semiBold', 'bold', 'regular'. Default is 'regular' if you don't provide any props
 * color - either 'accio' or any color you want to specify
 * size - number
 * font - default is 'Avenir Next' or define anything you want
 * textAlign - string
 * style - accepts a JSON format of stylings
 * 
 * 5 options for font "weight" but have to change them by calling different fonts:
 * Montserrat-Regular
 * Montserrat-SemiBold
 * Montserrat-Bold
 * Montserrat-Medium
 * 
*/

export default class AccioText extends Component {

    render() {
        const color = this.props.color === 'accio' ? Constants.defaultColor : this.props.color;
        const size = this.props.size;
        const styling = this.props.style;
        const align = this.props.textAlign;

        let fontFamily = 'Montserrat-Regular'
        if (this.props.fontFamily === 'regular') {
            fontFamily = 'Montserrat-Regular'
        } else if (this.props.fontFamily === 'medium') {
            fontFamily = 'Montserrat-Medium'
        } else if (this.props.fontFamily === 'semiBold') {
            fontFamily = 'Montserrat-SemiBold'
        } else if (this.props.fontFamily === 'bold') {
            fontFamily = 'Montserrat-Bold'
        }

        return (
            <Text style={{
                fontFamily: fontFamily,
                color: color,
                fontSize: size,
                textAlign: align,
                ...styling,
            }}>
                {this.props.children}
            </Text>
        );
    }
}


/**************************************** PTK ****************************************/
