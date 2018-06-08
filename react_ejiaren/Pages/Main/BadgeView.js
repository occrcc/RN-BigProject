/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text

} from 'react-native';

export default class BadgeView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
    }

    render() {
        return (
            <View style={{width:60,height:60,backgroundColor:'red',borderRadius:30,marginBottom:15}}>
                <Text>11</Text>
            </View>
        )
    }
}



