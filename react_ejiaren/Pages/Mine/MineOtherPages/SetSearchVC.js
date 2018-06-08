/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */

'use strict';

import React, { Component } from 'react'
import {
    View,
} from 'react-native'

import NavBar from '../../Componnet/NavBar'

export default class SetSearchVC extends Component {
    constructor(props){
        super(props)
    }

    back(){
        this.props.navigator.pop()
    }
    render(){
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <NavBar
                    title="设置搜索条件"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
            </View>
        )
    }
}

