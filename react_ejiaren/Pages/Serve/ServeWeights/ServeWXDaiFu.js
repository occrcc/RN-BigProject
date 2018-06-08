

'use strict';

import React, { Component } from 'react'
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    InteractionManager,
    Platform,
    DeviceEventEmitter,
    Alert
} from 'react-native'

import NavBar from '../../Componnet/NavBar'
import * as WeChat from 'react-native-wechat';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import Myorder from '../ServeWeights/MyOrderList'
import storage from '../../RNAsyncStorage'
import fs from 'react-native-fs';
import _ from 'lodash'

var shareData = {};
export default class ServeWXDaiFu extends Component {
    constructor(props){
        super(props)
        this.state = {
            btnTitle : '发送代付请求',
            userInfo:null,
        }
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.getUserInfo();
            this.handlerShareData();
        });
        MessageBarManager.registerMessageBar(this.refs.alert);
        WeChat.registerApp(global.payParams.wx_appid);
    }


    getUserInfo(){
        storage.load({
            key: 'userInfo',
            autoSync: true
        }).then(res=>{
            console.log('当前用户：'+JSON.stringify(res));
            this.setState({userInfo:res});
        }).catch(err=>{
        })
    }

    componentWillMount() {
        MessageBarManager.unregisterMessageBar();
    }

    componentWillUnmount() {
        shareData = {};
    }

    back(){
        DeviceEventEmitter.emit('friendDaiFu');
        this.props.navigator.pop();
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
                    uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    }


    handlerShareData() {
        shareData['type'] = 'news';
        shareData['title'] = '帮我付款才是真友谊';
        shareData['description'] = this.props.orderInfo.serveName;
        let size = 0;
        let pic1 = this.props.orderInfo.memo.serve_pic;
        if (pic1 === '' || pic1.length === 0) {
            shareData['thumbImage'] = "";
        } else {
            let rootPath = Platform.OS === 'ios' ? fs.MainBundlePath : fs.DocumentDirectoryPath;
            let savePath = rootPath + '/' + this.uuid(20, 16) + ".png";
            try {
                const ret = fs.downloadFile({
                    fromUrl: pic1,
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
                        shareData['thumbImage'] = pic1;
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }
    }

    daifu(){

        let sharUrl = 'http://m.ejiarens.com/banban/wxfriendpay?sn=' +
            this.props.orderInfo.sn + '&ognz_id=' +
            global.params.OgnzId;
        var data = _.cloneDeep(shareData);
        data['webpageUrl'] = sharUrl;
        console.log(data);

        WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    WeChat.shareToSession(data).then((source) => {
                        console.log('分享给好友:' + source);
                        this.showAlertMessage('分享成功', true);
                    });
                } else {
                    this.showAlertMessage('没有安装微信软件，请您安装微信之后再试');
                }
            });
    }

    showMyOrder(){
        this.props.navigator.push({
            component: Myorder,
            params: {userInfo:this.state.userInfo},
        })
    }

    render(){
        return (
            <View style={{flex: 1, backgroundColor: "#f5f5f5",}}>
                <NavBar
                    title="好友代付"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                    rightTitle='查看订单'
                    rightPress={this.showMyOrder.bind(this)}
                />
                <View style={{alignItems:'center',backgroundColor:'white'}}>
                    <Image source={{uri:'icon_daifu'}} style={{width:60,height:60,marginTop:40,marginBottom:40}}/>
                    <Text allowFontScaling={false} style={{fontSize:31,color:'#2a2a2a',marginBottom:32}}>￥{this.props.orderInfo.wx_price}</Text>
                    <Text allowFontScaling={false}  numberOfLines={2} style={{
                        fontSize:16,
                        color:'#727272',
                        marginBottom:32,
                        marginLeft:50,
                        marginRight:50,
                        lineHeight:24,
                        textAlign:'center',
                    }}>通过微信将代付请求发给好友，即可让对方帮你买单。</Text>
                </View>
                <View >
                    <TouchableOpacity activeOpacity={0.8} style={styles.payBtnStyle} onPress={this.daifu.bind(this)}>
                        <Text allowFontScaling={false} style={{fontSize: 16, color: '#ffffff'}}>{this.state.btnTitle}</Text>
                    </TouchableOpacity>
                    <Text allowFontScaling={false} style={{marginRight:14,marginLeft:14,color: '#b2b2b2', fontSize: 13, letterSpacing: 1, lineHeight: 18}}>
                        说明:{'\n'}
                        <Text allowFontScaling={false} style={{marginTop:5,fontSize: 13,color: '#b2b2b2'}}>
                            • 对方需开通微信支付才能帮你付款，如未开通，请重新选择其它好友发送;{'\n'}
                            • 如该订单未来涉及到退款，钱款将退还到好友的微信账户中。{'\n'}
                            </Text>
                    </Text>
                </View>
                <MessageBarAlert ref="alert"/>
            </View>
        )
    }
}

var styles = StyleSheet.create({

    payBtnStyle: {
        backgroundColor: global.params.backgroundColor,
        borderRadius: 4,
        margin:15,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    }
});