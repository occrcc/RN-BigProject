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
    Dimensions
} from 'react-native'


import NavBar from '../../Componnet/NavBar'
import HTMLView from 'react-native-htmlview';
import storage from '../../RNAsyncStorage'
import ActionSheet from 'react-native-actionsheet'

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import Modal from 'react-native-modal'

import * as WeChat from 'react-native-wechat';
import * as QQ from 'react-native-qqsdk';

let {width, height} = Dimensions.get('window')

import {captureScreen, captureRef} from "react-native-view-shot";

const CANCEL_INDEX = 0
const OPTIONS = ['Cancel', '微信好友', '分享到QQ']

var ChuoServers = require('../../Chuo/Servers/ChuoServers')

var ServeApi = require('../ServeApi/ServeApi')


var RNFS = require('react-native-fs');

export default class BankCardTransfer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            token: '',
            sharImgUrl: '',
            sharTitle: '',
            sharContent: '',
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
        this.props.navigator.pop()
    }

    showActionSheet() {
        this.ActionSheet.show();
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
            imageUrl: "file://" + this.state.sharImgUrl
        };

        console.log("file://" +  this.state.sharImgUrl);

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
                                    // this.showAlertMessage("分享失败", false);
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


    getWebView() {
        let url = 'http://m.ejiarens.com/banban/transfer_account_notice_new?id=' + this.props.orderInfo.id
            + '&access_token=' + this.state.token;
        console.log(url);
        return (
            <WebView
                source={{uri: url}}
                automaticallyAdjustContentInsets={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                style={{marginBottom: (44 + global.params.iPhoneXHeight)}}
            >
            </WebView>
        )
    }

    snapshot = refname => () =>
        captureRef(this.refs[refname], {
            format: "jpg",
            quality: 0.8,
            result: "tmpfile",
        }).then(res => {
                console.log('imageUrl:' + res);
                this.setState({sharImgUrl: res}, () => {
                    this.sharBtn();
                })
            }
        ).catch(error => {
            console.log(error);
        });


    sharBtn() {
        if (this.state.token.length < 1) {
            this.showAlertMessage('登陆之后才能分享哦！', false);
            return;
        }
        this.showActionSheet();
    }

    render() {
        return (
            <View ref='full' style={{flex: 1, backgroundColor: "white"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                <NavBar
                    title='转账支付'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                    rightIcon="shareimg"
                    rightPress={this.snapshot('full')}
                />

                {this.getWebView()}

                <View style={styles.footerViewStyle}>
                    <TouchableOpacity activeOpacity={0.8} style={[styles.footerBtnStyle, {backgroundColor: 'white'}]}
                                      onPress={() => {
                                          this.props.navigator.pop();
                                      }}>
                        <Text style={styles.footerTextStyle}>其它支付方式</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.footerBtnStyle} onPress={() => {
                        this.setState({isModalVisible: true});

                        console.log(this.props.orderInfo);

                        let obj = {};
                        obj['order_sn'] = this.props.orderInfo.sn;
                        obj['access_token'] = this.state.token;

                        ServeApi.transferNotifyServe(obj).then(res=>{
                            console.log(res);
                        }).catch(error=>{

                        })
                    }}>
                        <Text style={[styles.footerTextStyle, {color: 'white'}]}>确定订单</Text>
                    </TouchableOpacity>
                </View>

                <MessageBarAlert ref="alert"/>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={OPTIONS}
                    cancelButtonIndex={CANCEL_INDEX}
                    onPress={this.handlePress.bind(this)}
                />

                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{flex: 1, width: width, height: height}}>
                        <View ref='detailView' style={styles.popViewStyle}>
                            <View style={styles.popTitleStyle}>
                                <Text style={{fontSize: 17, color: global.params.backgroundColor}}>注意</Text>
                            </View>
                            <View style={styles.popContentStyle}>
                                <Text numberOfLines={0} style={styles.popTextStyle}>
                                    1、请在24小时内完成转账/汇款,如因超出截止时间导致交易失败，我方不承担相应责任；
                                </Text>
                                <Text numberOfLines={0} style={styles.popTextStyle}>
                                    2、完成转账/汇款后，我们将于3个工作日内确认订单；
                                </Text>
                                <Text numberOfLines={0} style={styles.popTextStyle}>
                                    3、如果在操作过程中有任何疑问，欢迎致电客服（国内）021-61984772。{'\n'}
                                </Text>

                                <TouchableOpacity style={styles.popSureBtnStyle} onPress={() => {
                                    this.setState({isModalVisible: false}, () => {
                                        this.props.navigator.popToTop();
                                    })
                                }}>
                                    <Text style={{fontSize: 16, color: 'white'}}>确定</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    footerViewStyle: {
        position: 'absolute',
        bottom: 0,
        height: 44 + global.params.iPhoneXHeight,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: 'rgb(222,222,222)'
    },
    footerBtnStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
        flex: 3,
        backgroundColor: global.params.backgroundColor
    },
    footerTextStyle: {
        textAlign: 'center',
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold'
    },

    popViewStyle: {
        width: width - 40,
        backgroundColor: 'white',
        marginTop: height / 2 - 160,
        borderRadius: 4
    },
    popTextStyle: {
        letterSpacing: 1,
        lineHeight: 18,
        fontSize: 15,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 12,
        color: 'rgb(111,111,111)'
    },
    popTitleStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        borderBottomWidth: 0.5,
        borderBottomColor: global.params.backgroundColor
    },
    popContentStyle: {
        marginTop: 18,
        marginBottom: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    popSureBtnStyle: {
        backgroundColor: global.params.backgroundColor,
        height: 44,
        width: width - 60,
        marginBottom: 10,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
