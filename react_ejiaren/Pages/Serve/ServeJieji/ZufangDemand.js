import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    StatusBar,
    ScrollView,
    Text,
    TouchableOpacity,
    ListView,
    Linking,
    Image,
    TextInput,
    InteractionManager,
    Platform
} from 'react-native'


import NavBar from '../../Componnet/NavBar'

let {width} = Dimensions.get('window')

import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars'

var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager
import storage from "../../RNAsyncStorage";
import SubmitOrderResult from '../SubmitOrderResults'
var JiejiApi = require('./JiejiServe/JiejiApi');


var submitObj = {}

LocaleConfig.locales['fr'] = {
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
};
LocaleConfig.defaultLocale = 'fr';

export default class ZufangDemand extends Component {
    constructor(props) {
        super(props)
        this.state = {
            headerArr: [],
            showCalen: false,
            minDate: null,
            selectRow: 0,
            userInfo: null,
            inTime: '',
            outTime: '',
            submitObj: {},
        }

        this.dataSource = [
            {
                title: '租房需求',
                item: [
                    {
                        title: '城市或学校',
                        fieldType: 1,
                        fieldName: 'school',
                        fieldPlaceHolder: '请填写城市或学校',
                        textfieldType: ''
                    },
                    {title: '入住日期', fieldType: 3, fieldName: 'inroom_time'},
                    {title: '退房日期', fieldType: 3, fieldName: 'outroom_time'},
                    {
                        title: '租房预算(元/周)',
                        fieldType: 1,
                        fieldName: 'renting_budget',
                        fieldPlaceHolder: '请填写租房预算',
                        textfieldType: 'numeric'
                    },
                ]
            },
            {
                title: '联系人信息',
                item: [
                    {
                        title: '姓名',
                        fieldType: 1,
                        fieldName: 'contact_name',
                        fieldPlaceHolder: '请填写真实姓名',
                        textfieldType: ''
                    },
                    {
                        title: '手机号',
                        fieldType: 1,
                        fieldName: 'contact_phone',
                        fieldPlaceHolder: '请填写联系手机号',
                        textfieldType: 'phone'
                    },
                    {
                        title: 'E-mail',
                        fieldType: 1,
                        fieldName: 'contact_email',
                        fieldPlaceHolder: '请填写邮箱',
                        textfieldType: 'numeric'
                    },
                    {title: '备注', fieldType: 1, fieldName: 'notice', fieldPlaceHolder: '备注信息', textfieldType: ''},
                ]
            }
        ]
    }

    back() {
        this.props.navigator.pop();
    }

    componentWillMount() {


        if(this.props.startDate && this.props.endDate){
            submitObj['inroom_time'] = this.props.startDate;
            submitObj['outroom_time'] = this.props.endDate;
            this.setState({inTime:this.props.startDate,outTime:this.props.endDate});
        }
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        InteractionManager.runAfterInteractions(() => {
            this.getUserInfo();
            var myDate = new Date();
            var _format = function (number) {
                return (number < 10 ? ('0' + number) : number);
            };
            let getMineDate = myDate.getFullYear() + "-" + _format(myDate.getMonth() + 1) + "-" + _format(myDate.getDate());
            this.setState({minDate: getMineDate});
        });
    }

    getUserInfo() {
        storage.load({
            key: 'userInfo'
        }).then(res => {
            this.setState({userInfo: res});
        }).catch(err => {
            this.setState({userInfo: null});
            console.log('未检查到用户 ' + err)
        })
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
        submitObj = {}
    }


    handleInput = (textVal, fieldName) => {
        let ss = this.state.submitObj;
        ss[fieldName] = textVal;
        this.setState({submitObj:ss});
    }


    showCalend() {
        if (this.state.showCalen) {
            return (
                <Calendar
                    style={{position: 'absolute',bottom:global.params.iPhoneXHeight,width:width,backgroundColor:'rgb(250,250,250)'}}
                    minDate={this.state.minDate ? this.state.minDate : '2018-01-01'}
                    onDayPress={day => {
                        this.chooseDate(day)
                    }}
                />
            )
        }
    }

    chooseDate(day) {

        console.log(day.dateString);
        if (this.state.selectRow === 0) {
            submitObj['inroom_time'] = day.dateString;

            this.setState({
                showCalen: false,
                inTime: day.dateString,
            })
        } else {
            submitObj['outroom_time'] = day.dateString;
            this.setState({
                showCalen: false,
                outTime: day.dateString,
            })
        }
    }

