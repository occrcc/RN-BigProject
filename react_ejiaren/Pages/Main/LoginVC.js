/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */


'use strict';

import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Image,
    Dimensions,
    KeyboardAvoidingView,
    ScrollView,
    DeviceEventEmitter,
    StatusBar,
    Platform,
    TouchableOpacity,
    Text,
    Keyboard,
    TextInput
} from 'react-native'
import Button from '../Componnet/Button'

import px2dp from '../../Util'
import storage from "../RNAsyncStorage";

let {width, height} = Dimensions.get('window')
var loginPage = require('../Service/getData')
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import ForgetPwd from './ForgetPassword'
import RegisGetMesCode from './RegisteredGetMesCode'



export default class LoginVC extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phonePlaceholder: '手机号',
            phoneNumber: '',
            pwaPlaceholder: '密码',
            pwaNumber: '',
        };
    }


    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        this.changePwdSuccess = DeviceEventEmitter.addListener('changePwdSuccess', () => {
            MessageBarManager.registerMessageBar(this.refs.alert);
            this.showAlertMessage('密码修改成功', true);
        });
    };

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

    componentWillUnmount() {
        this.changePwdSuccess.remove();
        MessageBarManager.unregisterMessageBar();
    };

    back() {
        this.props.navigator.pop();
    }

    login() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        let username = this.state.phoneNumber.trim(), pwaNumber = this.state.pwaNumber.trim();
        if (username.length < 1 || pwaNumber.length < 1) {
            this.showAlertMessage('用户名或密码不能为空');
            return;
        }
        loginPage.doLogin(username, pwaNumber).then((res => {
            storage.save({
                key: 'userInfo',
                data: res,
            });
            DeviceEventEmitter.emit('ChuoUpLoadList');
            DeviceEventEmitter.emit('uploadServeUserInfo');
            DeviceEventEmitter.emit('changeUser', {userInfo: res, isLoad: true});
            DeviceEventEmitter.emit('updataPushToken', res);
            DeviceEventEmitter.emit('changePasswordPopToPop');
            DeviceEventEmitter.emit('refreshBadge');

            this.props.navigator.pop();
        })).catch((err => {
            this.showAlertMessage(err);
        }))
    }

    closeBtn() {
        if (!this.props.hideBackImage) {
            return (
                <Button style={styles.buttonStyle} key={0} onPress={this.back.bind(this)}>
                    <Image source={{uri: 'close'}}
                           style={styles.backBtnStyle}/>
                </Button>
            )
        }
    }

    _onStartShouldSetResponderCapture (event) {
        Keyboard.dismiss();
    }

    render() {

        let baseurl = 'baseimage_' + global.params.OgnzId;

        console.log('baseurl : ' + baseurl);

        return (
            <View style={styles.container}  onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}>
                <View>
                    <StatusBar barStyle="light-content"/>
                </View>
                <Image source={{uri: baseurl}} style={styles.backgroundImage}/>
                {this.closeBtn()}
                <View style={styles.cellStyle}>
                    <View style={styles.textInput}>
                        <Image source={{uri: 'phone'}}
                               style={{resizeMode: 'stretch', width: 20, height: 22, marginLeft: 22}}/>
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid='transparent'
                            placeholder={this.state.phonePlaceholder}
                            keyboardType='numeric'
                            onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                            value={this.state.phoneNumber}
                        />
                    </View>
                    <View style={styles.textInput}>
                        <Image source={{uri: 'pwd'}}
                               style={{resizeMode: 'stretch', width: 20, height: 22, marginLeft: 22}}/>
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid='transparent'
                            placeholder={this.state.pwaPlaceholder}
                            onChangeText={(pwaNumber) => this.setState({pwaNumber})}
                            value={this.state.pwaNumber}
                            secureTextEntry={true}
                        />
                    </View>

                    <TouchableOpacity activeOpacity={0.9} style={styles.forgetPasswordStyle} onPress={() => {
                        this.props.navigator.push({
                            component: ForgetPwd,
                        })
                    }}>
                        <Text style={{
                            backgroundColor: 'rgba(255,255,255,0)',
                            color: "#ffffff",
                            fontSize: px2dp(12)
                        }}>{"忘记密码"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.9} style={{top: 20, width: width - 40, height: 45}}
                                      onPress={this.login.bind(this)}
                    >
                        <View style={{
                            borderRadius: 6,
                            height: px2dp(45),
                            flexDirection: "row",
                            backgroundColor: "rgba(216, 60, 48, 1)",
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Text style={{color: "#ffffff", fontSize: px2dp(15)}}>{"登录"}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.9} style={{
                        position: "absolute",
                        bottom: Platform.OS === 'ios' ? global.params.iPhoneXHeight : 23,
                        left: 20,
                        right: 20,
                        height: 46
                    }} onPress={() => {
                        this.props.navigator.push({
                            component: RegisGetMesCode,
                            // component:RegisDone
                        })
                    }}>
                        <View>
                            <View style={{height: px2dp(0.5), backgroundColor: "#ffffff",}}>
                            </View>
                            <Text style={{
                                color: "#ffffff",
                                fontSize: px2dp(14),
                                height: px2dp(45),
                                textAlign: 'center',
                                marginTop: 13,
                                backgroundColor: 'rgba(255,255,255,0)',
                            }}> {"我要注册"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <MessageBarAlert ref="alert"/>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    buttonStyle: {
        width: 44,
        height: 44,
        marginTop: 44,
        marginLeft: width - 64,
        borderRadius: 22,
        position: 'absolute'
    },

    backBtnStyle: {
        width: 34,
        height: 34,
        opacity: 0.5,
        position: 'absolute'

    },

    contentScrollViewStyle: {
        marginTop: height * 0.3,
        marginBottom: 20,
        // 设置主轴的方向
        flexDirection: 'row',
        // 多个cell在同一行显示
        flexWrap: 'wrap',
        width: width,
        position: 'absolute',
        height: height - height * 0.3,
    },

    backgroundImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: null,
        height: null,
        //不加这句，就是按照屏幕高度自适应
        //加上这几，就是按照屏幕自适应
        //resizeMode:Image.resizeMode.contain,
        //祛除内部元素的白色背景
        backgroundColor: 'rgba(0,0,0,0)',
    },
    textInput: {
        // position: 'absolute',
        width: width - 40,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 6,
        // opacity:0.5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 8,

    },

    forgetPasswordStyle: {
        height: 32,
        marginLeft: width - 130,
        marginTop: 15,
        width: 80,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },

    cellStyle: {
        position: 'absolute',
        width: width,
        height: height - height * 0.35,
        top: height * 0.35,
        // 水平居中和垂直居中
        alignItems: 'center',
        flex: 1,
    },

    textInputStyle: {
        width: width - 100,
        height: 44,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 13
    },

})
