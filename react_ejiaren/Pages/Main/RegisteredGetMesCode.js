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
    Keyboard
} from 'react-native'


var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import Button from '../Componnet/Button'
import px2dp from '../../Util'
import RegisterDone from './RegisteredDone'

let {width, height} = Dimensions.get('window')
var loginPage = require('../Service/getData')


export default class RegisteredGetMesCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phonePlaceholder: '手机号',
            phoneNumber: '',
        };
    }

    componentDidMount() {

        MessageBarManager.registerMessageBar(this.refs.alert);

    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
    }


    back() {
        this.props.navigator.pop()
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

    getMesCode(){
        var phoneNumber = this.state.phoneNumber;
        if (phoneNumber.length < 1){
            this.showAlertMessage('手机号不能为空');
        }else  {
            loginPage.isValidity(phoneNumber).then(res => {
                console.log('是否可以注册：' ,JSON.stringify(res));
                loginPage.getMesCode(phoneNumber).then(res => {
                    console.log('短信验证码:' ,JSON.stringify(res));
                    this.props.navigator.push({
                        component: RegisterDone,
                        params:{account:phoneNumber}
                    })
                }).catch(err => {
                    this.showAlertMessage(err);
                })
            }).catch(err => {
                this.showAlertMessage(err);
            })
        }
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

                <Image source={{uri: baseurl}} style={styles.backgroundImage} />
                <Button style={styles.buttonStyle} key={0} onPress={this.back.bind(this)}>
                    <Image source={{uri: 'icon_back_white'}}
                           style={styles.backBtnStyle}/>
                </Button>

                <View style={styles.cellStyle}>
                    <View style={styles.textInput}>
                        <Image source={{uri: 'phone'}} style={{resizeMode:'stretch',width: 22, height: 22, marginLeft: 22}}/>
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid='transparent'
                            placeholder={this.state.phonePlaceholder}
                            onChangeText={(phoneNumber) => this.setState({phoneNumber:phoneNumber})}
                            value={this.state.phoneNumber}
                        />
                    </View>


                    <TouchableOpacity activeOpacity={0.9} style={{top: 20, width: width - 40, height: 45}} onPress={this.getMesCode.bind(this)}>
                        <View style={{
                            borderRadius: 6,
                            height: px2dp(45),
                            flexDirection: "row",
                            backgroundColor: "rgba(216, 60, 48, 1)",
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Text style={{color: "#ffffff", fontSize: px2dp(15)}}>获取验证码</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.9} style={{
                        position: "absolute",
                        bottom: Platform.OS === 'ios' ?  global.params.iPhoneXHeight : 23,
                        left: 20,
                        right: 20,
                        height: 46
                    }} onPress={()=>{
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
                <MessageBarAlert ref="alert"/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    backgroundImage:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        width:null,
        height:null,
        //不加这句，就是按照屏幕高度自适应
        //加上这几，就是按照屏幕自适应
        //resizeMode:Image.resizeMode.contain,
        //祛除内部元素的白色背景
        backgroundColor:'rgba(0,0,0,0)',
    },
    backBtnStyle: {
        width: 34,
        height: 34,
        opacity: 0.5,
        position:'absolute'

    },
    buttonStyle: {
        width: 44,
        height: 44,
        marginTop: 44,
        marginLeft: 20,
        borderRadius: 22,
        position:'absolute'
    },
    textInputStyle: {
        width: width - 100,
        height: 44,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 13
    },
    cellStyle: {
        position:'absolute',
        width: width,
        height:height - height * 0.35,
        top:height * 0.35,
        // 水平居中和垂直居中
        alignItems: 'center',
        flex:1,
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

});
