import React, {Component} from 'react'
import {
    StatusBar,
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    Text,
    TextInput,
    DeviceEventEmitter,
    InteractionManager,
    Platform

} from 'react-native'

import NavBar from '../../Componnet/NavBar'
let {width} = Dimensions.get('window')
import ActionSheet from 'react-native-actionsheet'
var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import DatePicker from 'react-native-datepicker'

const CANCEL_INDEX = 0
var ServeApi = require('../ServeApi/ServeApi')
import _ from 'lodash'
import VisaHtm from './VisaHtml'
import VisaFillPeople from './VisaFillPeople'
import Alert from 'rnkit-alert-view';

var currencys = [];
var submitObj = {};
export default class VisaFillCurrency extends Component {
    constructor(props) {
        super(props)
        this.state = {
            danwei:'请选择货币单位',
            currency:['Cancel'],
            showDate:'2018-01-01',
            minDate:'2018-01-01',
            short_name:'其它币',
        }
        this.handlePress = this.handlePress.bind(this)
        this.showActionSheet = this.showActionSheet.bind(this)
    }

    showActionSheet() {
        this.ActionSheet.show()
    }

    handlePress(i) {
        if (i === 0){
        }else {
            let selectItem = currencys[i-1];
            submitObj['currencyId'] = selectItem.id;
            let name = selectItem.name + ' ' + selectItem.short_name;
            this.setState({danwei:name})
            if (selectItem.name === '人民币') {
                this.setState({short_name:'人民币'})
            }else{
                this.setState({short_name:'其它币'})
            }
        }
    }

    back() {
        this.props.navigator.pop();
    }

    componentWillMount() {
        submitObj = _.cloneDeep(this.props.item);
        let getMineDate = this.setMinDate(true);
        this.setState({minDate:getMineDate,showDate:getMineDate});
        submitObj['attime'] = getMineDate;
    }

    setMinDate(isHours){
        var myDate = new Date();
        let hours = myDate.getHours();

        let addDay = 0;
        if (isHours && hours > 17){
            addDay = 1;
        }

        myDate.setDate(myDate.getDate() + addDay);
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var _format = function (number) {
            return (number < 10 ? ('0' + number) : number);
        };
        let getMineDate = myDate.getFullYear() + "-" + _format(month) + "-" + _format(day);
        return getMineDate;
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        InteractionManager.runAfterInteractions(()=>{
            this.getListCurrency();
        })
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
        currencys = [];
        submitObj = {}
    }

    getListCurrency(){

        ServeApi.getListCurrency(this.props.item.countryid).then(res=>{
            currencys = res;
            let names = this.state.currency;
            for (let i = 0; i< res.length;i++){
                let item = res[i];
                let name = item.name + ' ' + item.short_name;
                names.push(name);
            }
            this.setState({currency:names});
        }).catch(error=>{
            console.log('error:  '+ error);
        })
    }

