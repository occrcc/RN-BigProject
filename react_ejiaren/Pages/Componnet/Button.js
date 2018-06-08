/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */
'use strict';

import React, { Component } from 'react'
import {
    View,
    Platform,
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback
} from 'react-native'

export default class Button extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return Platform.OS === 'ios'?(
            <TouchableOpacity {...this.props}>{this.props.children}</TouchableOpacity>
        ):(
            <View {...this.props}><TouchableNativeFeedback onPress={this.props.onPress}>{this.props.children}</TouchableNativeFeedback></View>
        )
    }
}