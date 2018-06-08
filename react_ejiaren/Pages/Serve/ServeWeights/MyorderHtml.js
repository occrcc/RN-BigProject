import React, {Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    StatusBar,
    WebView,
    Alert,
    Platform,
    InteractionManager,
    BackHandler
} from 'react-native'


import NavBar from '../../Componnet/NavBar'
import storage from '../../RNAsyncStorage'



export default class MyorderHtml extends Component {
    constructor(props) {
        super(props)

    }
    back() {
        this.props.navigator.pop()
    }

    getWebView() {
        let url = 'http://m.ejiarens.com/banban/order_view/' + this.props.orderInfo.id
            + '?access_token=' + this.props.userInfo.token
            + '&self=1';

        console.log('orderHtmlUrl: ',url);

        return (
            <WebView
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
                    title='订单详情'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                {this.getWebView()}
            </View>
        )
    }
}

const styles = StyleSheet.create({

});
