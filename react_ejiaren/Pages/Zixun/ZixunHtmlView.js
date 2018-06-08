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
    BackHandler,
    TouchableOpacity,
    Image
} from 'react-native'


import NavBar from '../Componnet/NavBar'
import HTMLView from 'react-native-htmlview';
import storage from '../RNAsyncStorage'
import ActionSheet from 'react-native-actionsheet'

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

import * as WeChat from 'react-native-wechat';
import * as QQ from 'react-native-qqsdk';
import fs from 'react-native-fs';

var ZixunServers = require('./ZixunServers/ZixunServers')
import _ from 'lodash'

let {width} = Dimensions.get('window')

const CANCEL_INDEX = 0
var shareData = {};

export default class EJRZixun extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '资讯',
            token: '',
            sharImgUrl: '',
            sharTitle: '',
            sharContent: '',
            shareOptions: ['取消', '分享到朋友圈', '分享给微信好友', '分享到QQ', '分享到QQ空间'],
            webId: '',
            footArr: [ '收藏', '分享'],
            footIconAry:['shoucang_nomal','shar_nomal'],
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadUserFromCache();
        });
        MessageBarManager.registerMessageBar(this.refs.alert);
        WeChat.registerApp(global.payParams.wx_appid);
    }

    componentWillMount() {
        let id = this.props.isHeader ? (this.props.sorce.param.length > 0 ? this.props.sorce.param : this.props.sorce.url) : this.props.sorce.id;
        this.setState({webId: id});
        this.getFootBtnStyle(id);
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
    }

    uuid(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [],
            i;
        radix = radix || chars.length;

        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
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
            ZixunServers.getZixunDetail(this.state.webId, userInfo.token).then(res => {
                console.log(res)
                this.setState({
                    token: userInfo.token,
                    sharImgUrl: res.pic1,
                    sharTitle: res.title,
                    sharContent: res.desc,
                    title: res.title,
                });
                this.handlerShareData(res);
            }).catch(err => {
                console.log('error  ' + err);
            })
        }
    }

    async getFootBtnStyle(webId) {
        let userInfo = await storage.load({
            key: 'userInfo'
        });
        if (userInfo) {
            ZixunServers.getZixunDetailInfo(webId, userInfo.token).then(res => {
                console.log(res)
                let footArr = this.state.footArr;
                // footArr[0] = res.isliked ? '已喜欢' : '喜欢';
                footArr[0] = res.isfavorite ? '取消收藏' : '收藏';
                let footIconAry = this.state.footIconAry;
                // footIconAry[0] = res.isliked ? 'like_highlig' : 'like_nomal';
                footIconAry[0] = res.isfavorite ? 'shoucang_highlig' : 'shoucang_nomal';
                this.setState({
                    footArr: footArr,
                    footIconAry:footIconAry
                });
            }).catch(err => {
                console.log('error  ' + err);
            })
        }
    }


    back() {
        this.props.navigator.pop()
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
        let url = 'http://m.ejiarens.com/banban/article_view/' + this.state.webId
            + '?access_token=' + this.state.token
            + '&self=1' + '&isappinstalled=1' + '&ognz_id=' + global.params.OgnzId;
        var data = _.cloneDeep(shareData);
        console.log(data)
        data['webpageUrl'] = url;
        console.log(data);
        if (i === 0) return;
        if (i === 1 || i === 2) {
            WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                    if (isInstalled) {
                        if (i === 1) {
                            WeChat.shareToTimeline(data).then((source) => {
                                console.log('分享到朋友圈:' + source);
                                this.showAlertMessage('分享成功', true);
                            });
                        } else if (i === 2) {
                            WeChat.shareToSession(data).then((source) => {
                                console.log('分享给好友:' + source);
                                this.showAlertMessage('分享成功', true);
                            });
                        }
                    } else {
                        this.showAlertMessage('没有安装微信软件，请您安装微信之后再试');
                    }
                });
        } else {
            QQ.isQQClientInstalled()
                .then(() => {
                    if (i === 3) {
                        QQ.shareNews(url, this.state.sharImgUrl, this.state.sharTitle, this.state.sharContent, QQ.shareScene.QQ)
                            .then((result) => {
                                this.showAlertMessage('分享成功', true);
                            })
                            .catch((error) => {
                                // this.showAlertMessage('分享失败', false);
                            });
                    } else {
                        QQ.shareNews(url, this.state.sharImgUrl, this.state.sharTitle, this.state.sharContent, QQ.shareScene.QQZone)
                            .then((result) => {
                                this.showAlertMessage('分享成功', true);
                            })
                            .catch((error) => {
                                // this.showAlertMessage('分享失败', false);
                            });
                    }
                }).catch((error) => {
                console.log('error   ' + error);
                this.showAlertMessage('没有安装QQ软件，请您安装后再试',false);
            })
        }

    }

    getWebView() {
        let url = 'http://m.ejiarens.com/banban/article_view/' + this.state.webId
            + '?access_token=' + this.state.token
            + '&self=0';
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

    touchFooterBtn(item) {
        if (item === '分享') {
            if (this.state.token.length < 1) {
                this.showAlertMessage('登陆之后才能操作哦');
                return;
            }
            this.showActionSheet();
            return;
        }
        if (this.state.token.length < 1) {
            this.showAlertMessage('登陆之后才能操作哦');
            return;
        }
        let method = null;
        if (item === '喜欢' || item === '已喜欢') {
            method = 'like';
        } else if (item === '收藏') {
            method = 'fav';
        } else if (item === '取消收藏') {
            method = 'unfav';
        }
        ZixunServers.zixunLikeOrFav(this.state.webId, method, this.state.token).then(res => {
            console.log(res)
            this.showAlertMessage('操作成功',true);
            this.getFootBtnStyle(this.state.webId);
        }).catch(err => {
            console.log('error  ' + err);
            this.showAlertMessage(err);
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
                />
                {this.getWebView()}
                <View style={{
                    flexDirection: 'row', position: 'absolute',
                    bottom: 0, width: width,
                    height: 40 + global.params.iPhoneXHeight,
                    backgroundColor: global.params.backgroundColor,
                }}>
                    {this.state.footArr.map((item, i) => {
                        return (
                            <TouchableOpacity activeOpacity={0.9} key={i} style={{
                                justifyContent: 'center',
                                alignItems:'center',
                                flexDirection: 'row',
                                width: width / 2 + 2,
                                height: 40
                            }}
                                              onPress={this.touchFooterBtn.bind(this, item)}
                            >
                                <View style={{flexDirection:'row',height:40,alignItems:'center'}}>
                                    <Image source={{uri:this.state.footIconAry[i]}} style={{width:18,height:18}}/>
                                    <Text style={{marginLeft:8,fontSize: 13, color: 'white'}}>{item}</Text>
                                </View>
                                <View style={{
                                    backgroundColor: 'white',
                                    position: 'absolute',
                                    right: 1,
                                    width: 1,
                                    height: 24
                                }}/>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <MessageBarAlert ref="alert"/>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={this.state.shareOptions}
                    cancelButtonIndex={CANCEL_INDEX}
                    // destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={this.handlePress.bind(this)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({});
