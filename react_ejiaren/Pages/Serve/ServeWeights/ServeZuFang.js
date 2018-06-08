import React, {Component} from 'react'
import {
    View,
    StatusBar,
    DeviceEventEmitter,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
    Platform,
    InteractionManager
} from 'react-native'

let {width} = Dimensions.get('window')
import {Button} from 'react-native-elements'
import ChooseCity from './ChooseCity'
import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars'

var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager
import ZufangList from './ZufangList'

var ServeApi = require('../ServeApi/ServeApi');
import JiejiError from '../ServeJieji/JiejiError'

import SubmitOrderResult from '../SubmitOrderResults'
import Alert from 'rnkit-alert-view';

LocaleConfig.locales['fr'] = {
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
};
LocaleConfig.defaultLocale = 'fr';

var starS = null, endS = null;

export default class ServeZuFang extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cityItem: null,
            showCalen: false,
            dateStyle: 0,
            dateStartStr: null,
            dateEndStr: null,
            allDay: null,
            dateError: false,
            minDate: null,

        }
    }

    backNav() {
        this.props.navigator.pop()
    }

    componentWillMount() {
        var myDate = new Date();
        var _format = function (number) {
            return (number < 10 ? ('0' + number) : number);
        };
        let getMineDate = myDate.getFullYear() + "-" + _format(myDate.getMonth() + 1) + "-" + _format(myDate.getDate());
        this.setState({minDate: getMineDate});
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        this.subscription = DeviceEventEmitter.addListener('zufang_one', (res) => {
            this.setState({
                cityItem: res,
            })
        })

        InteractionManager.runAfterInteractions(() => {
            if (this.props.item.alertMessage.length > 0) {
                setTimeout(()=>this.showAlertTips(),1500);
            }
        });
    }

    showAlertTips() {
        Alert.alert(
            '提示', this.props.item.alertMessage, [
                {text: '知道了' },
            ]
        )
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
        this.subscription.remove();
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


    formatDate(str) {
        var ar = str.split("-");
        var d = new Date(Date.parse(str)); //month月的第一天
        var week = d.getDay();
        if (new Date().getFullYear() == ar[0]) {
            return ar[1] + "月" + ar[2] + "日" + this.getWeek(week);
        } else {
            return ar[0] + "年" + ar[1] + "月" + ar[2] + "日" + this.getWeek(week);
        }
    }


    getWeek(week) {
        var str = "";
        if (week == 0) {
            str = "周日";
        } else if (week == 1) {
            str = "周一";
        } else if (week == 2) {
            str = "周二";
        } else if (week == 3) {
            str = "周三";
        } else if (week == 4) {
            str = "周四";
        } else if (week == 5) {
            str = "周五";
        } else if (week == 6) {
            str = "周六";
        }
        return "(" + str + ")";
    }

    chooseDate(day) {
        if (this.state.dateStyle === 0) {
            starS = day.dateString;
            this.setState({
                showCalen: false,
                dateStartStr: day.dateString,
            })
        } else {
            endS = day.dateString,
                this.setState({
                    showCalen: false,
                    dateEndStr: day.dateString
                })
        }
        if (starS && endS) {
            let iday = this.DateDiff(starS, endS);
            console.log('iday    ' + iday);
            if (iday < 1) {
                this.setState({
                    allDay: null,
                    dateError: true
                })
            } else {
                this.setState({
                    allDay: iday + '天',
                    dateError: false
                })
            }
        }
    }

    DateDiff(startDate, endDate) {    //sDate1和sDate2是2006-12-18格式
        var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
        var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
        var dates = parseInt((endTime - startTime)) / (1000 * 60 * 60 * 24);
        return dates;
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                    backgroundColor={global.params.backgroundColor}
                />

                <View style={{backgroundColor: 'white'}}>
                    <Image source={{uri: 'zufanghead'}} style={styles.headImageStyle}/>
                    <View style={styles.contentListViewStyle}>
                        <View style={{flexDirection: 'row'}}>
                            <Image source={{uri: 'zf_address'}} style={styles.itemImageStyle}/>
                            <TouchableOpacity activeOpacity={0.7} style={styles.contentItemStyle} onPress={() => {
                                this.props.navigator.push({
                                    component: ChooseCity,
                                })
                            }}>
                                <Text
                                    style={[styles.contentTextStyle, {color: this.state.cityItem ? 'black' : '#acacac'}]}>{
                                    this.state.cityItem ? this.state.cityItem.despname : '选择城市或学校'
                                }</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Image source={{uri: 'zf_date'}} style={styles.itemImageStyle}/>
                            <View style={styles.contentItemStyle}>
                                <TouchableOpacity activeOpacity={0.7} style={{
                                    flex: 2.5,
                                }} onPress={() => {
                                    this.setState({showCalen: true, dateStyle: 0})
                                }}>
                                    <Text
                                        style={[styles.contentTextStyle, {color: this.state.dateStartStr ? 'black' : '#acacac'}]}>
                                        {this.state.dateStartStr ? this.formatDate(this.state.dateStartStr) : '预计入住日期'}
                                    </Text>
                                </TouchableOpacity>
                                <Text style={{
                                    fontSize: 15,
                                    color: '#acacac',
                                    textAlign: 'left',
                                    flex: 1,
                                }}>{this.state.allDay ? this.state.allDay : '0天'}</Text>
                                <TouchableOpacity activeOpacity={0.7} style={{
                                    flex: 2.5
                                }} onPress={() => {
                                    this.setState({showCalen: true, dateStyle: 1})
                                }}>
                                    <Text
                                        style={[styles.contentTextStyle, {color: this.state.dateEndStr ? 'black' : '#acacac'}]}>{this.state.dateEndStr ? this.formatDate(this.state.dateEndStr) : '预计退房日期'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Button
                            buttonStyle={styles.searchBtnStyle}
                            title='开始搜索'
                            onPress={() => {
                                if (this.state.cityItem) {
                                    if (this.state.dateError) {
                                        MessageBarManager.showAlert({
                                            message: '请检查入住和退房日期',
                                            messageStyle: {
                                                color: 'white',
                                                fontSize: 13,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
                                            },
                                            alertType: 'error',
                                        });
                                    } else {
                                        console.log(this.state.cityItem);
                                        console.log('入住时间：  ' + this.state.dateStartStr);
                                        console.log('退房时间：  ' + this.state.dateEndStr);

                                        let getRid, schoolId;
                                        if (this.state.cityItem.hasOwnProperty('schoolid')) {
                                            getRid = 'schoolId';
                                            schoolId = this.state.cityItem['schoolid'];
                                        } else {
                                            getRid = 'rid';
                                            schoolId = this.state.cityItem['rid'];
                                        }

                                        console.log('参数：  ' + getRid + '      ' + schoolId);



                                        ServeApi.zufangList(getRid, schoolId).then(res => {
                                            console.log(res);
                                            let lab = res.data.label;


                                            if (res.data.list.length > 0 && !res.data.label) {
                                                this.props.navigator.push({
                                                    component: ZufangList,
                                                    params: {
                                                        sourceDic: res.data,
                                                        myid: getRid,
                                                        schoolID: schoolId,
                                                        dateStart: this.state.dateStartStr ? this.state.dateStartStr : '',
                                                        dateEnd: this.state.dateEndStr ? this.state.dateEndStr: '',
                                                        schoolName: this.state.cityItem.despname
                                                    },
                                                });
                                            } else {
                                                console.log('未找到房源');


                                                this.props.navigator.push({
                                                    component: SubmitOrderResult,
                                                    params: {
                                                        isOk: false, title: '没有找到相关的房源信息', content: '不如和我们的客服聊一聊，也许会有惊喜！',
                                                        notice: '在线没有找到您需要的服务？没关系，直接和我说说你的需求，也许会有大收获。'
                                                    }
                                                });

                                                // this.props.navigator.push({
                                                //     component: JiejiError,
                                                //     params: {
                                                //         startDate: this.state.dateStartStr,
                                                //         endDate: this.state.dateEndStr,
                                                //         schoolName: this.state.cityItem.despname
                                                //     }
                                                // });
                                            }
                                        }).catch(error => {
                                            console.log('error  ' + error);
                                        })
                                    }

                                } else {
                                    MessageBarManager.showAlert({
                                        message: '学校或城市不能为空',
                                        messageStyle: {
                                            color: 'white',
                                            fontSize: 13,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
                                        },
                                        alertType: 'error',
                                    });
                                }
                            }}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.backButtonStyle} onPress={this.backNav.bind(this)}>
                    <Image source={{uri: 'icon_back_blue'}} style={{width: 24, height: 24}}/>
                </TouchableOpacity>

                <MessageBarAlert ref="alert"/>
                {this.showCalend()}
            </View>
        )
    }
}

const styles = StyleSheet.create({

    headImageStyle: {
        width: width,
        height: 193,
    },

    backButtonStyle: {
        position: 'absolute',
        left: 15, top: global.params.iPhoneXHeight + 20,
    },

    contentListViewStyle: {
        marginLeft: 15,
        marginRight: 15,
        height: 164,
        borderRadius: 6,
    },

    contentItemStyle: {
        borderBottomColor: '#acacac',
        borderBottomWidth: 0.5,
        alignItems: 'center',
        width: width - 60,
        height: 44,
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },

    itemImageStyle: {
        width: 14,
        height: 18,
        marginLeft: 0,
        marginRight: 12,
        marginTop: 15,
    },

    contentTextStyle: {
        // color: '#acacac',
        fontSize: 14,
    },

    searchBtnStyle: {
        backgroundColor: global.params.backgroundColor,
        borderRadius: 6,
        height: 44,
        marginTop: 17,
        marginLeft: 0,
        marginRight: 0
    }
})