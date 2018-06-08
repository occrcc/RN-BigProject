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
import Button from '../Componnet/Button'
import px2dp from '../../Util'

let {width, height} = Dimensions.get('window')
var loginPage = require('../Service/getData')


export default class FindPasswrod extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mesCode: '',
            pwd: '',
        };
    }

    componentDidMount() {
        this.dissmissKeyboard();
        MessageBarManager.registerMessageBar(this.refs.alert);
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
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


    dissmissKeyboard() {
        Keyboard.dismiss();

    }

    submitFindPwd() {
        if (this.state.mesCode.length < 1 || this.state.pwd.length < 1) {
            this.showAlertMessage('验证码或新密码不能为空');
        } else {
            loginPage.changePassword(this.props.account, this.state.mesCode, this.state.pwd).then(res => {
                console.log(res);
                DeviceEventEmitter.emit('changePwdSuccess');

                const routes = this.props.navigator.state.routeStack;
                let destinationRoute = null;
                for (var i = routes.length - 1; i >= 0; i--) {
                    console.log(routes[i].component.displayName);
                    if(routes[i].component.displayName === "LoginVC"){
                        destinationRoute = this.props.navigator.getCurrentRoutes()[i];
                        break;
                    }
                }
                if (destinationRoute){
                    this.props.navigator.popToRoute(destinationRoute);
                    DeviceEventEmitter.emit('serveUnion_push');
                }else {
                    destinationRoute = this.props.navigator.getCurrentRoutes()[1];
                    this.props.navigator.popToRoute(destinationRoute);
                }

            }).catch(err => {
                console.log(err);
                this.showAlertMessage(err);
            })
        }
    }


    render() {

        let baseurl = 'baseimage_' + global.params.OgnzId;

        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />

                <Image source={{uri: baseurl}} style={styles.backgroundImage}/>
                <Button style={styles.buttonStyle} key={0} onPress={this.back.bind(this)}>
                    <Image source={{uri: 'icon_back_white'}}
                           style={styles.backBtnStyle}/>
                </Button>

                <View style={styles.cellStyle}>
                    <View style={styles.textInput}>
                        <Image source={{uri: 'phone'}}
                               style={{resizeMode: 'stretch', width: 20, height: 22, marginLeft: 22}}/>
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid='transparent'
                            placeholder='输入验证码'
                            onChangeText={(mesCode) => this.setState({mesCode})}
                            value={this.state.mesCode}
                        />
                    </View>
                    <View style={styles.textInput}>
                        <Image source={{uri: 'pwd'}}
                               style={{resizeMode: 'stretch', width: 20, height: 22, marginLeft: 22}}/>
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid='transparent'
                            placeholder='输入新密码'
                            onChangeText={(pwd) => this.setState({pwd})}
                            value={this.state.pwd}
                            secureTextEntry={true}
                        />
                    </View>

                    <TouchableOpacity activeOpacity={0.8} style={{top: 20, width: width - 40, height: 45}}
                                      onPress={this.submitFindPwd.bind(this)}>
                        <View style={{
                            borderRadius: 6,
                            height: px2dp(45),
                            flexDirection: "row",
                            backgroundColor: "rgba(216, 60, 48, 1)",
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Text style={{color: "#ffffff", fontSize: px2dp(15)}}>提交</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <MessageBarAlert ref="alert"/>

            </View>
        )
    }
}

const styles = StyleSheet.create({
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
    backBtnStyle: {
        width: 34,
        height: 34,
        opacity: 0.5,
        position: 'absolute'

    },
    buttonStyle: {
        width: 44,
        height: 44,
        marginTop: 44,
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
        position: 'absolute',
        width: width,
        height: height - height * 0.35,
        top: height * 0.35,
        // 水平居中和垂直居中
        alignItems: 'center',
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

});
