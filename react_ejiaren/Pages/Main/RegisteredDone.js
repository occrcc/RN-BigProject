import React, {Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    StatusBar,
    Image,
    TextInput,
    TouchableOpacity,
    Platform,
    DeviceEventEmitter,
    Keyboard
} from 'react-native'


var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '../Componnet/Button'
import px2dp from '../../Util'
import storage from "../RNAsyncStorage";

let {width, height} = Dimensions.get('window')
var loginPage = require('../Service/getData')

var submitObj = {};
export default class RegisteredDone extends Component {
    constructor(props) {
        super(props)
        this.resDone = this.resDone.bind(this);
        this.state = {
            isTeacher: false,
            listItem: [
                {fileName: 'validcode', placeholder: '输入验证码', imgUrl: 'phone', chName: '验证码'},
                {fileName: 'password', placeholder: '输入密码', imgUrl: 'pwd', chName: '密码'},
                {fileName: 'realname', placeholder: '真实姓名(用于老师与您沟通时可以找到您)', imgUrl: 'people_log', chName: '真实姓名'},
                {fileName: 'email', placeholder: '邮箱(用于您能正常接收老师的通知与资料)', imgUrl: 'email_log', chName: '邮箱'},
            ]
        };
    }

    componentDidMount() {
        this.dissmissKeyboard()
        MessageBarManager.registerMessageBar(this.refs.alert);
    }

    componentWillUnmount() {
        submitObj = {};
        MessageBarManager.unregisterMessageBar();
    }


