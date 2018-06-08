import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    StatusBar,
    TouchableOpacity,
    DeviceEventEmitter,
    Linking,
    InteractionManager,
    TextInput,
    Image,
    Switch,
    ScrollView,
    Platform,
    Keyboard

} from 'react-native'


import NavBar from '../../Componnet/NavBar'
import storage from "../../RNAsyncStorage";

var JiejiApi = require('./JiejiServe/JiejiApi');
var GetDataApi = require('../../Service/getData');
import Modal from 'react-native-modal'

let {width, height} = Dimensions.get('window');
var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import OrderPay from '../OrderPay'
import {Navigator} from 'react-native-deprecated-custom-components'
import VisaNoInfo from "../VisaPay/VisaNoInfo";
import Coupon from '../../Mine/MineOtherPages/MyCoupons'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import _ from 'lodash'

var submitObj = {};
export default class JiejiSubmitOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: null,
            teacherName: '',
            notices: '',
            switchValue: false,
            price: '0.00',
            allData: [],
            isModalVisible: false,
            expenseDetail: [],
            KeyboardShown:false,
        }
        this.keyboardDidShowListener = null;
        this.keyboardDidHideListener = null;
    }

    back() {
        this.props.navigator.pop();
    }

    keFu() {
        console.log(this.state.kefuPhone);
        let url = 'tel: ' + global.kefuInfo.kefuPhone;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    componentWillMount() {
        this.setState({price: this.props.res.price, expenseDetail: this.props.res.chargeKinds});
        submitObj = _.cloneDeep(this.props.res);

        //监听键盘弹出事件
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',
            this.keyboardDidShowHandler.bind(this));
        //监听键盘隐藏事件
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',
            this.keyboardDidHideHandler.bind(this));
    }


    //强制隐藏键盘
    dissmissKeyboard() {
        Keyboard.dismiss();
    }

    //键盘弹出事件响应
    keyboardDidShowHandler(event) {
        this.setState({KeyboardShown: true});
        console.log(event.endCoordinates.height);
    }

    //键盘隐藏事件响应
    keyboardDidHideHandler(event) {
        this.setState({KeyboardShown: false});
    }

    componentDidMount() {
        this.getConpone = DeviceEventEmitter.addListener('getConpone', (conponeCode) => {
            setTimeout(()=>this.orderPayInfo(conponeCode),1000);
        });

        MessageBarManager.registerMessageBar(this.refs.alert);
        InteractionManager.runAfterInteractions(() => {
            storage.load({
                key: 'userInfo',
            }).then(ret => {
                this.setState({
                    userInfo: ret,
                });
                {
                    this.getRowListType(ret)
                }
            })
        })
    }

    componentWillUnmount() {

        //卸载键盘弹出事件监听
        this.keyboardDidShowListener && this.keyboardDidShowListener.remove();

        //卸载键盘隐藏事件监听
        this.keyboardDidHideListener && this.keyboardDidHideListener.remove();

        MessageBarManager.unregisterMessageBar();
        submitObj = {};
        this.getConpone.remove();
    }

    showMingxi = () => {
        console.log('查看明细');
        this.setState({isModalVisible: true});
    }


    getRowListType(userInfo) {
        let source = {};
        source.id = this.props.res.mgService.id;
        source.attime = this.props.res.attime;
        source.people = this.props.res.people;
        source.access_token = userInfo.token;
        JiejiApi.getListType(source).then(res => {
            console.log(res);
            this.setState({notices: res.notices, allData: res.fields});
        }).catch(error => {
            console.log('error:  ' + error);
        })
    }

    handleInput = (textVal, fieldName, type) => {
        submitObj[fieldName] = textVal;
        if (type === 'yqm') {
            GetDataApi.getYqm(textVal, this.state.userInfo.token).then(res => {
                console.log(res);
                if (res.states === 'true') {
                    this.setState({teacherName: res.name});
                } else {
                    this.setState({teacherName: ''});
                }
                submitObj[fieldName] = textVal;
            }).catch(err => {
                console.log('error:  ' + err);
            });
        }
    }

    rightView(rowData, rowID) {
        let fieldType = rowData.fieldType;
        if (fieldType === 1) {
            if (rowData.defaultValue.length > 0) {
                submitObj[rowData.fieldName] = rowData.defaultValue;
            }
            if (rowData.textfieldType === 'yqm') {
                return (
                    <View style={styles.cellYqmInputStyle}>
                        <Text ref="yqmLabel" style={{
                            textAlign: 'right',
                            width: 100,
                            marginRight: 5,
                            color: '#727272',
                        }}>{this.state.teacherName}</Text>
                        <TextInput key={rowID} placeholder={'邀请码'} placeholderTextColor='#727272'
                                   style={{color: global.params.backgroundColor, fontSize: 14, width: 70, height: 38, textAlign: 'right'}}
                                   defaultValue={rowData.defaultValue}
                                   onChangeText={(textVal) => this.handleInput(textVal, rowData.fieldName, 'yqm')}
                                   underlineColorAndroid='transparent'
                                   keyboardType='numeric'
                        >
                        </TextInput>
                    </View>
                )
            } else {
                let keyboard = 'default'
                if (rowData.textfieldType === 'email') {
                    keyboard = 'email-address'
                } else if (rowData.textfieldType === 'phone') {
                    keyboard = 'numeric'
                }
                return (
                    <TextInput key={rowID} placeholder={rowData.fieldPlaceHolder} placeholderTextColor='#727272'
                               style={styles.cellTextInputStyle} defaultValue={rowData.defaultValue}
                               onChangeText={(textVal) => this.handleInput(textVal, rowData.fieldName, '')}
                               underlineColorAndroid='transparent'
                               keyboardType={keyboard}
                               editable={rowData.fieldName === 'attime' ? false : true}
                    >
                    </TextInput>
                )
            }
        } else if (fieldType === 2) {
            return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{marginRight: 8, fontSize: 13, color: 'rgb(177,177,177)'}}>费用详见明细</Text>
                    <Switch
                        //动态改变value
                        value={this.state.switchValue}
                        //当切换开关室回调此方法
                        onValueChange={(valuess) => {
                            this.setState({switchValue: valuess}, () => {
                                this.getPrice(valuess);
                            })
                        }}
                    />
                </View>
            )
        }
    }

    getPrice(value) {

        submitObj['jpjj'] = value ? 1 : 0;
        console.log(value);
        let getPriceObj = {};
        getPriceObj['id'] = this.props.res.mgService.id;
        getPriceObj['people'] = this.props.res.people;
        getPriceObj['carSize'] = this.props.res.carSize;
        getPriceObj['attime'] = this.props.res.attime;
        getPriceObj['jpjj'] = value ? 1 : 0;
        getPriceObj['access_token'] = this.state.userInfo.token;
        JiejiApi.getJpjiPrice(getPriceObj).then(res => {
            console.log(res);
            submitObj['price'] = res.price;
            this.setState({price: res.price, expenseDetail: res.chargeDetail})
        }).catch(error => {
            console.log('error : ' + error);
        })
    }


    mingxiRows() {
        let allPrice = 0.00;
        for (let j = 0, len = this.state.expenseDetail.length; j < len; j++) {
            let obj = this.state.expenseDetail[j];
            allPrice += parseFloat(obj.price);
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
                                <Text
                                    style={{marginRight: 15, fontSize: 13, color: '#969696'}}>￥{item.price}</Text>
                            </View>
                        )
                    })
                }
                <View style={{
                    backgroundColor: 'white',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    height: 42,
                    flexDirection: 'row',
                    marginBottom: 20 + global.params.iPhoneXHeight,
                }}>
                    <Text style={{marginTop: 15, marginRight: 15, fontSize: 13, color: '#969696'}}>总价:
                        ￥{allPrice}</Text>
                </View>
            </View>
        )
    }

    goPay() {
        for (let j = 0, len = this.state.allData.length; j < len; j++) {
            let item = this.state.allData[j];
            if (item.notnull === 1) {
                let key = item.fieldName;
                if (!submitObj.hasOwnProperty(key) || submitObj[key].length < 1) {
                    MessageBarManager.showAlert({
                        message: item.chName + '不能为空',
                        messageStyle: {
                            color: 'white',
                            fontSize: 13,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
                        },
                        alertType: 'error',
                    });
                    return;
                }
            }
        }

        submitObj['id'] = this.props.res.mgService.id;
        submitObj['luggage'] = this.props.res.carModel.luggage;
        submitObj['access_token'] = this.state.userInfo.token;


        delete(submitObj['mgService']);
        delete(submitObj['addworktime']);
        delete(submitObj['chargeKinds']);
        delete(submitObj['chargeDetail']);
        delete(submitObj['rmb_price']);
        delete(submitObj['carModel']);

        console.log(submitObj);

        GetDataApi.getCheckUserCode(1, submitObj['price'], this.state.userInfo.token).then(res => {
            console.log(res);
            if (res.length < 1) {
                this.orderPayInfo();
            } else {

                this.props.navigator.push({
                    sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                    component: Coupon,
                    params: {sourceList:res},
                })

                console.log('你有优惠券可以使用,请跳转到优惠券界面');
            }
        }).catch(err => {
            console.log('err   ' + err);
        })
    }

    orderPayInfo(code) {
        if (code) {
            submitObj['code'] = code;
        }
        submitObj['from'] = Platform.OS === 'ios' ? 0 : 3;
        JiejiApi.jiejiSubmitOrder(submitObj).then(res => {
            console.log(res);
            this.props.navigator.push({
                sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                component: OrderPay,
                params: {orderInfo: res, userInfo: this.state.userInfo},
            })
        }).catch(error => {
            console.log('error   ' + error);
        })
    }

    renderRow(rowData, rowID) {
        return (
            <View style={styles.cellContentViewStyle}>
                <Text style={styles.cellTitleStyle}>{rowData.chName}</Text>
                <View style={styles.subViewType}>
                    {this.rightView(rowData, rowID)}
                </View>
            </View>
        );
    }

    payView(){
        if (this.state.KeyboardShown === false) {
            return (
                <View style={styles.priceAndPayViewStyle}>
                    <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                        <Text style={{marginLeft: 14, fontSize: 15, color: '#727272'}}>订单总额:</Text>
                        <Text style={{marginLeft: 3, fontSize: 18, color: '#ff0e0e'}}>{'￥' + this.state.price}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} style={styles.payBtnStyle} onPress={this.goPay.bind(this)}>
                        <Text style={{color: '#ffffff', fontSize: 16}}>
                            {this.state.price > 0 ? "去支付" : '免费预约'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.mixiStyle} onPress={() => {
                        this.showMingxi();
                    }}>
                        <Image source={{uri: 'icon_mingxi'}}
                               style={{width: 16, height: 18, marginBottom: 4}}/>
                        <Text style={{color: global.params.backgroundColor, fontSize: 12, textAlign: 'center'}}>明细</Text>
                    </TouchableOpacity>
                </View>
            )
        }else return (<View />)
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                <NavBar
                    title='订单详情'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                    rightIcon="icon_kefu"
                    rightPress={this.keFu.bind(this)}
                />




                <KeyboardAwareScrollView style={{backgroundColor: '#f5f5f5', marginBottom: 50 + global.params.iPhoneXHeight}}>

                    <View style={{borderBottomColor:'rgb(222,222,222)',borderBottomWidth:1}}>
                        <View style={{flexDirection: 'row', alignItems: 'center',}}>
                            <View style={styles.topLeftIconStyle}>
                                <Text style={styles.topLeftIconTextStyle}>起</Text>
                            </View>
                            <Text style={{marginTop: 6,width:width-120}}>{this.props.res.mgService.airportName}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={[styles.topLeftIconStyle,{marginBottom:15}]}>
                                <Text style={styles.topLeftIconTextStyle}>终</Text>
                            </View>
                            <Text numberOfLines={2} style={{marginRight: 15,width:width-120}}>{this.props.res.mgService.destinationName}{this.props.res.mgService.destinationAddress}</Text>
                        </View>
                    </View>
                    <View style={{borderBottomColor:'rgb(222,222,222)',borderBottomWidth:1}}>
                        <Text style={{margin: 15,}}>{this.props.res.carSize}座车:  {this.props.res.carModel.car_models}</Text>
                        <View style={{flexDirection:'row'}}>
                            <Image source={{uri:'renzuo'}} style={{resizeMode:'stretch',marginLeft:14,marginRight:8,marginBottom:14,width:18,height:18}}/>
                            <Text>{this.props.res.carModel.car_comfort_level}</Text>
                            <Image source={{uri:'baobao'}} style={{resizeMode:'stretch',marginLeft:14,marginRight:8,marginBottom:14,width:18,height:18}}/>
                            <Text >{this.props.res.carModel.luggage_desc}</Text>
                        </View>
                        <Text style={{marginLeft:15,marginBottom: 15,}}>服务商:  {this.props.res.mgService.supplier}</Text>
                    </View>


                    {this.state.allData.map((item, i) => {
                        return (
                            <View key={i} style={styles.cellContentViewStyle}>
                                <Text style={styles.cellTitleStyle}>{item.chName}</Text>
                                <View style={styles.subViewType}>
                                    {this.rightView(item, i)}
                                </View>
                            </View>
                        );
                    })}
                    <View style={styles.tabFooterViewStyle}>
                        <Text style={[styles.footViewTextStyle, {fontSize: 15, color: 'black'}]}>预定注意事项：</Text>
                        <Text style={styles.footViewTextStyle}>
                            1、举牌接机服务费包含停车费用与司机等待费用。{'\n'}
                            2、用车前24h内的预定或订单更改需增收加急费用，不排除无车可用的情况。{'\n'}
                            <Text
                                style={[styles.footViewTextStyle, {color: 'red'}]}>3、用车前3天取消订单退还80%的费用，用车前2天取消订单将不予退还费用。{'\n'}</Text>
                            4、英国用车人数超过1人需支付人数附加费。{'\n'}
                            5、晚间10点至早晨8点为加班时间，需要额外支付费用。{'\n'}
                            6、超过免费等待时间后，需支付超时等待费用，以当地货币支付给接机司机。
                        </Text>
                    </View>
                </KeyboardAwareScrollView>
                {this.payView()}
                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{flex: 1, width: width, height: height}}>
                        <View ref='detailView' style={styles.popViewStyle}>
                            <View style={{
                                marginBottom: 10,
                                alignItems: 'center',
                                backgroundColor: '#dedede',
                                height: 44,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <Text style={{marginLeft: 15, fontSize: 14, color: '#969696'}}>费用明细</Text>
                                <TouchableOpacity style={{marginRight: 14}} onPress={() => {
                                    this.setState({isModalVisible: false})
                                }}>
                                    <Image source={{uri: 'icon_quxiao'}} style={{width: 16, height: 16}}/>
                                </TouchableOpacity>
                            </View>
                            {this.mingxiRows()}

                        </View>
                    </View>
                </Modal>
                <MessageBarAlert ref="alert"/>
            </View>
        )
    }
}

