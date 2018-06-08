import React, {Component} from 'react'
import {
    View,
    StatusBar,
    WebView,
    StyleSheet,
} from 'react-native'


import NavBar from '../../Componnet/NavBar'

export default class VisaHtml extends Component {
    constructor(props) {
        super(props)
    }


    back() {
        this.props.navigator.pop()
    }

    getWebView() {
        let url = 'http://m.ejiarens.com/banban/visa_help';
        return (
            <WebView
                style={styles.webStyle}
                source={{uri: url}}
                startInLoadingState={true}
                domStorageEnabled={true}
                javaScriptEnabled={true}
            >
            </WebView>
        )
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                <NavBar
                    title='使用须知'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                {this.getWebView()}


            </View>
        )
    }
}

const styles = StyleSheet.create({
    webStyle: {
        // marginBottom: 44 + global.params.iPhoneXHeight,
    },
    bottomViewStyle: {
        position: 'absolute',
        flexDirection: 'row',
        left: 0,
        right: 0,
        bottom: global.params.iPhoneXHeight,
        height: 50,
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5'
    },

    gopayStyle: {
        flex: 2,
        marginTop: 0,
        marginBottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: global.params.backgroundColor,
    },

    priceViewStyle: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 2
    }
});