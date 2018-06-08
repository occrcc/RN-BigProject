/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';


export default class App extends Component<{}> {
    render() {
        return (
            <View style={{
                backgroundColor: Platform.OS === "ios" ? "white" : "#0398ff", flex: 1, justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={styles.welcome}>
                    Welcome to React Native ROOT 66666!
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