    dissmissKeyboard() {
        Keyboard.dismiss();

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

    back() {
        this.props.navigator.pop()
    }

    resDone() {
        for (let j = 0, len = this.state.listItem.length; j < len; j++) {
            let item = this.state.listItem[j];
            let key = item.fileName;
            if (!submitObj.hasOwnProperty(key) || submitObj[key].length < 1) {
                this.showAlertMessage(item.chName + '不能为空');
                return;
            }
        }
        submitObj['name'] = this.props.account;
        submitObj['regtype'] = 1;
        submitObj['teacher'] = this.state.isTeacher ? 1 : 0;
        submitObj['phonezoneid'] = 1;
        submitObj['platform'] = Platform.OS === 'ios' ? 1 : 2;
        console.log(submitObj);

        loginPage.regDone(submitObj).then((res => {
            console.log(res);
            storage.save({
                key: 'userInfo',
                data: res,
            });
            DeviceEventEmitter.emit('ChuoUpLoadList');
            DeviceEventEmitter.emit('uploadServeUserInfo');
            DeviceEventEmitter.emit('changeUser', {userInfo: res, isLoad: true});
            DeviceEventEmitter.emit('updataPushToken',res);
            this.props.navigator.popToTop();
        })).catch((err => {
            this.showAlertMessage(err);
        }))

    }

    handleInput = (textVal, fieldName) => {
        submitObj[fieldName] = textVal;
    }

    _onStartShouldSetResponderCapture (event) {
        Keyboard.dismiss();
    }

    render() {
        let baseurl = 'baseimage_' + global.params.OgnzId;
        return (
            <View style={{flex: 1, backgroundColor: "white"}} onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />

                <KeyboardAwareScrollView>
                    <Image source={{uri: baseurl}} style={styles.backgroundImage}/>
                    <Button style={styles.buttonStyle} key={0} onPress={this.back.bind(this)}>
                        <Image source={{uri: 'icon_back_white'}}
                               style={styles.backBtnStyle}/>
                    </Button>

                    <View style={{marginTop:height * 0.35,flex:1, alignItems: 'center',height: height - height * 0.35}}>
                    {this.state.listItem.map((item, i) => {
                        return (
                            <View key={i} style={[styles.textInput]}>
                                <Image source={{uri: item.imgUrl}}
                                       style={{resizeMode: 'stretch', width: 20, height: 22, marginLeft: 22}}/>
                                <TextInput
                                    style={styles.textInputStyle}
                                    underlineColorAndroid='transparent'
                                    placeholder={item.placeholder}
                                    onChangeText={(textVal) => this.handleInput(textVal, item.fileName)}
                                    value={this.state.mesCode}
                                />
                            </View>
                        )
                    })}

                    <TouchableOpacity activeOpacity={1} style={styles.teacherBtnStyle} onPress={() => {
                        let teacher = !this.state.isTeacher;
                        if (teacher) {
                            this.setState({
                                listItem: [
                                    {fileName: 'validcode', placeholder: '输入验证码', imgUrl: 'phone'},
                                    {fileName: 'password', placeholder: '输入密码', imgUrl: 'pwd'},
                                    {fileName: 'realname', placeholder: '真实姓名(用于您与学生沟通)', imgUrl: 'people_log'},
                                    {fileName: 'email', placeholder: '邮箱(用于您与学生沟通)', imgUrl: 'email_log'},
                                ]
                            })
                        } else {
                            this.setState({
                                listItem: [
                                    {fileName: 'validcode', placeholder: '输入验证码', imgUrl: 'phone'},
                                    {fileName: 'password', placeholder: '输入密码', imgUrl: 'pwd'},
                                    {fileName: 'realname', placeholder: '真实姓名(用于老师与您沟通时可以找到您)', imgUrl: 'people_log'},
                                    {fileName: 'email', placeholder: '邮箱(用于您能正常接收老师的通知与资料)', imgUrl: 'email_log'},
                                ]
                            })
                        }
                        this.setState({isTeacher: teacher});
                    }}>
                        <Image source={{uri: this.state.isTeacher ? 'teacher_select' : 'teacher_empty'}} style={{
                            height: 22, width: 22, marginLeft: 25,
                        }}/>
                        <Text style={{color: 'white', fontSize: 14, marginLeft: 8}}>我是机构老师</Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.9} style={{top: 20, width: width - 40, height: 45}}
                                      onPress={this.resDone}>
                        <View style={{
                            borderRadius: 6,
                            height: px2dp(45),
                            flexDirection: "row",
                            backgroundColor: "rgba(216, 60, 48, 1)",
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Text style={{color: "#ffffff", fontSize: px2dp(15)}}>{"完成"}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.9} style={{
                        position: "absolute",
                        bottom: Platform.OS === 'ios' ?  global.params.iPhoneXHeight : 0,
                        left: 20,
                        right: 20,
                        height: 46
                    }} onPress={() => {
                        this.props.navigator.pop();
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
                            }}>返回</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                </KeyboardAwareScrollView>
                <MessageBarAlert ref="alert"/>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        position: 'absolute',
        width: width,
        // height: height - height * 0.35,
        height: height,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // width: null,
        // height: null,
        //不加这句，就是按照屏幕高度自适应
        //加上这几，就是按照屏幕自适应
        //resizeMode:Image.resizeMode.contain,
        //祛除内部元素的白色背景
        backgroundColor: 'rgba(0,0,0,0)',
    },
    backBtnStyle: {
        width: 34,
        height: 34,
        opacity: 0.5,
        position: 'absolute'

    },
    buttonStyle: {
        width: 44,
        height: 44,
        top: 44,
        marginLeft: 20,
        borderRadius: 22,
        position: 'absolute'
    },
    textInputStyle: {
        width: width - 100,
        height: 44,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 13
    },
    cellStyle: {
        // position: 'absolute',
        // width: width,
        // height: height - height * 0.35,
        // // height: height,
        // marginTop: height * 0.35,
        // // 水平居中和垂直居中
        // backgroundColor:'blue',
        flex: 1,
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
    teacherBtnStyle: {
        backgroundColor: 'transparent',
        marginTop: 15,
        flexDirection: 'row',
        width: width,
        height: 38,
        alignItems: 'center'
    }

});
