import React, {Component} from 'react'
import {
    View,
    ListView,
    StyleSheet,
    Dimensions,
    Text,
    StatusBar,
    TouchableOpacity,
    DeviceEventEmitter,
    ScrollView,
    Image,
    Platform

} from 'react-native'


import NavBar from '../Componnet/NavBar'
import Alert from 'rnkit-alert-view';

var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import Alipay from 'react-native-yunpeng-alipay'
import * as WeChat from 'react-native-wechat';
import Modal from 'react-native-modal'

let {width, height} = Dimensions.get('window')

var UserInfoServes = require('../Mine/Servers/UserInfoServes')
var ServeApi = require('./ServeApi/ServeApi');
let pay_method = '9,1,2,5,4';

import ServeWXDF from './ServeWeights/ServeWXDaiFu'
import BankCardTransfer from './ServeWeights/BankCardTransfer'
import OrderSuccessfulPage from './OrderSuccessfulPage'
import VisaPaySuccessful from './VisaPay/VisaPaySuccessful'
import storage from '../RNAsyncStorage'

export default class ChooseCountries_kuaidi extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chooseIndex: 9,
            isYuer: true,
            expense_detail: [],
            isModalVisible: false,
            expenseDetail: [],
            allPrice: null,
            payMethod: [
                ['icon_yue', '余额支付', 9,],
                ['icon_zhifubao', '支付宝支付', 1],
                ['icon_weiixnzhifu', '微信支付', 2],
                ['icon_haoyoudaifu', '好友代付', 5],
                ['iocn_zhuanzhangzhifu', '转账支付', 4]
            ]
        }
    }

    back() {
        Alert.alert(
            '支付提示', '确定要取消支付吗？', [
                {
                    text: '确定', onPress: () => {
                    this.props.navigator.pop();
                }
                },
                {text: '取消', onPress: () => console.log('取消')},
            ],
        );
    }


    componentDidMount() {
        DeviceEventEmitter.emit('refreshBadge');
        console.log('-------------------------------------------------');
        console.log(this.props.orderInfo);
        MessageBarManager.registerMessageBar(this.refs.alert);
        this.friendDaiFu = DeviceEventEmitter.addListener('friendDaiFu', () => {
            MessageBarManager.registerMessageBar(this.refs.alert);
        });
    }

    componentWillMount() {
        if (global.params.OgnzId === '290') {
            var payList = this.state.payMethod;
            delete payList[2];
            this.setState({payMethod: payList});
        }

        this.setState({allPrice: this.props.orderInfo.zfb_price});
        if (this.props.orderInfo.memo.pay_method && this.props.orderInfo.memo.pay_method.length > 0) {
            pay_method = this.props.orderInfo.memo.pay_method;
            let payMethodArr = pay_method.split(',');
            let choose = parseInt(payMethodArr[0]);
            let expenseDetail = [];
            if (this.props.orderInfo.expense_detail_all.cashpay) {
                if (choose === 1) {
                    expenseDetail = this.props.orderInfo.expense_detail_all['zfb'];
                } else if (choose === 9) {
                    expenseDetail = this.props.orderInfo.expense_detail_all['cashpay'];
                } else if (choose === 2) {
                    expenseDetail = this.props.orderInfo.expense_detail_all['wx'];
                }
            } else {
                expenseDetail = this.props.orderInfo.expense_detail;
            }
            this.setState({
                chooseIndex: choose,
                expenseDetail: expenseDetail,
            })
        } else {
            if (parseFloat(this.props.userInfo.amount) < parseFloat(this.props.orderInfo.zfb_price)) {
                this.setState({
                    chooseIndex: 1,
                    isYuer: false,
                })
            }
            if (this.props.orderInfo.expense_detail_all.cashpay) {
                this.setState({
                    expenseDetail: this.props.orderInfo.expense_detail_all['cashpay']
                })

                if (parseFloat(this.props.userInfo.amount) < parseFloat(this.props.orderInfo.zfb_price)) {
                    this.setState({
                        expenseDetail: this.props.orderInfo.expense_detail_all['zfb']
                    })
                }
            } else {
                this.setState({
                    expenseDetail: this.props.orderInfo.expense_detail
                })
            }
        }
    }

    componentWillUnmount() {
        this.friendDaiFu.remove();
        MessageBarManager.unregisterMessageBar();
        pay_method = '';
    }

    selectPayBtn(item) {
        this.setState({
            chooseIndex: item[2],
        })
        console.log(item[2]);
        if (this.props.orderInfo.expense_detail_all.cashpay) {
            let expenseDetail = [];
            switch (item[2]) {
                case 9:
                    expenseDetail = this.props.orderInfo.expense_detail_all['cashpay'];
                    break;
                case 1:
                    expenseDetail = this.props.orderInfo.expense_detail_all['zfb'];
                    break;
                case 2:
                    expenseDetail = this.props.orderInfo.expense_detail_all['wx'];
                    break;
                case 5:
                    expenseDetail = this.props.orderInfo.expense_detail_all['wx'];
                    break;
                case 4:
                    expenseDetail = this.props.orderInfo.expense_detail_all['transfer_account'];
                    break;
                default:
                    break;
            }
            console.log(expenseDetail);

            let allPrice = 0.00;
            for (let j = 0, len = expenseDetail.length; j < len; j++) {
                let obj = expenseDetail[j];
                allPrice += parseFloat(obj.price);
            }

            if (allPrice < 0) {
                allPrice = 0.00;
            }

            allPrice = allPrice.toFixed(2);

            if (expenseDetail.length > 0) {
                this.setState({
                    expenseDetail: expenseDetail,
                    allPrice: allPrice,
                })
            }
        }
    }

    showYuerSubtitle(item) {
        if (this.state.isYuer === false && item[2] === 9) {
            return (
                <Text style={{
                    fontSize: 13,
                    marginTop: 5,
                    color: '#ff0e0e',
                }}>当前余额不足</Text>)
        }
    }

    payListRow() {
        return (
            <View>
                {this.state.payMethod.map((item) => {
                    if (pay_method.indexOf(item[2]) >= 0 || pay_method.length < 1) {
                        return (
                            <TouchableOpacity activeOpacity={0.7} key={item[2]} style={styles.rowContainer}
                                              onPress={this.selectPayBtn.bind(this, item, item[2])}
                            >
                                <View style={styles.rowContentViewStyle}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Image source={{uri: item[0]}} style={styles.rowIconStyle}/>
                                        <View>
                                            <Text style={{fontSize: 15, color: '#2a2a2a',}}>{item[1]}</Text>
                                            {this.showYuerSubtitle(item)}
                                        </View>
                                    </View>
                                    <Image
                                        source={{uri: this.state.chooseIndex === item[2] ? 'icon_gouxuan' : 'icon_circle'}}
                                        style={styles.rightIconStyle}/>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                })}
            </View>
        )
    }

    orderPay() {
        console.log(this.state.chooseIndex + this.state.isYuer);
        if (this.state.chooseIndex === 9 && this.state.isYuer === false) {
            MessageBarManager.showAlert({
                alertType: 'error',
                message: '当前余额不足，请选择其它支付方式',
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

        let orderInfo = this.props.orderInfo;
        if (this.state.chooseIndex === 1) {
            this.aliPay(orderInfo);
        } else if (this.state.chooseIndex === 2) {
            this.wxPay(orderInfo);
        } else if (this.state.chooseIndex === 5) {
            //好友代付
            ServeApi.firendPay(orderInfo.sn, this.props.userInfo.token).then(res => {
                console.log(res);
                this.props.navigator.push({
                    component: ServeWXDF,
                    params: {orderInfo: orderInfo},
                })
            }).catch(err => {
                console.log('err ' + err);
            })
        } else if (this.state.chooseIndex === 4) {
            this.props.navigator.push({
                component: BankCardTransfer,
                params: {orderInfo: orderInfo},
            })
        } else if (this.state.chooseIndex === 9) {

            ServeApi.yuerPay(this.props.userInfo.token, orderInfo.sn).then(res => {
                console.log(res);
                if (res.result) {

                    UserInfoServes.getUserForToken(this.props.userInfo.token).then(res=>{
                        console.log(res);
                        storage.save({
                            key: 'userInfo',
                            data: res,
                        });
                        this.setState({
                            userInfo: res
                        });
                    }).catch(error=>{
                        console.log('获取用户余额失败 : ' + error)
                    })

                    this.pushSuccessfulPage(orderInfo);
                }
            }).catch(error => {
                console.log('error  ' + error);
            })
        }
    }

    pushSuccessfulPage(orderInfo) {

        console.log(orderInfo);

        if (this.props.visa) {
            this.props.navigator.push({
                component: VisaPaySuccessful,
                params: {orderInfo: orderInfo},
            })
        } else {
            this.props.navigator.push({
                component: OrderSuccessfulPage,
                params: {orderInfo: orderInfo},
            })
        }

    }

    async aliPay(orderInfo) {
        const orderSignInfo = await UserInfoServes.goAliPay(orderInfo.sn);
        console.log(orderSignInfo);
        Alipay.pay(orderSignInfo).then((data) => {
            console.log('payData:' + data);
            this.pushSuccessfulPage(orderInfo);
        }).catch(error => {
            console.log('error:' + error);
        })
    }

    async wxGoPay(orderInfo) {
        const orderSignInfo = await UserInfoServes.goWxPay(orderInfo.sn);
        console.log(orderSignInfo);
        const result = await WeChat.pay(orderSignInfo);
        if (result.errCode === 0) {
            this.pushSuccessfulPage(orderInfo);
        } else {
            this.showAlertMessage(result.errStr);
        }
        console.log(result.errStr);
    }

    showAlertMessage(errMessage) {
        MessageBarManager.showAlert({
            alertType: 'error',
            message: errMessage,
            messageStyle: {
                color: 'white',
                fontSize: 13,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
            },
        });
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

    showMingxi() {
        console.log('查看明细');
        this.setState({isModalVisible: true}, () => {
            this.getPriceDetail();
        });
    }

    getPriceDetail() {
        let rest = this.state.expenseDetail;
        let viewHeiht = Platform.OS === 'ios' ? 180 : 220;
        this.refs.detailView.setNativeProps({
            style: {
                height: 42 * rest.length + 160,
                marginTop: height - (42 * rest.length + viewHeiht)
            }
        })
    }

    mingxiRows() {
        let allPrice = 0.00;
        for (let j = 0, len = this.state.expenseDetail.length; j < len; j++) {
            let obj = this.state.expenseDetail[j];
            allPrice += parseFloat(obj.price);
        }

        if (allPrice < 0){
            allPrice = 0.00;
        }

        allPrice = allPrice.toFixed(2);



        return (
            <View>
                {
                    this.state.expenseDetail.map((item, i) => {
                        return (
                            <View key={i} style={{
                                backgroundColor: 'white',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                height: 42,
                                borderBottomColor: '#f5f5f5',
                                borderBottomWidth: 1,
                                flexDirection: 'row'
                            }}>
                                <Text style={{marginLeft: 15, fontSize: 15, color: '#969696'}}>{item.item}</Text>
                                <Text style={{
                                    marginRight: 15,
                                    fontSize: 13,
                                    color: '#969696'
                                }}>{item.unit}{item.price}</Text>
                            </View>
                        )
                    })
                }
                <View style={{
                    backgroundColor: 'white',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    height: 42,
                    flexDirection: 'row'
                }}>
                    <Text style={{marginRight: 15, fontSize: 13, color: '#969696'}}>总价: ￥{allPrice}</Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f5f5f5"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                <NavBar
                    title='订单支付'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                    rightTitle='查看明细'
                    rightPress={this.showMingxi.bind(this)}
                />
                <ScrollView style={{marginBottom: 77}}>
                    <View style={[styles.rowContainer, styles.headRowStyle]}>
                        <View style={{flex: 4, marginLeft: 14}}>
                            <Text numberOfLines={2}
                                  style={{color: '#2a2a2a', fontSize: 15}}>{this.props.orderInfo.serveName}</Text>
                        </View>
                        <View style={{flex: 2, marginRight: 14}}>
                            <Text style={{
                                color: '#ff0e0e',
                                fontSize: 15,
                                textAlign: 'right'
                            }}>应付金额:{this.state.allPrice}元</Text>
                        </View>
                    </View>
                    <View style={styles.headPayTitleStyle}>
                        <Text style={{fontSize: 13, marginLeft: 14, color: '#2a2a2a'}}>支付方式</Text>
                    </View>
                    {this.payListRow()}
                    <View style={[styles.rowContainer, {justifyContent: 'center'}]}>
                        <Text style={{marginLeft: 14, fontSize: 11, color: '#969696'}}>• 第三方付款方式(支付宝/微信/银行卡等)</Text>
                        <Text style={{marginLeft: 14, fontSize: 11, color: '#969696', marginTop: 8}}>•
                            每日都有相应的支付上限(一般情况下限额2万/每日较多)</Text>
                    </View>

                    <View style={{margin: 14}}>
                        <Text style={{color: '#969696', fontSize: 11, letterSpacing: 1, lineHeight: 18}}>
                            如您因限额无法支付:{'\n'}
                            01. 【推荐】请将所付款充值至<Text
                            style={{fontWeight: 'bold', fontSize: 12, color: '#2a2a2a'}}>{'"我的钱包"'}</Text>(当余额大于订单金额时，支付方式默认为余额支付){'\n'}
                            02. 将支付款项转入支付宝的"余额"中，使用"余额支付"{'\n\n'}
                            支付方面有任何疑问或建议，请致电我们 021-61984772
                        </Text>
                    </View>
                </ScrollView>
                <View style={{
                    position: 'absolute', left: 0, right: 0, bottom: 0, height: 77, backgroundColor: 'white',
                }}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.payBtnStyle} onPress={this.orderPay.bind(this)}>
                        <Text style={{fontSize: 16, color: '#ffffff'}}>确认支付</Text>
                    </TouchableOpacity>
                </View>
                <MessageBarAlert ref="alert"/>


                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{flex: 1, width: width, height: height}}>
                        <View style={styles.popViewStyle} ref="detailView">
                            <View style={{backgroundColor: '#dedede', height: 44, justifyContent: 'center'}}>
                                <Text style={{marginLeft: 15, fontSize: 14, color: '#969696'}}>费用明细</Text>
                            </View>
                            {this.mingxiRows()}
                            <TouchableOpacity activeOpacity={0.8} style={styles.popContentViewStyle}
                                              onPress={() => {
                                                  this.setState({isModalVisible: false})
                                              }}
                            >
                                <Text style={{fontSize: 16, color: '#ffffff'}}>知道了</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>
        )
    }
}

var styles = StyleSheet.create({

    popViewStyle: {
        width: width - (Platform.OS === 'ios' ? 0 : 40),
        marginLeft: Platform.OS === 'ios' ? -20 : 0,
        backgroundColor: 'white',
    },


    popContentViewStyle: {
        position: 'absolute',
        bottom: 20,
        height: 40,
        left: 14,
        right: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: global.params.backgroundColor
    },

    rowContainer: {
        height: 60,
        backgroundColor: '#ffffff',

    },
    rowContentViewStyle: {
        flex: 1,
        marginLeft: 14,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        justifyContent: 'space-between'
    },
    rowIconStyle: {
        width: 22, height: 22,
        marginLeft: 4,
        marginRight: 14,
        resizeMode: 'stretch'
    },
    rightIconStyle: {
        width: 16, height: 16,
        marginLeft: 4,
        marginRight: 14
    },
    headRowStyle: {
        borderBottomWidth: 10,
        borderBottomColor: '#f5f5f5',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        height: 80
    },
    headPayTitleStyle: {
        height: 40,
        backgroundColor: '#ffffff',
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        justifyContent: 'center'
    },
    payBtnStyle: {
        backgroundColor: global.params.backgroundColor,
        borderRadius: 4,
        marginLeft: 15,
        marginRight: 15,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12
    }
});