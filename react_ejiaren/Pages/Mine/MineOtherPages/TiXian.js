/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */


'use strict';

import React, {Component} from 'react'
import {
    View,
    Text,
    StatusBar,
    InteractionManager,
    Platform,
    DeviceEventEmitter
} from 'react-native'

import NavBar from '../../Componnet/NavBar'

var UserInfoServes = require('../Servers/UserInfoServes')
var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import Alert from 'rnkit-alert-view';
import storage from "../../RNAsyncStorage";
import TixianDetail from './TiXianDetail'

import {Button} from 'react-native-elements'

export default class TiXian extends Component {
    constructor(props) {
        super(props)
    }

    back() {
        this.props.navigator.pop();
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        InteractionManager.runAfterInteractions(() => {
        });
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
    }

    async tiXian() {
        UserInfoServes.isUserInfoPerfect(this.props.userInfo.token).then(res => {
            console.log(res);
            if (res.realname.length < 1 || res.mobile.length < 1) {
                MessageBarManager.showAlert({
                    message: "请完善常用信息", // Message of the alert
                    titleStyle: {
                        color: 'white',
                        fontSize: 15,
                        fontWeight: 'bold',
                        marginTop: global.params.iPhoneXHeight + 9
                    },
                    messageStyle: {
                        color: 'white',
                        fontSize: 13,
                        marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
                    },
                    alertType: 'error',
                });
            } else {

                UserInfoServes.tiXian(this.props.userInfo.token).then(res => {
                    this.props.navigator.push({
                        component: TixianDetail,
                        params: {amount: this.props.userInfo.amount.toFixed(2)},
                    })

                    // Alert.alert(
                    //     '提现成功', '款项将在7个工作日内按照您原支付途径返还，请注意查看。如有疑问请联系客服：021-61984772', [
                    //         // {text: 'Cancel', onPress: () => console.log('Cancel Pressed!'), style: 'cancel',},
                    //         {text: 'Ok', onPress: () => {
                    //             UserInfoServes.getUserForToken(this.props.userInfo.token).then(res=>{
                    //                 storage.save({
                    //                     key: 'userInfo',
                    //                     data: res,
                    //                 }).then(()=>{
                    //                     DeviceEventEmitter.emit('uploadMyWallet');
                    //                     this.props.navigator.pop();
                    //                 });
                    //             }).catch(error=>{
                    //
                    //             })
                    //         }},],
                    // );

                }).catch(error => {
                    MessageBarManager.showAlert({
                        message: error, // Message of the alert
                        messageStyle: {
                            color: 'white',
                            fontSize: 13,
                            marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
                        },
                        alertType: 'error',
                    });
                })
            }
        }).catch(err => {

        })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'rgb(244,244,244)', borderRadius: 4}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                <NavBar
                    title="发起提现申请"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <View
                    style={{marginLeft: 10, marginRight: 10, marginTop: 60, backgroundColor: 'white', borderRadius: 6}}>
                    <Text style={{margin: 20, color: 'rgb(99,99,99)', fontSize: 13}}>提现金额</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{marginTop: 8, marginLeft: 20, color: 'rgb(99,99,99)', fontSize: 13}}>￥</Text>
                        <Text style={{
                            marginLeft: 6,
                            fontSize: 22,
                            fontWeight: 'bold'
                        }}>{this.props.userInfo.amount.toFixed(2)}</Text>
                    </View>
                    <View style={{
                        marginLeft: 15,
                        marginTop: 10,
                        marginRight: 10,
                        height: 0.5,
                        backgroundColor: 'rgb(244,244,244)'
                    }}/>
                    <Button
                        title='提现'
                        buttonStyle={{
                            margin: 40,
                            height: 36,
                            borderRadius: 6,
                            backgroundColor: 'green'
                        }}
                        textStyle={{fontSize: 15}}
                        onPress={() => {
                            if (this.props.userInfo.amount < 10) {
                                MessageBarManager.showAlert({
                                    message: "提现金额必须大于10元", // Message of the alert
                                    titleStyle: {
                                        color: 'white',
                                        fontSize: 15,
                                        fontWeight: 'bold',
                                        marginTop: global.params.iPhoneXHeight + 9
                                    },
                                    messageStyle: {
                                        color: 'white',
                                        fontSize: 13,
                                        marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
                                    },
                                    alertType: 'error',
                                });
                            } else {
                                this.tiXian();
                            }
                        }}
                    />
                </View>
                <MessageBarAlert ref="alert"/>
            </View>
        )
    }
}


