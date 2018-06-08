import React, {Component} from 'react'
import {
    Text,
    View,
    StatusBar,
    WebView,
    Platform,
    InteractionManager,
    StyleSheet,
    TouchableOpacity
} from 'react-native'


import NavBar from '../../Componnet/NavBar'
import storage from '../../RNAsyncStorage'
import  WebViewAndroid from 'react-native-webview-android'

export default class ServeXCJieji extends Component {
    constructor(props) {
        super(props)
        this.state = {
            navTitle: "",
            scalesPageToFit: true
        }

    }

    back() {
        this.props.navigator.pop()
    }

    //获取页面title，URL，loading, canGoBack, canGoForward
    _onNavigationStateChange(navState) {
        console.log(navState.title);
        let title = Math.abs(navState.title.indexOf('http')) ? navState.title : '';
        this.setState({
            navTitle: title,
            scalesPageToFit: true
        });
    }

    javascriptToInject(){
        return `
        $(document).ready(function() {
          $('a').click(function(event) {
            if ($(this).attr('href')) {
              var href = $(this).attr('href');
              window.webView.postMessage('Link tapped: ' + href);
            }
          })
        })
      `
    }

    onMessage(){
    }

    getWebView() {
        let url = ''
        if (this.props.webUrl) {
            url = this.props.webUrl;
        } else {
            url = 'https://m.ctrip.com/html5/Flight/?allianceid=684791&sid=1218494&sourceid=2055&popup=close&autoawaken=close&ouid='
                + this.props.userInfo.user.id;
        }
        console.log(url);
        if (Platform.OS === 'ios') {
            return (
                <WebView
                    source={{uri: url}}
                    startInLoadingState={true}
                    domStorageEnabled={true}
                    javaScriptEnabled={true}
                    scalesPageToFit={true}
                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                >
                </WebView>
            )
        }else  {
            return (
                <WebViewAndroid
                    style={{flex:1}}
                    source={{uri: url}}
                    javaScriptEnabled={true}
                    geolocationEnabled={true}
                    builtInZoomControls={true}
                    domStorageEnabled={true}
                    // injectedJavaScript={this.javascriptToInject()}
                    onMessage={this.onMessage}
                    onNavigationStateChange={this._onNavigationStateChange.bind(this)} />
            )
        }
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
                    title={this.state.navTitle}
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                {this.getWebView()}
            </View>
        )
    }
}

const styles = StyleSheet.create({});