var styles = StyleSheet.create({

    rowContainer: {
        flexDirection: 'row',
        height: 44,
        alignItems: 'center',
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'space-between'
    },
    cellContentViewStyle: {
        backgroundColor: 'white',
        height: 44,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    cellTitleStyle: {
        fontSize: 15,
        color: '#2a2a2a',
        marginLeft: 14,
    },
    subViewType: {
        marginRight: 14
    },
    showTextInputStyle: {
        width: 60,
        height: 28,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: global.params.backgroundColor,
        marginLeft: 5,
        marginRight: 5,
        justifyContent: 'center'
    },
    cellTextInputStyle: {
        width: 180,
        height: 38,
        marginLeft: 30,
        textAlign: 'right',
        color: global.params.backgroundColor,
        fontSize: 14
    },
    cellYqmInputStyle: {
        width: 170,
        height: 38,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    priceAndPayViewStyle: {
        position: 'absolute',
        flexDirection: 'row',
        left: 0,
        right: 0,
        height: 50,
        bottom: global.params.iPhoneXHeight,
        borderTopWidth: 1,
        borderTopColor: '#dedede',
        backgroundColor: 'white',

    },
    payBtnStyle: {
        position: 'absolute',
        right: 0,
        top: 0,
        height: 50,
        backgroundColor: global.params.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        width: 120,
    },
    mixiStyle: {
        position: 'absolute',
        right: 120,
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    tabFooterViewStyle: {
        marginTop: 22,
        marginLeft: 14,
        marginRight: 14
    },
    footViewTextStyle: {
        color: 'rgb(144, 144, 144)',
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 1,
        marginBottom:15

    },
    popViewStyle: {
        width: width - (Platform.OS === 'ios' ? 0 : 40),
        marginLeft: Platform.OS === 'ios' ? -20 : 0,
        backgroundColor: 'white',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    topLeftIconStyle:{
        width: 44,
        height: 44,
        backgroundColor: global.params.backgroundColor,
        borderRadius: 22,
        margin: 15,
        marginBottom:0,
        justifyContent:'center',
        alignItems:'center'
    },
    topLeftIconTextStyle:{
        textAlign:'center',
        color:'white',
        fontSize:18,
        fontWeight:'bold',
    }
});