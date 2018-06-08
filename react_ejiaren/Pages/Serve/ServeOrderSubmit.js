import React, {Component} from 'react'
import {
    View,
    ListView,
    StyleSheet,
    Dimensions,
    StatusBar,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Platform,
    DeviceEventEmitter,
    Linking,
    Keyboard
} from 'react-native'


import NavBar from '../Componnet/NavBar'

let {width, height} = Dimensions.get('window');
import {Navigator} from 'react-native-deprecated-custom-components'

var GetDataApi = require('../Service/getData');
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import {CachedImage} from 'react-native-img-cache';
import Kd from './ServeList/ChooseCountries_kuaidi'
import OrderPay from './OrderPay'

var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import Modal from 'react-native-modal'

var arrCount = 0;
var submitObj = {};
var inputValeu = {};
import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars'
import Coupon from '../Mine/MineOtherPages/MyCoupons'
import OrderSuccessfulPage from "./OrderSuccessfulPage";

LocaleConfig.locales['fr'] = {
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
};
LocaleConfig.defaultLocale = 'fr';

export default class ServeOrderSubmit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: ds.cloneWithRows([]),
            allSource: [],
            notices: '',
            price: 0.00,
            num: '1',
            teacherName: '',
            kuaidiName: null,
            hiddenJianImage: true,
            kefuPhone: '021-61984772',
            danjia: 0.00,
            isModalVisible: false,
            expenseDetail: [],
            chooseTimer: null,
            minDate: null,
            showCalen: false,
            keybordShow: true,
            submitObj: {},
        };
    }

    back() {
        this.props.navigator.pop()
    }


    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        this.choose_kuaidi = DeviceEventEmitter.addListener('choose_kuaidi', (item) => {
            submitObj['sending_country'] = item.value;
            let allPrice = parseFloat(item.key) * parseInt(this.state.num);
            this.setState({price: allPrice, kuaidiName: item.value, danjia: item.key})
        });

        this.getConpone = DeviceEventEmitter.addListener('getConpone', (conponeCode) => {
            setTimeout(() => this.orderPayInfo(conponeCode), 500);
        });


    }

    dissmissKeyboard() {
        Keyboard.dismiss();

    }

    showCalend() {
        if (this.state.showCalen) {
            return (
                <Calendar
                    style={{
                        position: 'absolute',
                        bottom: global.params.iPhoneXHeight,
                        width: width,
                        backgroundColor: 'rgb(250,250,250)'
                    }}
                    minDate={this.state.minDate ? this.state.minDate : '2018-01-01'}
                    onDayPress={day => {
                        this.chooseDate(day)
                    }}
                />
            )
        }
    }

    chooseDate(day) {
        submitObj['at_time'] = day.dateString;
        this.setState({
            showCalen: false,
            chooseTimer: day.dateString,
        })
    }

    componentWillUnmount() {
        this.choose_kuaidi.remove();
        this.getConpone.remove();
        MessageBarManager.unregisterMessageBar();
        arrCount = 0;
        submitObj = {};
        inputValeu = {};
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentWillMount() {
        this.getOrderKefuPhone();
        this.getSubmitOrderList();
        let priceF = parseFloat(this.props.order.rmbPrice);
        this.setState({
            price: priceF,
            danjia: priceF,
        });

        var myDate = new Date();
        myDate.setDate(myDate.getDate() + 3);


        var _format = function (number) {
            return (number < 10 ? ('0' + number) : number);
        };
        let getMineDate = myDate.getFullYear() + "-" + _format(myDate.getMonth() + 1) + "-" + _format(myDate.getDate());
        this.setState({minDate: getMineDate});

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            this.setState({keybordShow: false})
        });
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            this.setState({keybordShow: true})
        });
    }


    buildbuttombar() {
        if (this.state.keybordShow) {
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
                    <TouchableOpacity activeOpacity={0.8} style={styles.mixiStyle} onPress={this.showMingxi.bind(this)}>
                        <Image source={{uri: 'icon_mingxi'}}
                               style={{width: 16, height: 18, marginBottom: 4}}/>
                        <Text
                            style={{color: global.params.backgroundColor, fontSize: 12, textAlign: 'center'}}>明细</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return null
        }
    }

    getOrderKefuPhone() {
        GetDataApi.getOrderKefuPhone(this.props.order.id, this.props.userInfo.token).then(res => {
            console.log('客服电话:' + res);
            this.setState({kefuPhone: res[0]});
        }).catch(err => {

        })
    }

    getSubmitOrderList() {
        GetDataApi.getSubmitOrderList(this.props.order.id, this.props.userInfo.token).then(res => {
            let fields = res.fields;
            fields.splice(0, 0, {});
            fields.splice(fields.length, 0, {});
            arrCount = fields.length - 1;
            this.setState({dataSource: ds.cloneWithRows(fields), notices: res.notices, allSource: fields});
            fields.map(item => {
                if (item.textfieldType === 'yqm' && item.defaultValue.length > 0) {
                    GetDataApi.getYqm(item.defaultValue, this.props.userInfo.token).then(res => {
                        console.log(res);
                        if (res.states === 'true') {
                            this.setState({teacherName: res.name});
                        }
                    }).catch(err => {
                        console.log('error:  ' + err);
                    })
                }
            })
        }).catch(err => {
            console.log('error:   ' + err);
        })
    }

    renderRow(rowData, sectionID, rowID) {
        if (parseInt(rowID) === 0) {
            return (
                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <CachedImage source={{uri: this.props.order.thumb_pic}}
                                 style={{margin: 10, width: 110, height: 90}}/>
                    <View style={{width: width - 140}}>
                        <Text style={{color: 'black', fontSize: 15}}>{this.props.order.title}</Text>
                    </View>
                </View>
            )
        } else if (parseInt(rowID) === arrCount) {
            return (
                <View style={styles.tabFooterViewStyle}>
                    <Text style={styles.footViewText1Style}>温馨提示：</Text>
                    <Text style={styles.footViewText2Style}>点击去支付表示你已阅读并同意服务预定须知及重要条款；</Text>
                    <Text style={styles.footViewText3Style}>{this.state.notices}</Text>
                </View>
            )
        }

        return (
            <View style={styles.cellContentViewStyle}>
                <Text style={styles.cellTitleStyle}>{rowData.chName}</Text>
                <View style={styles.subViewType}>
                    {this.rightView(rowData, rowID)}
                </View>
            </View>
        );
    }


    handleInput = (textVal, fieldName, type) => {
        let ss = this.state.submitObj;
        ss[fieldName] = textVal;
        this.setState({submitObj:ss});

        if (type === 'yqm') {
            GetDataApi.getYqm(textVal, this.props.userInfo.token).then(res => {
                console.log(res);
                if (res.states === 'true') {
                    this.setState({teacherName: res.name});
                } else {
                    this.setState({teacherName: ''});
                }
                inputValeu[fieldName] = textVal;
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
                                   style={{
                                       color: global.params.backgroundColor,
                                       fontSize: 14,
                                       width: 70,
                                       height: 38,
                                       textAlign: 'right'
                                   }}
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
                               onChangeText={(textVal) => this.handleInput(textVal, rowData.fieldName)}
                               underlineColorAndroid='transparent'
                               keyboardType={keyboard}
                    >
                    </TextInput>
                )
            }
        } else if (fieldType === 3) {
            return (
                <TouchableOpacity activeOpacity={1} style={styles.cellChooseStyle}
                                  onPress={this.countries.bind(this, rowData)}>
                    <Text style={{
                        fontSize: 14,
                        color: '#727272'
                    }}>{this.state.kuaidiName ? this.state.kuaidiName : rowData.fieldPlaceHolder}</Text>
                    <Image source={{uri: 'right_go'}} style={styles.rightRowStyle}/>
                </TouchableOpacity>
            )
        } else if (fieldType === 6) {
            return (
                <View style={{flexDirection: 'row'}}>
                    {this.hiddenJianImage()}
                    <View style={styles.showTextInputStyle}>
                        <Text
                            style={{textAlign: 'center', color: global.params.backgroundColor}}>{this.state.num} </Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} style={styles.addStyle} onPress={() => {
                        let numN = parseInt(this.state.num);
                        numN++;
                        let allPrice = parseFloat(this.state.danjia) * numN;
                        this.setState({price: allPrice, num: numN + '', hiddenJianImage: false});
                    }}>
                        <Image style={{width: 14, height: 14}} source={{uri: 'icon_add'}}/>
                    </TouchableOpacity>
                </View>
            )
        } else if (fieldType === 4) {
            return (
                <TouchableOpacity activeOpacity={1} style={styles.cellChooseStyle}
                                  onPress={this.chooseTimer.bind(this, rowID)}>
                    <Text style={{
                        fontSize: 14,
                        color: '#727272'
                    }}>{this.state.chooseTimer ? this.state.chooseTimer : rowData.fieldPlaceHolder}</Text>
                    <Image source={{uri: 'right_go'}} style={styles.rightRowStyle}/>
                </TouchableOpacity>
            )
        }
    }

    chooseTimer(rowId) {
        this.setState({showCalen: true})
    }

    hiddenJianImage() {
        if (this.state.hiddenJianImage === false) {
            return (
                <TouchableOpacity activeOpacity={0.7} style={styles.subStyle} onPress={() => {
                    let numN = parseInt(this.state.num);
                    numN--;
                    if (numN <= 1) {
                        numN = 1;
                        this.setState({hiddenJianImage: true});
                    }
                    let allPrice = parseFloat(this.state.danjia) * numN;
                    this.setState({num: numN + '', price: allPrice});
                }}>
                    <Image style={{width: 16, height: 2}} source={{uri: 'icon_jian_normal'}}/>
                </TouchableOpacity>
            )
        }
    }


    countries(rowData) {
        if (rowData.droplist.length > 0) {
            this.props.navigator.push({
                component: Kd,
                params: {items: rowData.droplist},
            })
        }
    }

    goPay() {

        for (var key in this.state.submitObj) {
            submitObj[key] = this.state.submitObj[key];
        }

        submitObj.num = this.state.num;

        console.log(submitObj);


        for (let j = 0, len = this.state.allSource.length; j < len; j++) {
            let item = this.state.allSource[j];
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

        let class_id = parseInt(this.props.order.class_id);

        let priceFloat = parseFloat(this.state.price);
        let serveId = this.props.order.id;
        submitObj['price'] = priceFloat;
        submitObj['id'] = this.props.order.id;
        submitObj['access_token'] = this.props.userInfo.token;
        submitObj['ognz_id'] = global.params.OgnzId;

        if(JSON.stringify(inputValeu) !== "{}"){
            for (var key in inputValeu) {
                submitObj[key] = inputValeu[key];
            }
        }
        console.log(submitObj);

        var sId = 2;
        if (serveId === 462) {
            //国际快递
            sId = 5;
        } else if (serveId === 275) {
            //自助服务
            sId = 4;
        }
        if (class_id === 8) {
            sId = 8
        } else if (class_id === 7) {
            sId = 7;
        }

        GetDataApi.getCheckUserCode(sId, priceFloat, this.props.userInfo.token).then(res => {
            console.log(res);
            if (res.length < 1) {
                this.orderPayInfo();
            } else {
                console.log('你有优惠券可以使用,跳转到优惠券界面');
                this.props.navigator.push({
                    sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                    component: Coupon,
                    params: {sourceList: res},
                })
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
        console.log(submitObj);
        GetDataApi.submitOrder(submitObj, this.props.order.id).then(res => {
            console.log(res);
            var order_status = parseInt(res.order_status);
            if (order_status === 1 || order_status === 6) {
                this.props.navigator.push({
                    component: OrderSuccessfulPage,
                    params: {orderInfo: res, userInfo: this.props.userInfo},
                })
            } else {
                this.props.navigator.push({
                    sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                    component: OrderPay,
                    params: {orderInfo: res, userInfo: this.props.userInfo},
                })
            }
        }).catch(error => {
            console.log('error   ' + error);
        })
    }


    keFu() {
        console.log(this.state.kefuPhone);
        let url = 'tel: ' + this.state.kefuPhone;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    showMingxi() {
        console.log('查看明细');
        GetDataApi.getSubmitOrderDetail(this.props.order.id, this.props.userInfo.token, this.state.num, submitObj['sending_country']).then(res => {
            console.log(res.priceList);
            this.setState({isModalVisible: true, expenseDetail: res.priceList}, () => {
                this.getPriceDetail(res);
            });
        }).catch(error => {
            console.log('error  ' + error);
        })
    }

    getPriceDetail(res) {
        let rest = res.priceList;
        let viewHeiht = Platform.OS === 'ios' ? 220 : 260;
        this.refs.detailView.setNativeProps({
            style: {
                height: 42 * rest.length + 200,
                // marginTop:height - (42 * rest.length + viewHeiht)
            }
        })
    }

    mingxiRows() {
        let allPrice = 0.00;
        for (let j = 0, len = this.state.expenseDetail.length; j < len; j++) {
            let obj = this.state.expenseDetail[j];
            allPrice += parseFloat(obj.totalprice);
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
                                <Text style={{marginLeft: 15, fontSize: 15, color: '#969696'}}>{item.priceName}</Text>
                                <Text
                                    style={{marginRight: 15, fontSize: 13, color: '#969696'}}>￥{item.totalprice}</Text>
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
            <View style={{flex: 1, backgroundColor: "white"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                <NavBar
                    title="提交订单"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                    rightIcon="icon_kefu"
                    rightPress={this.keFu.bind(this)}
                />
                <ListView
                    style={{backgroundColor: '#f5f5f5'}}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    enableEmptySections={true}
                />


                {this.buildbuttombar()}
                <MessageBarAlert ref="alert"/>

                {this.showCalend()}

                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{flex: 1, width: width, height: height, padding: 0}}>
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

            </View>
        )
    }
}

var styles = StyleSheet.create({

    popViewStyle: {
        position: 'absolute',
        left: -20,
        width: width,
        bottom: 0,
        backgroundColor: 'white',
        padding: Platform.OS === 'ios' ? 0 : 15,
    },

    popContentViewStyle: {
        position: 'absolute',
        bottom: 20,
        height: 40,
        left: 14,
        right: 14,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: global.params.backgroundColor
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

    tabHeadViewStyle: {
        backgroundColor: 'white',
        height: 96,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 10,
        flexDirection: 'row',
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
    orderHeaderImageStyle: {
        marginLeft: 14,
        marginTop: 10,
        marginBottom: 10,
        width: 80,
        borderRadius: 2
    },
    headContentViewStyle: {
        marginLeft: 14,
        marginRight: 14
    },
    tabFooterViewStyle: {
        backgroundColor: 'white',
        marginBottom: global.params.iPhoneXHeight,
    },
    footViewText1Style: {
        marginTop: 11,
        color: '#969696',
        fontSize: 12,
        marginBottom: 10,
        marginLeft: 14
    },
    footViewText2Style: {
        color: '#b2b2b2',
        fontSize: 11,
        marginBottom: 8,
        marginLeft: 14
    },
    footViewText3Style: {
        color: global.params.backgroundColor,
        fontSize: 11,
        marginBottom: 11,
        marginLeft: 14
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

    cellChooseStyle: {
        flexDirection: 'row',

    },
    rightRowStyle: {
        width: 8,
        height: 14,
        marginLeft: 8,
    },
    subStyle: {
        width: 34,
        height: 28,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: global.params.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center'
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
    addStyle: {
        width: 34,
        height: 28,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: global.params.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center'
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
    }
})