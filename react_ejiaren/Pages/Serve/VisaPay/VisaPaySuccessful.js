import React, {Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    WebView,
    Alert,
    Platform,
    InteractionManager,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Linking
} from 'react-native'


import NavBar from '../../Componnet/NavBar'
import storage from '../../RNAsyncStorage'
import ActionSheet from 'react-native-actionsheet'

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

import * as WeChat from 'react-native-wechat';
import * as QQ from 'react-native-qqsdk';

let {width, height} = Dimensions.get('window')

import {captureScreen, captureRef} from "react-native-view-shot";

const CANCEL_INDEX = 0
const OPTIONS = ['取消', '微信好友', '分享到QQ']

var ChuoServers = require('../../Chuo/Servers/ChuoServers')
var RNFS = require('react-native-fs');

export default class VisaPaySuccessful extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            token: '',
            sharImgUrl: '',
            sharTitle: ' ',
            sharContent: ' ',
            isModalVisible: false,
        }
    }

    componentWillMount() {
        this.getUserInfo();
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
    }

    async getUserInfo() {
        let userInfo = await storage.load({
            key: 'userInfo'
        });
        if (userInfo) {
            this.setState({
                token: userInfo.token,
            });
        }
    }

    back() {

        this.props.navigator.popToTop();

    }

    showActionSheet() {
        this.ActionSheet.show();
    }

    keFu() {
        let url = 'tel: ' + global.kefuInfo.kefuPhone;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }


    showAlertMessage(message, success) {
        MessageBarManager.showAlert({
            alertType: success ? 'success' : 'error',
            message: message,
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
        let data = {
            type: 'imageFile',
            title: ' ',
            description: ' ',
            imageUrl: this.state.sharImgUrl
        };

        if (i === 0) return;
        if (i === 1) {
            WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                    if (isInstalled) {
                        WeChat.shareToSession(data).then((source) => {
                            console.log('分享给好友:' + source);
                            this.showAlertMessage('分享成功', true);
                        });
                    } else {
                        this.showAlertMessage('没有安装微信软件，请您安装微信之后再试', false);
                    }
                });
        } else {

            RNFS.readFile(this.state.sharImgUrl,'base64').then(data=>{
                console.log(data);
                ChuoServers.getImgType(data).then(res=>{
                    console.log(res);
                    QQ.isQQClientInstalled()
                        .then(() => {
                            QQ.shareImage(res.t.url, ' ', ' ', QQ.shareScene.QQ)
                                .then((result) => {
                                    console.log('result is', result)
                                    this.showAlertMessage('分享成功', true);
                                })
                                .catch((error) => {
                                    console.log('error is', error)
                                    this.showAlertMessage(error, false);
                                });
                        }).catch((error) => {
                        console.log('error   ' + error);
                        this.showAlertMessage('没有安装QQ软件，请您安装后再试', false);
                    })
                })
            }).catch(error=>{
                console.log(error);
            })
        }
    }

    snapshot = refname => () =>
        captureRef(this.refs[refname], {
            format: "jpg",
            quality: 0.8,
            result: "tmpfile",
        }).then(res => {
                console.log(res);
                this.setState({sharImgUrl: res}, () => {
                    this.sharBtn();
                })
            }
        ).catch(error => {
            console.log(error);
        });

    sharBtn() {
        if (this.state.token.length < 1) {
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

    render() {
        return (
            <View ref='full' style={{flex: 1, backgroundColor: "#f5f5f5"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                <NavBar
                    title={this.state.title}
                    leftTitle={'关闭'}
                    // leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                    rightIcon="shareimg"
                    rightPress={this.snapshot("full")}
                />

                <ScrollView>
                    <View style={styles.viewStyle}>
                        <Text style={[styles.mainTitleStyle,{marginTop:18}]}>服务名称：{this.props.orderInfo.serveName}</Text>
                        <Text style={styles.mainTitleStyle}>订单号：{this.props.orderInfo.sn}</Text>
                        <Text style={styles.mainTitleStyle}>订单状态：已付款</Text>
                        <Text style={styles.mainTitleStyle}>订单总额：{this.props.orderInfo.price}元</Text>
                        <Text style={[styles.mainTitleStyle,{marginBottom:18}]}>下单日期：{this.props.orderInfo.createtime}</Text>
                    </View>

                    <View style={[styles.viewStyle,{justifyContent:'center',alignItems:'center'}]}>
                        <Image source={{uri:'select_up'}} style={{marginTop:20,width:36,height:36}}/>
                        <Text style={[{color:'#4a4a4a',textAlign:'center',marginTop:14}]}>您的订单已经支付成功</Text>
                        <View style={{marginTop:20,marginBottom:20,width:300,height:1,backgroundColor:'rgb(244,244,244)'}}/>
                    </View>

                    <View style={styles.viewStyle}>
                        <Text style={[styles.mainTitleStyle,{color:'#727272',marginTop:18,fontSize:13}]}>请将订单详情提交你的留学办理老师进行付费操作</Text>
                        <TouchableOpacity activeOpacity={1} style={styles.phoneBtnStyle} >
                            <Text style={{color:'white',fontSize:15,marginLeft:8,}}>点击右上角  <Image source={{uri:'shareimg'}} style={{marginTop:4,width:16,height:16}}/>  分享保存订单</Text>
                        </TouchableOpacity>
                        <Text style={[styles.mainTitleStyle,{color:'#727272',marginTop:18,fontSize:13}]}>或直接联系客服，提交校方缴费信息进行付费操作</Text>
                        <TouchableOpacity activeOpacity={0.8} style={styles.phoneBtnStyle} onPress={this.keFu.bind(this)}>
                            <Image source={{uri:'icon_kefuphone'}} style={{width:16,height:18}}/>
                            <Text style={{color:'white',fontSize:15,marginLeft:8}}>{global.kefuInfo.kefuPhone}</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>

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
    mainTitleStyle:{
        color:'#2a2a2a',
        fontSize:15,
        marginTop:15,
        marginLeft:14,
    },
    viewStyle:{
        backgroundColor:'white',
        borderRadius:6,
        margin:15,

    },
    phoneBtnStyle:{
        marginTop:10,
        marginLeft:15,
        marginRight:15,
        marginBottom:23,
        borderRadius:4,
        height:44,
        backgroundColor:global.params.backgroundColor,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    }
});
