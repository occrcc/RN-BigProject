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
//import HTMLView from 'react-native-htmlview';
import storage from '../../RNAsyncStorage'
import ActionSheet from 'react-native-actionsheet'

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import ServeOrderSubmit from '../ServeOrderSubmit'
//import MyInfo from '../../Mine/MineOtherPages/MyInfoVC'

import * as WeChat from 'react-native-wechat';
import * as QQ from 'react-native-qqsdk';
import Alert from 'rnkit-alert-view';

var ServeApi = require('../ServeApi/ServeApi')


const CANCEL_INDEX = 0
const OPTIONS = ['Cancel', '分享到朋友圈', '分享给好友', '分享到QQ', '分享到QQ空间'];


var shareData = {};

export default class ServeHtml extends Component {
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
        }
        // this.submitOrder = this.submitOrder.bind(this);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadUserFromCache();
            if (this.props.item.alertMessage && this.props.item.alertMessage.length > 0) {
                setTimeout(() => this.showAlertTips(), 1500);
            }
        });
        MessageBarManager.registerMessageBar(this.refs.alert);
    }

    componentWillUnmount() {
        shareData = {};
        MessageBarManager.unregisterMessageBar();
    }

    showAlertTips() {
        Alert.alert(
            '提示', this.props.item.alertMessage, [
                {text: '知道了'},
            ],
        );
    }


    handlerShareData(articleData) {
        shareData = {};
        shareData['type'] = 'news';
        shareData['title'] = articleData.title;
        shareData['description'] = articleData.desc;
        let size = 0;
        if (articleData.pic1 === '' || articleData.pic1.length === 0) {
            shareData['thumbImage'] = "";
        } else {
            let rootPath = Platform.OS === 'ios' ? fs.MainBundlePath : fs.DocumentDirectoryPath;
            let savePath = rootPath + '/' + this.uuid(20, 16) + ".png";
            try {
                const ret = fs.downloadFile({
                    fromUrl: articleData.pic1,
                    toFile: savePath,
                    begin: (res) => {
                        size = res.contentLength;
                    },
                });

                ret.promise.then(res => {
                    console.log('size:' + size);
                    if (size > 100000) {
                        shareData['thumbImage'] = "";
                    } else {
                        shareData['thumbImage'] = articleData.pic1;
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }
    }


    async loadUserFromCache() {
        let userInfo = await storage.load({
            key: 'userInfo'
        });

        if (userInfo) {
            this.setState({userInfo: userInfo});
            ServeApi.getServeHtmlData(this.props.item.param, userInfo.token).then(res => {
                console.log(res);
                this.setState({
                    sharImgUrl: res.thumb_pic,
                    sharTitle: res.title,
                    sharContent: res.desc,
                    title: res.title,
                    data: res,
                });
                this.handlerShareData(res);
            }).catch(err => {
                console.log('error    ' + err);
            })
        }
    }

    back() {
        this.props.navigator.pop()
    }

    showActionSheet() {
        console.log(this.state.sharImgUrl + this.state.sharTitle + this.state.sharContent)
        this.ActionSheet.show();
    }


    async handlePress(i) {

        let id = this.props.item.param ? this.props.item.param : this.props.item.url;

        let url = 'http://m.ejiarens.com/banban/serve_view/' + id
            + '?access_token=' + this.state.userInfo.token
            + '&self=1' + '&isappinstalled=1' + '&ognz_id=' + global.params.OgnzId;

        let data = shareData;
        console.log('handlePress:' + JSON.stringify(data))
        data['webpageUrl'] = url;

        console.log(i);
        if (i === 0) return;
        if (i === 1 || i === 2) {
            WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                    if (isInstalled) {
                        if (i === 1) {
                            WeChat.shareToTimeline(data).then((source) => {
                                console.log('分享到朋友圈:' + source);
                            });
                        } else if (i === 2) {
                            WeChat.shareToSession(data).then((source) => {
                                console.log('分享给微信好友:' + source);
                            });
                        }
                    } else {
                        MessageBarManager.showAlert({
                            alertType: 'error',
                            // title: "Error！", // Title of the alert
                            message: '没有安装微信软件，请您安装微信之后再试', // Message of the alert
                            titleStyle: {
                                color: 'white',
                                fontSize: 15,
                                fontWeight: 'bold',
                                marginTop: global.params.iPhoneXHeight + 9
                            },
                            messageStyle: {
                                color: 'white',
                                fontSize: 13,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
                            },
                        });
                    }
                });
        } else {

            QQ.isQQClientInstalled()
                .then(() => {
                    if (i === 3) {
                        QQ.shareNews(url, this.state.sharImgUrl, this.state.sharTitle, this.state.sharContent, QQ.shareScene.QQ)
                            .then((result) => {
                                console.log('result is', result)
                            })
                            .catch((error) => {
                                console.log('error is', error)
                            });
                    } else {
                        QQ.shareNews(url, this.state.sharImgUrl, this.state.sharTitle, this.state.sharContent, QQ.shareScene.QQZone)
                            .then((result) => {
                                console.log('result is', result)
                            })
                            .catch((error) => {
                                console.log('error is', error)
                            });
                    }
                }).catch((error) => {
                console.log('error   ' + error);
                MessageBarManager.showAlert({
                    alertType: 'error',
                    // title: "Error！", // Title of the alert
                    message: '没有安装QQ软件，请您安装后再试', // Message of the alert
                    titleStyle: {
                        color: 'white',
                        fontSize: 15,
                        fontWeight: 'bold',
                        marginTop: global.params.iPhoneXHeight + 9
                    },
                    messageStyle: {
                        color: 'white',
                        fontSize: 13,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
                    },
                })
            })
        }
    }

    getWebView() {
        let url = 'http://m.ejiarens.com/banban/serve_view/' + this.props.item.param
            + '?ognz_id=' + global.params.OgnzId;

        console.log(url);

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

    sharBtn() {
        if (!this.state.userInfo) {
            MessageBarManager.showAlert({
                alertType: 'error',
                message: '登陆之后才能分享哦！',
                messageStyle: {
                    color: 'white',
                    fontSize: 13,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
                },
            });
            return;
        }
        this.showActionSheet();
    }

    submitOrder(v) {
        if (!this.state.userInfo) {
            MessageBarManager.showAlert({
                alertType: 'error',
                message: '登陆之后才能下单哦！',
                messageStyle: {
                    color: 'white',
                    fontSize: 13,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
                },
            });
            return;
        }

        this.props.navigator.push({
            component: v,
            params: {
                order: this.state.data,
                userInfo: this.state.userInfo
            },
        })
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
                    title={this.state.title}
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                    rightIcon="shareimg"
                    rightPress={this.sharBtn.bind(this)}
                />
                {this.getWebView()}
                <View style={styles.bottomViewStyle}>
                    <View style={styles.priceViewStyle}>
                        <Text style={{
                            textAlign: 'right',
                            fontSize: 16,
                            color: global.params.backgroundColor
                        }}>价格:</Text>
                        <Text style={{
                            textAlign: 'left',
                            fontSize: 16,
                            color: '#fc0612',
                        }}>{this.state.data.price ? this.state.data.currency + this.state.data.price : '0.00'}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} style={styles.gopayStyle}
                                      onPress={this.submitOrder.bind(this, ServeOrderSubmit)}>
                        <Text style={{color: 'white', fontSize: 16}}>我要购买</Text>
                    </TouchableOpacity>
                </View>
                <MessageBarAlert ref="alert"/>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={OPTIONS}
                    cancelButtonIndex={CANCEL_INDEX}
                    onPress={this.handlePress.bind(this)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    webStyle: {
        marginBottom: 44 + global.params.iPhoneXHeight,
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