/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */


'use strict';

import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    TextInput,
    Platform,
    TouchableWithoutFeedback,
    DeviceEventEmitter
} from 'react-native'

import NavBar from '../../Componnet/NavBar'
import {TextInputLayout} from 'rn-textinputlayout'
import Button from 'apsl-react-native-button'
import LoginVC from '../../Main/LoginVC'

var changePwdPage = require('../../Service/getData')
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import {Navigator} from 'react-native-deprecated-custom-components'

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class ChangePasswordVC extends Component {
    constructor(props) {
        super(props)
        this.state = {
            oldPwd: '',
            newPwd: '',
        }
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        this.changePasswordPopToPop = DeviceEventEmitter.addListener('changePasswordPopToPop', ()=>{
            this.props.navigator.popToTop();
        });
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
        this.changePasswordPopToPop.remove();
    }

    back() {
        this.props.navigator.pop()
    }


    showAlert(message,type){
        MessageBarManager.showAlert({
            message: message, // Message of the alert
            messageStyle: {
                color: 'white',
                fontSize: 13,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
            },
            alertType: type ? 'success' : 'error',
        });
    }

    changePassword() {

        this.refs.textInput1.blur();
        this.refs.textInput2.blur();

        console.log(this.state.oldPwd + ':' + this.state.newPwd + ':' + this.props.token);

        //修改密码
        changePwdPage.changePwd(this.state.oldPwd, this.state.newPwd,this.props.token).then((res=>{
            console.log('reslog:' + JSON.stringify(res));
            this.showAlert('密码修改成功',true);
            setTimeout(() => {
                this.props.navigator.push({
                    sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                    component: LoginVC,
                    params:{hideBackImage:true}
                });
            }, 1000)


        })).catch((error=>{
            this.showAlert(error,false);
        }))
    }



    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <NavBar
                    title="修改密码"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />

                <TouchableWithoutFeedback
                    activeOpacity={1}
                    underlayColor='rgb(245,245,245)'
                    style={styles.container} onPress={()=>{
                    this.refs.textInput1.blur();
                    this.refs.textInput2.blur();
                }}>
                    <View>
                        <TextInputLayout
                            style={styles.inputLayout}
                            // checkValid={t => EMAIL_REGEX.test(t)}
                        >
                            <TextInput
                                ref='textInput1'
                                style={styles.textInput}
                                placeholder={'请输入原密码'}
                                onChangeText={(oldPwd) => this.setState({oldPwd})}
                                value={this.state.oldPwd}

                            />
                        </TextInputLayout>
                        <TextInputLayout style={styles.inputLayout}>
                            <TextInput
                                ref='textInput2'
                                style={styles.textInput}
                                placeholder={'请输入新密码'}
                                onChangeText={(newPwd) => this.setState({newPwd})}
                                value={this.state.newPwd}
                                secureTextEntry={true}
                            />
                        </TextInputLayout>


                        <Button style={{
                            backgroundColor:  global.params.backgroundColor,
                            marginTop: 50,
                            marginHorizontal: 40

                        }}
                                textStyle={{fontSize: 15, color: 'white'}}
                                onPress={this.changePassword.bind(this)}
                        >
                            确定
                        </Button>
                    </View>
                </TouchableWithoutFeedback>
                <MessageBarAlert ref="alert" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30
    },
    textInput: {
        fontSize: 15,
        height: 36
    },
    inputLayout: {
        marginTop: 8,
        marginHorizontal: 20
    }
})