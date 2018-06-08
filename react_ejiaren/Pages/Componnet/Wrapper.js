/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */
'use strict';

import React, {Component} from 'react'
import {Navigator, View} from 'react-native'
import Main from '../Main/Main'
import NewFeature from './NewFeature'


export default class Wrapper extends Component {
    constructor(props) {
        super(props)

    }

    render() {
        if (this.props.isNewFeature) {
            return (
                <View style={{flex: 1, justifyContent: 'flex-start'}}>
                    <NewFeature navigator={this.props.navigator}/>
                </View>
            )
        } else {
            return (
                <View style={{flex: 1, justifyContent: 'flex-start'}}>
                    <Main navigator={this.props.navigator}/>
                </View>
            )
        }
    }
}
