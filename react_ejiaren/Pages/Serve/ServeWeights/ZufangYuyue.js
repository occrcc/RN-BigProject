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


import NavBar from '../../Componnet/NavBar';

let {width} = Dimensions.get('window');

import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars'

var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager
import storage from "../../RNAsyncStorage";
import SubmitOrderResult from '../SubmitOrderResults'

var ServeApi = require('../ServeApi/ServeApi')

LocaleConfig.locales['fr'] = {
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
};
LocaleConfig.defaultLocale = 'fr';
var submitObj = {}

export default class ZufangYuyue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            headerArr: [],
            showCalen: false,
            dateEndStr: props.dateEnd,
            dateStartStr: props.dateStart,
            sku: props.sku,
            minDate: null,
            selectRow: 0,
            userInfo: null,
            submitObj: {},
        }

        this.dataSource = [
            {
                fieldName: 'inroom_time',
                fieldType: 3,
                title: '入住日期',
                textfieldType: '',
                fieldPlaceHolder: '请选择入住日期',
                defaultValue: props.dateStart
            },
            {
                fieldName: 'outroom_time',
                fieldType: 3,
                title: '退房日期',
                textfieldType: '',
                fieldPlaceHolder: '请选择退房日期',
                defaultValue: props.dateEnd
            },
            {
                fieldName: 'contact_name',
                fieldType: 1,
                title: '联系人姓名',
                textfieldType: 'default',
                fieldPlaceHolder: '请填写联系人姓名',
                defaultValue: ''
            },
            {
                fieldName: 'contact_phone',
                fieldType: 1,
                title: '联系电话',
                textfieldType: 'phone',
                fieldPlaceHolder: '请填写联系人电话',
                defaultValue: ''
            },
            {
                fieldName: 'contact_email',
                fieldType: 1,
                title: '邮箱',
                textfieldType: 'email',
                fieldPlaceHolder: '请填写联系人邮箱',
                defaultValue: ''
            },
            {
                fieldName: 'school',
                fieldType: 1,
                title: '城市或学校',
                textfieldType: 'default',
                fieldPlaceHolder: '请填写学校',
                defaultValue: props.schoolName
            },
            {
                fieldName: 'notice',
                fieldType: 1,
                title: '备注',
                textfieldType: 'default',
                fieldPlaceHolder: '如有其它信息请填写',
                defaultValue: ''
            },
            {
                fieldName: 'ydfy',
                fieldType: 1,
                title: '预约房源',
                textfieldType: 'default',
                fieldPlaceHolder: '系统默认',
                defaultValue: props.sku
            }
        ]
    }

    back() {
        this.props.navigator.pop();
    }

    componentWillMount(){
        submitObj['school'] = this.props.schoolName;
        submitObj['ydfy'] = this.props.sku;
        submitObj['id'] = 725
        submitObj['from'] = Platform.OS === 'ios'?0:3
        submitObj['inroom_time'] = this.props.dateStart
        submitObj['outroom_time'] = this.props.dateEnd
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

    keFu() {
        let url = 'tel: 021-61984772';
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    handleInput = (textVal, fieldName) => {
        let ss = this.state.submitObj;
        ss[fieldName] = textVal;
        this.setState({submitObj:ss});
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
                           onChangeText={(textVal) => this.handleInput(textVal, rowData.fieldName)}
                           underlineColorAndroid='transparent'
                           keyboardType={keyboard}
                           onFocus={()=>{
                               this.setState({showCalen:false});
                           }}
                >
                </TextInput>
            )
        }
    }

    showCalend() {
        if (this.state.showCalen) {
            return (
                <Calendar
                    style={{position: 'absolute',bottom:global.params.iPhoneXHeight,width:width,backgroundColor:'rgb(250,250,250)'}}
                    minDate={this.state.minDate ? this.state.minDate : '2018-01-01'}
                    onDayPress={day => {
                        if (this.state.selectRow === 0) {
                            this.setState({
                                dateStartStr: day.dateString,
                                showCalen: false,
                            })
                        } else if (this.state.selectRow === 1) {

                            submitObj['outroom_time'] = day.dateString;
                            this.setState({
                                dateEndStr: day.dateString,
                                showCalen: false

                            })
                        }
                    }}
                />
            )
        }
    }

    submitYuyue() {
        for (var key in this.state.submitObj) {
            submitObj[key] = this.state.submitObj[key];
        }

        if (this.state.dateStartStr.length > 0) {
            submitObj['inroom_time'] = this.state.dateStartStr;
        }

        if (this.state.dateEndStr.length > 0) {
            submitObj['outroom_time'] = this.state.dateEndStr;
        }

        if (this.state.userInfo) {
            submitObj['access_token'] = this.state.userInfo.token;
        }

        console.log(submitObj);


        for (let j = 0, len = this.dataSource.length; j < len; j++) {
            let item = this.dataSource[j];
            let key = item.fieldName;
            if (key !== 'notice' && submitObj[key].length < 1) {
                MessageBarManager.showAlert({
                    message: item.title + '不能为空',
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
        console.log(submitObj);
        submitObj['from'] = Platform.OS === 'ios' ? 0 : 3;
        ServeApi.submitZufangInfo(submitObj).then(res => {
            console.log(res);
            this.props.navigator.push({
                component: SubmitOrderResult,
                params: {
                    isOk: true, title: '预约成功', content: '您的订单已提交，客服人员将在1-2个工作日内与您联系。',
                    notice: '如您还有任何意见或疑问，请直接拨打客服电话。',
                    popToTop:true
                }
            });
        }).catch(err => {
            console.log('err:  ' + err);
        })
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
                    title="预约咨询"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                    rightIcon="icon_kefu"
                    rightPress={this.keFu.bind(this)}
                />
                <ScrollView>
                    {this.dataSource.map((item, i) => {
                        submitObj[item.fieldName] = item.defaultValue;
                        if (i === 0 || i === 1) {
                            return (
                                <TouchableOpacity key={i} activeOpacity={0.8} style={styles.cellContentViewStyle}
                                                  onPress={() => {
                                                      this.setState({selectRow: i, showCalen: true})
                                                  }}>
                                    <Text style={styles.cellTitleStyle}>{item.title}</Text>
                                    <View style={styles.subViewType}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: '#727272'
                                        }}>{i === 0 ? this.state.dateStartStr : this.state.dateEndStr}</Text>
                                        <Image source={{uri: 'right_go'}} style={styles.rightRowStyle}/>
                                    </View>
                                </TouchableOpacity>)
                        } else return (
                            <View key={i} style={styles.cellContentViewStyle}>
                                <Text style={styles.cellTitleStyle}>{item.title}</Text>
                                <View style={styles.subViewType}>
                                    {this.rightView(item, i)}
                                </View>
                            </View>
                        )
                    })}

                </ScrollView>
                <View style={{height: global.params.iPhoneXHeight}}/>

                <TouchableOpacity activeOpacity={0.8} style={styles.footBtnStyle} onPress={this.submitYuyue.bind(this)}>
                    <Text style={{fontSize: 15, color: 'white', fontWeight: 'bold'}}>提交</Text>
                </TouchableOpacity>
                <MessageBarAlert ref="alert"/>

                {this.showCalend()}
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
        marginRight: 14,
        flexDirection: 'row'
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
        marginLeft: 8,
    },
    footBtnStyle: {
        position: 'absolute',
        bottom: global.params.iPhoneXHeight,
        left: 0,
        right: 0,
        height: 44,
        backgroundColor: global.params.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center'
    }
})