    showAlert(message){
        MessageBarManager.showAlert({
            alertType: 'error',
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

    next(){

        if (!submitObj.hasOwnProperty('currencyId') || submitObj['currencyId'].length < 1 ){
            this.showAlert('请选择货币单位');

        }else if (!submitObj.hasOwnProperty('amount') || submitObj['amount'].length < 1){
            this.showAlert('请输入金额');
        }else{

            let getMineDate = this.setMinDate(false);
            if (getMineDate === submitObj['attime'] ){
                Alert.alert(
                    '注意', '若需今日由我们完成代缴费，' +
                    '您/您的留学负责老师需在当日17点前提交完整的付费信息，' +
                    '如超时未收到资料，则将款项扣除1%的手续费后退回您的余额账户。',
                    [
                        {text: '知道了', onPress: () => this.senderInfo()},
                    ],
                );

            }else {
                this.senderInfo();
            }
        }
    }

    senderInfo () {
        ServeApi.visaGetPrice(submitObj['currencyId'],submitObj['amount']).then(res=>{
            let price = parseFloat(res.totalprice);

            console.log('price:',price, this.state.short_name );

            if (price < 2000 && this.state.short_name === '其它币'){
                this.showAlert('仅可提交金额在￥2000元以上的订单');
            }else if (price > 60000){
                this.showAlert('支付金额超过外管局在线境外付费限额，建议您可以通过我们的“银联汇款”服务进行大额电汇。');
            }else {
                submitObj['result'] = res;
                this.props.navigator.push({
                    component: VisaFillPeople,
                    params: {submitObj:submitObj},
                })
            }
        }).catch(error=>{
        })
    }

    dateRightView() {
        return (
            <DatePicker
                style={{ width: 160, justifyContent: 'flex-end', alignItems: 'flex-end', }}
                date={this.state.showDate}
                mode="date"
                minDate={this.state.minDate}
                confirmBtnText="确定"
                cancelBtnText="取消"
                customStyles={{
                    dateIcon: {
                        width: 0,
                        height: 0,
                        marginBottom: 0
                    },
                    dateInput: {
                        borderWidth: 0,
                        alignItems: 'flex-end',
                    },
                    dateText:{
                        fontSize: 14,
                        color: '#727272'
                    }
                }}
                hideText={false}  //不显示日期文本
                onDateChange={(datetime) => { this.changeDate(datetime)}}
            />
        )
    }

    changeDate(date){
        submitObj['attime'] = date;
        this.setState({showDate:date});
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
                    title='VISA支付'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <View style={styles.headTitleStyle}>
                    <Text style={{marginLeft:14,fontSize:15,color:'black',fontWeight:'bold'}}>STEP2 选择付费金额</Text>
                </View>
                <View style={{marginTop:15}}>
                    <View style={styles.cellContentViewStyle}>
                        <Text style={styles.cellTitleStyle}>货币单位</Text>
                        <View style={styles.subViewType}>
                            <TouchableOpacity activeOpacity={1} style={styles.cellChooseStyle}
                                              onPress={this.showActionSheet}>
                                <Text style={{
                                    fontSize: 14,
                                    color: '#727272'
                                }}>{this.state.danwei}</Text>
                                <Image source={{uri: 'right_go'}} style={styles.rightRowStyle}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.cellContentViewStyle}>
                        <Text style={styles.cellTitleStyle}>金额</Text>
                        <TextInput placeholder='请输入金额' placeholderTextColor='#727272'
                                   style={styles.cellTextInputStyle}
                                   onChangeText={(textVal) => {
                                       submitObj['amount'] = textVal;
                                   }}
                                   returnKeyType={'done'}
                                   underlineColorAndroid='transparent'
                                   keyboardType='numeric'
                                   // keyboardType='numeric'
                        >
                        </TextInput>
                    </View>
                    <TouchableOpacity activeOpacity={0.8}  style={styles.cellContentViewStyle}
                                      >
                        <View>
                            <Text style={styles.cellTitleStyle}>缴费截止时间</Text>
                        </View>
                        <View style={{flexDirection:'row',marginRight:15,alignItems:'center'}}>
                            {this.dateRightView()}
                            <Image source={{uri: 'right_go'}} style={styles.rightRowStyle}/>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.footerViewStyle}>
                    <TouchableOpacity activeOpacity={0.8} style={[styles.footerBtnStyle,{backgroundColor:'rgb(240,143,43)'}]}
                                      onPress={()=>{
                                          this.props.navigator.push({
                                              component: VisaHtm,
                                          })
                                      }}
                    >
                        <Text style={{fontSize:15,color:'white'}}>使用须知</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={[styles.footerBtnStyle,{backgroundColor:global.params.backgroundColor}]}
                                      onPress={this.next.bind(this)}
                    >
                        <Text style={{fontSize:17,color:'white'}}>下一步</Text>
                    </TouchableOpacity>
                </View>

                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={''}
                    options={this.state.currency}
                    cancelButtonIndex={CANCEL_INDEX}
                    onPress={this.handlePress}
                />
                <MessageBarAlert ref="alert"/>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    headTitleStyle:{
        height:46,
        backgroundColor:'white',
        justifyContent:'center',
    },
    cellChooseStyle: {
        flexDirection: 'row',
    },
    rightRowStyle: {
        width: 8,
        height: 14,
        marginLeft: 8,
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
    cellTextInputStyle: {
        width: 180,
        height: 38,
        marginRight: 15,
        textAlign: 'right',
        color: global.params.backgroundColor,
        fontSize: 14
    },

    footerViewStyle:{
        position: 'absolute',
        left: 0,
        right: 0,
        height: 88,
        bottom: global.params.iPhoneXHeight,
        backgroundColor: 'white',
    },
    footerBtnStyle:{
        justifyContent:'center',
        alignItems:'center',
        height:44
    },
})