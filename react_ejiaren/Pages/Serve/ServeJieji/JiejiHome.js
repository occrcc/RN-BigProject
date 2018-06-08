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
    ScrollView,
    InteractionManager,
} from 'react-native'

let {width, height} = Dimensions.get('window')

var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager

var JiejiApi = require('./JiejiServe/JiejiApi');
import ChooseSchoolVC from "../../Mine/MineOtherPages/ChooseSchoolVC";
import Swiper from 'react-native-swiper';
import DatePicker from 'react-native-datepicker'
import ChooseAirport from './ChooseAirport'

import Picker from 'react-native-picker';
import Alert from 'rnkit-alert-view';

import CarList from './JiejiCarList'
import SubmitOrderResult from '../SubmitOrderResults'
import { Card, ListItem, Button } from 'react-native-elements'

var submitObj = {}
var cardHight = (height - (width-40) * 1.2)/2.0;
var cardWidth = (width-40) ;


export default class JiejiHome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPage: 0,
            showBaseView: false,
            showDate: '2018-01-01 00:00',
            minDate: '2018-01-01 00:00',
            source: ['', '', ''],
            isPickerVisible: true,
        }

        this.dataSource = [
            ['icon_jichang', '接机机场'],
            ['icon_mudidi', '目的地学校'],
            ['icon_renshu', '人数'],
            ['icon_shijian', '到达时间'],
        ]

        this._showTimePicker = this._showTimePicker.bind(this)
    }

    backNav() {
        this.props.navigator.pop()
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            var myDate = new Date();
            myDate.setDate(myDate.getDate() + 3);
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var _format = function (number) {
                return (number < 10 ? ('0' + number) : number);
            };
            let getMineDate = myDate.getFullYear() + "-" + _format(month) + "-" + _format(day);
            this.setState({minDate: getMineDate, showDate: getMineDate});
            submitObj['attime'] = getMineDate + ' ' + '12:00';
            submitObj['access_token'] = this.props.userInfo.token;
        })
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        this.chooseAirport = DeviceEventEmitter.addListener('chooseAirport', (res) => {
            submitObj['airportid'] = res.id;
            submitObj['countryId'] = res.countryId;

            let airportName = res.countryName + ' ' + res.airport;
            let arr = this.state.source;
            arr[0] = airportName;
            this.setState({
                source: arr,
            })
        })
        this.chooseSchool = DeviceEventEmitter.addListener('chooseSchool', (res) => {
            submitObj['destination'] = res.id;
            let airportName = res.countryName + ' ' + res.name;
            let arr = this.state.source;
            arr[1] = airportName;
            this.setState({
                source: arr,
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
            ],
        );
    }


    componentWillUnmount() {
        submitObj = {};
        MessageBarManager.unregisterMessageBar();
        this.chooseSchool.remove();
        this.chooseAirport.remove();
    }


    showAlert(message) {
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

    jiejiSearch() {

        if (!submitObj.hasOwnProperty('airportid') || submitObj['airportid'].length < 1) {
            this.showAlert('请选择接机机场');
            return;
        } else if (!submitObj.hasOwnProperty('destination') || submitObj['destination'].length < 1) {
            this.showAlert('请选择目的地学校');
            return;
        } else if (!submitObj.hasOwnProperty('people') || submitObj['people'].length < 1) {
            this.showAlert('请选择出行人数');
            return;
        }
        console.log(submitObj);

        JiejiApi.getJiejiSearchList(submitObj).then(res => {

            console.log(res);

            if (res.length > 0) {
                this.props.navigator.push({
                    component: CarList,
                    params: {submitObj: submitObj, carList: res},
                })
            } else {
                this.props.navigator.push({
                    component: SubmitOrderResult,
                    params: {
                        isOk: false, title: '没有找到相关的接机服务', content: '不如和我们的客服聊一聊，也许会有惊喜！',
                        notice: '在线没有找到您需要的服务？没关系，直接和我说说你的需求，也许会有大收获。'
                    }
                });
            }
        }).catch(error => {
            console.log('err: ' + error);
            this.props.navigator.push({
                component: SubmitOrderResult,
                params: {
                    isOk: false, title: '没有找到相关的接机服务', content: '不如和我们的客服聊一聊，也许会有惊喜！',
                    notice: '在线没有找到您需要的服务？没关系，直接和我说说你的需求，也许会有大收获。'
                }
            });
        })

    }


    changeDate(date) {
        console.log(date);
        submitObj['attime'] = date;
        this.setState({showDate: date});
    }

    dateRightView() {
        return (
            <DatePicker
                style={{justifyContent: 'flex-end', alignItems: 'flex-end',}}
                date={this.state.showDate}
                mode="datetime"
                format="YYYY-MM-DD HH:mm"
                minDate={this.state.minDate}
                confirmBtnText="确定"
                cancelBtnText="取消"
                is24Hour={true}
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
                    dateText: {
                        fontSize: 14,
                        color: '#727272'
                    }
                }}
                hideText={false}  //不显示日期文本
                onDateChange={(datetime) => {
                    console.log(datetime);
                    this.changeDate(datetime)
                }}
                // onOpenModal={()=>{Picker.hide()}}
            />
        )
    }

    renderItem() {
        // 数组
        var itemAry = [];
        // 颜色数组
        var colorAry = ['zhiyin_1', 'zhiyin_2', 'zhiyin_3', 'zhiyin_4', 'zhiyin_5'];
        // 遍历
        for (var i = 0; i < colorAry.length; i++) {
            itemAry.push(
                <TouchableOpacity key={i} activeOpacity={1} style={{flex: 1,}} onPress={() => {
                    this.setState({
                        showBaseView: false
                    })
                }}>
                    <Image source={{uri: colorAry[i]}}
                           style={styles.img}/>
                </TouchableOpacity>
            );
        }
        return itemAry;
    }

    showBaseView() {
        if (this.state.showBaseView) {
            return (
                <View style={{justifyContent:'center',backgroundColor:'rgba(0,0,0,0.8)',paddingRight:20,paddingLeft:20,height: height,width:width,paddingTop:cardHight,paddingBottom:cardHight,position: 'absolute',}}>
                    <Swiper style={styles.wrapper}  autoplay
                            onMomentumScrollEnd={(e, state, context) => console.log('index:', state.index)}
                            dot={<View style={{backgroundColor:'rgba(222,222,222,1)', width: 8, height: 8,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
                            activeDot={<View style={{backgroundColor: global.params.backgroundColor, width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                            paginationStyle={{
                                bottom:  10, left: null, right: 15
                            }}
                            loop>
                        {this.renderItem()}
                    </Swiper>
                </View>
            )

        }
    }

    didSelectRow(i) {
        console.log(i);
        if (i === 0) {
            this.props.navigator.push({
                component: ChooseAirport,
            })
        } else if (i === 1) {

            console.log(submitObj);
            this.props.navigator.push({
                component: ChooseSchoolVC,
                params: {country_id: submitObj['countryId']}
            })
        } else if (i === 2) {
            this.setState({
                showBaseView: false
            })
            this._showTimePicker();
        }
    }

    rightView(item, i) {
        if (i === 3) {
            return (
                <View key={i} style={{width: width, flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{uri: item[0]}} style={styles.iconStyle}/>
                    <TouchableOpacity activeOpacity={0.8} style={styles.rowContentStyle}>
                        <Text allowFontScaling={false} style={styles.rowTitleStyle}>{item[1]}</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            {this.dateRightView(item)}
                            <Image source={{uri: 'right_go'}} style={styles.rightRowStyle}/>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View key={i} style={{width: width, flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{uri: item[0]}} style={styles.iconStyle}/>
                    <TouchableOpacity activeOpacity={0.8} style={styles.rowContentStyle} onPress={
                        this.didSelectRow.bind(this, i)}>
                        <Text allowFontScaling={false} style={styles.rowTitleStyle}>{item[1]}</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text allowFontScaling={false} style={{fontSize: 14, color: 'rgb(111,111,111)'}}>{this.state.source[i]}</Text>
                            <Image source={{uri: 'right_go'}} style={styles.rightRowStyle}/>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
    }


    _showTimePicker() {

        let section1Data = ['1人', '2人', '3人', '4人', '5人', '6人', '7人', '8人', '9人'];
        let selectedValue = [];
        for (let i = 1; i <= 15; i++) {
            let title = i + '件行李';
            selectedValue.push(title);
        }

        let pickerData = [section1Data, selectedValue];
        let defaultData = ['1人', '1件行李'];

        Picker.init({
            pickerData,
            defaultData,
            pickerConfirmBtnText: '确认',
            pickerCancelBtnText: '取消',
            pickerTitleText: ' ',
            onPickerConfirm: data => {
                console.log(data);
                submitObj['people'] = parseInt(data[0]);
                submitObj['luggage'] = parseInt(data[1]);
                let airportName = data[0] + ' ' + data[1];
                let arr = this.state.source;
                arr[2] = airportName;
                this.setState({
                    source: arr,
                }, () => {
                    console.log(submitObj);
                })
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
                console.log(data);
            }
        });
        Picker.show();
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f5f5f5"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                    backgroundColor={global.params.backgroundColor}
                />




                <ScrollView>
                    <Image source={{uri: 'jieji_headimg'}} style={styles.headImageStyle}/>
                    {this.dataSource.map((item, i) => {
                        return (
                            <View key={i}>
                                {this.rightView(item, i)}
                            </View>
                        )
                    })}
                    <TouchableOpacity activeOpacity={0.8} style={styles.searchBtnStyle}
                                      onPress={this.jiejiSearch.bind(this)}>
                        <Text allowFontScaling={false} style={{color: 'white', fontSize: 15}}>搜索</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.zhinanStyle}
                                      onPress={() => {
                                          this.setState({
                                              showBaseView: true
                                          })
                                      }}
                    >
                        <Text allowFontScaling={false} style={{color: 'rgb(216,71,68)', fontSize: 13}}>用车指南</Text>
                    </TouchableOpacity>
                </ScrollView>

                {this.showBaseView()}


                <TouchableOpacity style={styles.backButtonStyle} onPress={this.backNav.bind(this)}>
                    <Image source={{uri: 'icon_back_blue'}} style={{width: 24, height: 24}}/>
                </TouchableOpacity>
                <MessageBarAlert ref="alert"/>



            </View>
        )
    }
}

const styles = StyleSheet.create({

    headImageStyle: {
        width: width,
        height: 180,
    },

    backButtonStyle: {
        position: 'absolute',
        left: 15, top: global.params.iPhoneXHeight + 20,
    },
    rowContentStyle: {
        borderBottomColor: 'rgb(222,222,222)',
        borderBottomWidth: 0.5,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width - 60

    },
    rowTitleStyle: {
        fontSize: 15,
        color: '#727272',
    },
    iconStyle: {
        marginLeft: 14,
        marginRight: 14,
        width: 16,
        height: 16,
        resizeMode: 'stretch'
    },
    rightRowStyle: {
        width: 8,
        height: 14,
        marginLeft: 8,
    },

    searchBtnStyle: {
        backgroundColor: global.params.backgroundColor,
        borderRadius: 6,
        height: 44,
        marginTop: 40,
        marginLeft: 20,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },

    zhinanStyle: {
        marginTop: 15,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },

    baseViewStyle: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modolSctollViewStyle: {
        width: width,
        height: 280,
        marginTop: height / 2 - 180
    },


    itemStyle: {
        // 尺寸
        width: width,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },

    minItemStyle: {
        width: width * 0.9,
        height: 380,
        backgroundColor: 'white',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    pagingIndicatorStyle: {
        // 主轴方向与对齐方式
        flexDirection: 'row',
        justifyContent: 'center',
        width: width,
    },

    swiper: {
    },


    img: {
        flex: 1,
        resizeMode: Image.resizeMode.stretch,
    }

})