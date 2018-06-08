import React, {Component} from 'react'
import {
    Text,
    View,
    StatusBar,
    WebView,
    Platform,
    InteractionManager,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native'


import NavBar from '../../Componnet/NavBar'
import ActionSheet from 'react-native-actionsheet'
import * as WeChat from 'react-native-wechat';
import * as QQ from 'react-native-qqsdk';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

import  WebViewAndroid from 'react-native-webview-android'

var shareData = {}
var shareOptions = ['取消', '分享到朋友圈', '分享给微信好友', '分享到QQ', '分享到QQ空间']
export default class HomeHtml extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            token: '',
            sharImgUrl: '',
            sharTitle: '',
            sharContent: '',
            userInfo: null,
            data: {},
            sharImageName:''
        }
    }

    back() {
        this.props.navigator.pop()
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        WeChat.registerApp(global.payParams.wx_appid);
    }

    componentWillUnmount() {
        // shareData = {}
        MessageBarManager.unregisterMessageBar();
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
        let url = 'http://m.ejiarens.com/app/testMBTI.html?access_token=' + this.props.userInfo.token;
        if (this.props.item) {
            let item = this.props.item;
            url = 'http://m.ejiarens.com/app/activity' + item.templateId + '.html?ognzId=' + item.ognzId + '&templateId=' +
                item.templateId + '&access_token=' + this.props.userInfo.token;
        }
        console.log(url);
        if (Platform.OS === 'ios') {
            return (
                <WebView
                    style={{width:'100%',height:'100%'}}
                    source={{uri: url}}
                    startInLoadingState={true}
                    domStorageEnabled={true}
                    javaScriptEnabled={true}
                    scalesPageToFit={true}
                    automaticallyAdjustContentInsets={true}
                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                >
                </WebView>
            )
        }else {
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

    //获取页面title，URL，loading, canGoBack, canGoForward
    _onNavigationStateChange(navState) {

        shareData = {};

        console.log(navState);
        let webUrl = navState.url;
        if(webUrl.indexOf("share=1") >= 0 ){
            console.log('我是可以分享的');
            this.setState({sharImageName:'shareimg'})
        }
        let title =  navState.title ? navState.title : '';
        let imgUrl = title === '推荐有礼' ? 'http://pic.ejiarens.com/activity/weixintupian1.png' : 'http://pic.ejiarens.com/activity/weixintupian2.png';
        let contentText = title === '推荐有礼' ? '推荐有礼：呼朋唤友，奖励到手' : '晒offer赢惊喜：向朋友分享喜悦，和朋友一起拿礼品';
        let webpageUrl = webUrl.replace('share=1','share=0');
        shareData['type'] = 'news';
        shareData['title'] = title;
        shareData['description'] = contentText;
        shareData['thumbImage'] = imgUrl;
        shareData['webpageUrl'] = webpageUrl;
    }

    sharBtn() {
        this.showActionSheet();
    }

    showActionSheet() {
        this.ActionSheet.show();
    }

    showAlertMessage(message,success) {
        MessageBarManager.showAlert({
            alertType: success ? 'success' : 'error',
            message: message, // Message of the alert
            messageStyle: {
                color: 'white',
                fontSize: 13,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
            },
        });
    }

    async handlePress(i) {
        console.log(shareData);

        if (i === 0) return;
        if (i === 1 || i === 2) {
            WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                    if (isInstalled) {
                        if (i === 1) {
                            WeChat.shareToTimeline(shareData).then((source) => {
                                console.log('分享到朋友圈:' + source);
                                this.showAlertMessage('分享成功', true);
                            });
                        } else if (i === 2) {
                            WeChat.shareToSession(shareData).then((source) => {
                                console.log('分享给好友:' + source);
                                this.showAlertMessage('分享成功', true);
                            });
                        }
                    } else {
                        this.showAlertMessage('没有安装微信软件，请您安装微信之后再试');
                    }
                });
        } else {
            console.log(shareData);
            QQ.isQQClientInstalled()
                .then(() => {
                    if (i === 3) {
                        QQ.shareNews(shareData['webpageUrl'], shareData['thumbImage'], shareData['title'], shareData['description'], QQ.shareScene.QQ)
                            .then((result) => {
                                this.showAlertMessage('分享成功', true);
                            })
                            .catch((error) => {
                                console.log('error   ' + error);
                                // Alert.alert(JSON.stringify(error));
                                // this.showAlertMessage(error, false);
                            });
                    } else {
                        QQ.shareNews(shareData['webpageUrl'], shareData['thumbImage'], shareData['title'], shareData['description'], QQ.shareScene.QQZone)
                            .then((result) => {
                                this.showAlertMessage('分享成功', true);
                            })
                            .catch((error) => {
                                console.log('error   ' + error);
                                // this.showAlertMessage(error, false);
                            });
                    }
                }).catch((error) => {
                console.log('error   ' + error);
                this.showAlertMessage('没有安装QQ软件，请您安装后再试');
            })
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
                    title={this.props.title}
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                    rightIcon={this.state.sharImageName}
                    rightPress={this.sharBtn.bind(this)}
                />
                {this.getWebView()}
                <MessageBarAlert ref="alert"/>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={shareOptions}
                    cancelButtonIndex={0}
                    onPress={this.handlePress.bind(this)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    webStyle: {

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