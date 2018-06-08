/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */

'use strict';

import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    Image,
    Platform
} from 'react-native'

import NavBar from '../../Componnet/NavBar'
import {ListItem, Button} from 'react-native-elements'

let {width} = Dimensions.get('window')

var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
var UserInfoServes = require('../Servers/UserInfoServes')
import Alipay from 'react-native-yunpeng-alipay'
import * as WeChat from 'react-native-wechat';
import PrepaiHtml from './PrepaidHtml'

var selectRow = 0;

export default class AccountsPrepaid extends Component {

    constructor(props) {
        super(props)
        this.state = {
            moneyList: [],
            choosePriceID: 1,
            chooseIndex: 0,
            payType: 1, //支付宝支付
            chooseAlipay: true,
            chooseWxPay: false
        }
    }

    back() {
        this.props.navigator.pop()
    }

    componentWillMount() {
        UserInfoServes.getRechargeMoneyList(this.props.source).then(res => {
            console.log(res);
            this.setState({
                moneyList: res
            })
        }).catch(err => {

        })
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
    }

    addListBtn() {
        console.log(this.state.moneyList);
        return (
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {this.state.moneyList.map((item, i) => (
                    <View key={i} style={{width: width / 2, height: 60}}>
                        <Button
                            title={item.name}
                            buttonStyle={[styles.buttonStyle, {
                                backgroundColor: this.state.chooseIndex === i ? 'rgb(223, 105, 85)' : 'rgb(188, 188, 188)'
                            }]}
                            textStyle={{fontSize: 15, color: 'white'}}
                            onPress={this.selectBtn.bind(this, item, i)}
                        />
                    </View>
                ))}
            </View>
        )
    }

    selectBtn(item, i) {
        this.setState({
            choosePriceID: item.id,
            chooseIndex: i,
        })
    }

    goPay() {
        console.log('payType:' + this.state.payType);
        console.log('price:' + this.state.choosePriceID);

        UserInfoServes.getPayBackOrderInfo(this.props.source.token, this.state.choosePriceID).then(orderInfo => {
            if (this.state.payType === 1) {
                this.aliPay(orderInfo);
            } else {
                this.wxPay(orderInfo);
            }
        }).catch(error => {

        })
    }

    async aliPay(orderInfo) {
        const orderSignInfo = await UserInfoServes.goAliPay(orderInfo.sn);
        console.log(orderSignInfo);
        Alipay.pay(orderSignInfo).then((data) => {
            console.log('payData:' + data);
        }).catch(error => {
            console.log('error:' + error);
        })
    }


    async wxGoPay(orderInfo) {
        const orderSignInfo = await UserInfoServes.goWxPay(orderInfo.sn);
        console.log(orderSignInfo);
        const result = await WeChat.pay(orderSignInfo);
        console.log(result.errStr);
    }

    wxPay(orderInfo) {
        WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    this.wxGoPay(orderInfo);
                } else {
                    MessageBarManager.showAlert({
                        alertType: 'error',
                        message: '没有安装微信软件，请安装后再试',
                        messageStyle: {
                            color: 'white',
                            fontSize: 13,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
                        },
                    });
                }
            });
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3",}}>
                <NavBar
                    title="钱包充值"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <ScrollView>
                    <ListItem
                        title='充值金额'
                        titleStyle={{
                            fontSize: global.params.CellTitleFontSize, color: global.params.CellTitleColor
                        }}
                        containerStyle={{
                            borderBottomWidth: 0,
                        }}
                        rightIcon={<View/>}
                    />
                    {this.addListBtn()}
                    <ListItem
                        title='支付宝支付'
                        underlayColor='rgba(244,244,244,0)'
                        avatar={{uri: 'ali_payicon'}}
                        rightIcon={<Image style={{width: 22, height: 22, marginTop: 9}}
                                          source={{uri: this.state.chooseAlipay ? 'select_up' : 'select_default'}}/>}
                        avatarStyle={{height: 26, width: 26}}
                        avatarOverlayContainerStyle={{backgroundColor: 'rgb(244,244,244)',}}
                        titleStyle={{fontSize: global.params.CellTitleFontSize, color: global.params.CellTitleColor}}
                        containerStyle={{
                            marginTop: 30,
                            height: 50,
                            borderBottomWidth: global.params.CellLineViewHight,
                            borderBottomColor: global.params.CellRightTitleColor,
                        }}
                        onPress={() => {
                            this.setState({
                                payType: 1,
                                chooseWxPay: false,
                                chooseAlipay: true
                            })
                        }}
                    />
                    <ListItem
                        title='微信支付'
                        underlayColor='rgba(244,244,244,0)'
                        rightIcon={<Image style={{width: 22, height: 22, marginTop: 9}}
                                          source={{uri: this.state.chooseWxPay ? 'select_up' : 'select_default'}}/>}
                        avatar={{uri: 'wx_payicon'}}
                        avatarStyle={{height: 26, width: 26}}
                        avatarOverlayContainerStyle={{backgroundColor: 'rgb(244,244,244)',}}
                        titleStyle={{fontSize: global.params.CellTitleFontSize, color: global.params.CellTitleColor}}
                        containerStyle={{
                            height: 50,
                            borderBottomWidth: global.params.CellLineViewHight,
                            borderBottomColor: global.params.CellRightTitleColor,

                        }}
                        onPress={() => {
                            this.setState({
                                payType: 2,
                                chooseWxPay: true,
                                chooseAlipay: false
                            })
                        }}
                    />
                    <Button
                        title='点击去支付，即表示已阅读并同意《充值协议》'
                        textStyle={{fontSize: 12, color: 'rgb(111,111,111)'}}
                        buttonStyle={{
                            width: width,
                            height: 22,
                            marginTop: 30,
                            backgroundColor: 'rgb(244,244,244)',
                            marginLeft: -15
                        }}
                        onPress={() => {
                            this.props.navigator.push({
                                component: PrepaiHtml,
                            });
                        }}
                    />
                </ScrollView>
                <MessageBarAlert ref="alert"/>
                <Button
                    title='去充值'
                    textStyle={{fontSize: 18, color: 'white'}}
                    buttonStyle={{
                        position: 'absolute',
                        width: width + 20,
                        left: -20,
                        height: 46,
                        backgroundColor: global.params.backgroundColor,
                        bottom: global.params.iPhoneXHeight,

                    }}
                    onPress={this.goPay.bind(this)}
                />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    buttonStyle: {
        height: 40,
        marginTop: 4,
        borderRadius: 6,
        backgroundColor: 'rgb(188,188,188)',
    }
})