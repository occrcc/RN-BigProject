/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */

'use strict';

import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    Platform,
    InteractionManager,
    DeviceEventEmitter


} from 'react-native'

import NavBar from '../../Componnet/NavBar'
import {Button} from 'react-native-elements'
var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
let {width, height} = Dimensions.get('window')
var UserInfoServes = require('../Servers/UserInfoServes')
import storage from "../../RNAsyncStorage";

export default class InvitationCodeVC extends Component {
    constructor(props){
        super(props)
        this.state={
            teacherCode:props.userInfo.user.invite_code,
            tips:'',
        }
    }

    back(){
        this.props.navigator.pop()
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        InteractionManager.runAfterInteractions(()=>{
            if (this.state.teacherCode && this.state.teacherCode.length > 0){
                this.getTeacherCode(this.state.teacherCode);
            }
        })
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
    }

    getTeacherCode(code){
        if (code.length < 1) {
            return
        }
        UserInfoServes.getTeacherCode(this.props.userInfo.token,code).then(res=>{
            console.log(res);
            if (res.name){
                this.setState({tips:'此邀请码对应的老师为:' + res.name,teacherCode:res.code});
            }else {
                this.setState({tips:'无效的邀请码',teacherCode:''});
            }
        }).catch(err=>{
            console.log(err + '  err');
        })
    }


    render(){
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <NavBar
                    title="邀请码"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <Text style={{marginTop:40,marginLeft:15}}>你推荐人的邀请码为:</Text>
                <TextInput
                    style={styles.textInputStyle}
                    underlineColorAndroid='transparent'
                    placeholder='请向老师索取四位邀请码'
                    onChangeText={(teachCode) => this.getTeacherCode(teachCode)}
                    keyboardType='numeric'
                    defaultValue={this.props.userInfo.user.invite_code}
                    // value={this.props.userInfo.user.invite_code}

                />
                <Text numberOfLines={2} style={{marginTop:15,marginLeft:15}}>{this.state.tips}</Text>
                <Text style={{marginTop:30,marginLeft:15,color:'rgb(236,96,73)',fontSize:11}}>注:输入推荐人邀请码便于推荐人后续跟进</Text>
                <Button
                    title='修改'
                    buttonStyle={{
                        margin:40,
                        height:36,
                        borderRadius:6,
                        backgroundColor:global.params.backgroundColor
                    }}
                    textStyle={{fontSize:15}}
                    onPress={()=>{
                        if(this.state.teacherCode.length > 0){
                            UserInfoServes.changeTeacherCode(this.props.userInfo.token,this.state.teacherCode).then(res=>{

                                console.log(res);
                                UserInfoServes.getUserForToken(this.props.userInfo.token).then(res=>{
                                    storage.save({
                                        key: 'userInfo',
                                        data: res,
                                    }).then(()=>{
                                        DeviceEventEmitter.emit('uploadUser');
                                    });
                                }).catch(error=>{

                                })

                                MessageBarManager.showAlert({
                                    message: "修改成功", // Message of the alert
                                    messageStyle: {
                                        color: 'white',
                                        fontSize: 13,
                                        marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
                                    },
                                    alertType: 'success',
                                });




                            }).catch(err=>{
                                MessageBarManager.showAlert({
                                    message: err, // Message of the alert
                                    titleStyle: {color: 'white', fontSize: 15, fontWeight: 'bold', marginTop: global.params.iPhoneXHeight + 9},
                                    messageStyle: {
                                        color: 'white',
                                        fontSize: 13,
                                        marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
                                    },
                                    alertType: 'error',
                                });
                            })
                        }else {
                            MessageBarManager.showAlert({
                                message: "邀请码输入不正确", // Message of the alert
                                titleStyle: {color: 'white', fontSize: 15, fontWeight: 'bold', marginTop: global.params.iPhoneXHeight + 9},
                                messageStyle: {
                                    color: 'white',
                                    fontSize: 13,
                                    marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
                                },
                                alertType: 'error',
                            });
                        }
                    }}
                />
                <MessageBarAlert ref="alert"/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInputStyle: {
        height: 36,
        marginLeft: 15,
        marginRight: 15,
        marginTop:20,
        fontSize: 13,
        borderRadius:4,
        borderWidth:0.5,
        borderColor:'rgb(222,222,222)',
        paddingLeft:10,

    },

})