    rightView(rowData, rowID) {
        let fieldType = rowData.fieldType;

        if (fieldType === 1) {
            let keyboard = 'default'
            if (rowData.textfieldType === 'email') {
                keyboard = 'email-address'
            } else if (rowData.textfieldType === 'phone') {
                keyboard = 'numeric'
            }
            return (
                <TextInput key={rowID} placeholder={rowData.fieldPlaceHolder} placeholderTextColor='#727272'
                           style={styles.cellTextInputStyle} defaultValue={rowData.defaultValue}
                           onChangeText={(textVal) => this.handleInput(textVal, rowData.fieldName,)}
                           underlineColorAndroid='transparent'
                           keyboardType={keyboard}
                           onFocus={()=>{
                               this.setState({showCalen:false});
                           }}
                >
                </TextInput>
            )

        } else if (fieldType === 3) {
            return (
                <TouchableOpacity activeOpacity={0.8} style={styles.cellChooseStyle}
                                  onPress={() => {
                                      console.log(rowData);
                                      if (rowData.title === '入住日期') {
                                          this.setState({showCalen: true, selectRow: 0})
                                      } else {
                                          this.setState({showCalen: true, selectRow: 1})
                                      }
                                  }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#727272',
                        marginRight:8
                    }}>{rowID === 1 ? this.state.inTime : this.state.outTime}</Text>
                    <Image source={{uri: 'right_go'}} style={styles.rightRowStyle}/>
                </TouchableOpacity>
            )
        }
    }

    renderRow(rowData, rowID) {
        return (
            <View key={rowID} style={styles.cellContentViewStyle}>
                <Text style={styles.cellTitleStyle}>{rowData.title}</Text>
                <View style={styles.subViewType}>
                    {this.rightView(rowData, rowID)}
                </View>
            </View>
        );
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

    submitZufang() {

        for (var key in this.state.submitObj) {
            submitObj[key] = this.state.submitObj[key];
        }
        if (!submitObj.hasOwnProperty('school') || submitObj['school'].length < 1 ){
            this.showAlert('请输入学校');
        }else if (!submitObj.hasOwnProperty('inroom_time') || submitObj['inroom_time'].length < 1){
            this.showAlert('请选择入住日期');
        }else if (!submitObj.hasOwnProperty('outroom_time') || submitObj['outroom_time'].length < 1){
            this.showAlert('请选择退房日期');
        }else if (!submitObj.hasOwnProperty('renting_budget') || submitObj['outroom_time'].length < 1){
            this.showAlert('请输入租房预算');
        }else if (!submitObj.hasOwnProperty('contact_name') || submitObj['contact_name'].length < 1){
            this.showAlert('请输入联系人姓名');
        }else if (!submitObj.hasOwnProperty('contact_phone') || submitObj['contact_phone'].length < 1){
            this.showAlert('请输入联系人电话');
        }else if (!submitObj.hasOwnProperty('contact_email') || submitObj['contact_email'].length < 1){
            this.showAlert('请输入邮箱');
        }else {
            submitObj['access_token'] = this.state.userInfo.token;
            submitObj['id'] = 745;
            console.log(submitObj);
            JiejiApi.submitZufangDemand(submitObj).then(res=>{
                console.log(res);
                this.props.navigator.push({
                    component: SubmitOrderResult,
                    params:{isOk:true,title:'预约成功',content:'您的需求已提交，客服人员将在1-2个工作日内与您联系。',
                        notice:'如您还有任何意见或疑问，请直接拨打客服电话。'}
                });
            }).catch(error=>{
                console.log('error : ' + error);
            })
        }
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
                    title="提交租房需求"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <ScrollView style={{marginBottom: 40 + global.params.iPhoneXHeight}}>
                    {this.dataSource.map((item, i) => {
                        return (
                            <View key={i}>
                                <View
                                    style={{justifyContent: 'center', height: 36, backgroundColor: 'rgb(244,244,244)'}}>
                                    <Text style={{marginLeft: 14, fontSize: 15}}>{item.title}</Text>
                                </View>
                                {
                                    item.item.map((row, i) => {
                                        return (
                                            <View key={i}>
                                                {this.renderRow(row, i)}
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        )
                    })}

                </ScrollView>

                {this.showCalend()}

                <TouchableOpacity activeOpacity={0.8} style={[styles.footerBtnStyle]}
                                  onPress={this.submitZufang.bind(this)}
                >
                    <Text style={{fontSize: 17, color: 'white'}}>提交</Text>
                </TouchableOpacity>
                <MessageBarAlert ref="alert"/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
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
        marginLeft: 30,
        textAlign: 'right',
        color: global.params.backgroundColor,
        fontSize: 14
    },
    rightRowStyle: {
        width: 8,
        height: 14,
        marginRight: 15,
    },
    cellChooseStyle: {
        flexDirection: 'row',
        width: width - 80,
        justifyContent: 'flex-end'
    },
    footerBtnStyle: {
        position: 'absolute',
        bottom: global.params.iPhoneXHeight,
        height: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: global.params.backgroundColor
    }
})