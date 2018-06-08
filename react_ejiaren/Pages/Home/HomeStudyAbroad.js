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
    Platform,
    Keyboard
} from 'react-native'


import NavBar from '../Componnet/NavBar'

let {width} = Dimensions.get('window')

var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager
import storage from "../RNAsyncStorage";
import Picker from 'react-native-picker';
import ActionSheet from 'react-native-actionsheet'
import SubmitOrderResult from '../Serve/SubmitOrderResults'

var HomeServe = require('./HomeServers')

var submitObj = {}


export default class HomeStudyAbroad extends Component {
    constructor(props) {
        super(props)
        this.state = {
            values: {destination: '', at_time: '', current_status: '', relationship_with_poster: ''},
            countrys: [],
            countryItemAry: [],
            atTimes: ['',],
            type: 0
        }

        this._showTimePicker = this._showTimePicker.bind(this);
        this.handlePress = this.handlePress.bind(this)
        this.showActionSheet = this.showActionSheet.bind(this)

        this.dataSource = [
            {
                title: '意向国家',
                item: [
                    {title: '意向国家', fieldType: 3, fieldName: 'destination'},
                    {title: '出国时间', fieldType: 3, fieldName: 'at_time'},
                ]
            },
            {
                title: '个人信息',
                item: [
                    {
                        title: '称呼',
                        fieldType: 1,
                        fieldName: 'callname',
                        fieldPlaceHolder: '请填写真实姓名',
                        textfieldType: ''
                    },
                    {
                        title: '联系电话',
                        fieldType: 1,
                        fieldName: 'contactphone',
                        fieldPlaceHolder: '请填写联系手机号',
                        textfieldType: 'phone'
                    },
                    {title: '当前状态', fieldType: 3, fieldName: 'current_status'},
                    {title: '关系', fieldType: 3, fieldName: 'relationship_with_poster'},
                ]
            }
        ]
    }

    back() {
        this.props.navigator.pop();
    }

    componentWillUnmount() {
        Keyboard.dismiss();
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        this.getHomeCountrys();
    }

    getGradationList() {
        HomeServe.gradationList().then(res => {
            res.unshift('取消');
            this.setState({atTimes: res, type: 2}, () => {
                this.showActionSheet();
            });
        }).catch(error => {
            console.log('error:    ' + error);
        })
    }

    getHomeTimeList() {
        HomeServe.getHomeTimeList().then(res => {
            res.unshift('取消');
            this.setState({atTimes: res, type: 1}, () => {
                this.showActionSheet();
            });
        }).catch(error => {
            console.log('error:    ' + error);
        })
    }

    getHomeCountrys() {
        HomeServe.getHomeCountrys().then(res => {
            res.push({
                id: '9999999',
                name: '其它',
                orderby: '9999999'
            })
            let countrys = [];
            for (let i = 0; i < res.length; i++) {
                let item = res[i];
                countrys.push(item.name);
            }
            this.setState({countrys: countrys, countryItemAry: res});

        }).catch(error => {
            console.log('error:    ' + error);
        })
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
        submitObj = {}
    }

    handleInput = (textVal, fieldName) => {
        submitObj[fieldName] = textVal;
    }

    showActionSheet() {
        this.ActionSheet.show();
    }

    handlePress(i) {
        console.log(i);
        if (i === 0) return;
        let at_time = this.state.atTimes[i];
        let value = this.state.values;
        if (this.state.type === 1) {
            submitObj['at_time'] = at_time;
            value.at_time = at_time;
        } else if (this.state.type === 2) {
            submitObj['current_status'] = at_time;
            value.current_status = at_time;
        } else if (this.state.type === 3) {
            submitObj['relationship_with_poster'] = at_time;
            value.relationship_with_poster = at_time;
        }

        this.setState({
            values: value,
        })
    }

    _showTimePicker() {

        let pickerData = this.state.countrys;
        Picker.init({
            pickerData,
            pickerConfirmBtnText: '确认',
            pickerCancelBtnText: '取消',
            pickerTitleText: ' ',
            onPickerConfirm: (data, i) => {
                let obj = this.state.countryItemAry[i];
                submitObj['destination'] = obj.id;

                let value = this.state.values;
                value.destination = data;
                this.setState({
                    values: value,
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

    didSelectRow(rowData) {


        this.refs.textInput1.blur();

        console.log(rowData);
        if (rowData.title === '意向国家') {
            this._showTimePicker();
        } else if (rowData.title === '出国时间') {
            this.getHomeTimeList();
        } else if (rowData.title === '当前状态') {
            this.getGradationList();
        } else if (rowData.title === '关系') {
            this.setState({type: 3, atTimes: ['取消', '本人', '家人', '朋友', '其他']}, () => {
                this.showActionSheet();
            });
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
                <TextInput ref="textInput1" key={rowID} placeholder={rowData.fieldPlaceHolder}
                           placeholderTextColor='#727272'
                           style={styles.cellTextInputStyle} defaultValue={rowData.defaultValue}
                           onChangeText={(textVal) => this.handleInput(textVal, rowData.fieldName,)}
                           underlineColorAndroid='transparent'
                           keyboardType={keyboard}
                           onLayout={this._inputOnLayout.bind(this)}
                >
                </TextInput>
            )

        } else if (fieldType === 3) {
            return (
                <TouchableOpacity activeOpacity={0.8} style={styles.cellChooseStyle}
                                  onPress={this.didSelectRow.bind(this, rowData)}>
                    <Text allowFontScaling={false} style={{
                        fontSize: 14,
                        color: '#727272',
                        marginRight: 8,
                        width: 200,
                        textAlign: 'right'
                    }}>{this.state.values[rowData.fieldName]}</Text>
                    <Image source={{uri: 'right_go'}} style={styles.rightRowStyle}/>
                </TouchableOpacity>
            )
        }
    }

    renderRow(rowData, rowID) {
        return (
            <View key={rowID} style={styles.cellContentViewStyle}>
                <Text allowFontScaling={false} style={styles.cellTitleStyle}>{rowData.title}</Text>
                <View style={styles.subViewType}>
                    {this.rightView(rowData, rowID)}
                </View>
            </View>
        );
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

    submitZufang() {

        if (!submitObj.hasOwnProperty('destination') || submitObj['destination'].length < 1) {
            this.showAlert('请选择意向国家');
            return;
        } else if (!submitObj.hasOwnProperty('at_time') || submitObj['at_time'].length < 1) {
            this.showAlert('请选择出国时间');
            return;
        } else if (!submitObj.hasOwnProperty('callname') || submitObj['callname'].length < 1) {
            this.showAlert('请输入联系人称呼');
            return;
        } else if (!submitObj.hasOwnProperty('contactphone') || submitObj['contactphone'].length < 1) {
            this.showAlert('请填写联系人电话');
            return;
        } else if (!submitObj.hasOwnProperty('current_status') || submitObj['current_status'].length < 1) {
            this.showAlert('请选择当前状态');
            return;
        } else if (!submitObj.hasOwnProperty('relationship_with_poster') || submitObj['relationship_with_poster'].length < 1) {
            this.showAlert('请选择您与留学者的关系');
            return;
        }
        submitObj['access_token'] = this.props.userInfo.token;
        console.log(submitObj);
        HomeServe.studyAbroadCompay(submitObj).then(res => {
            console.log(res);
            this.props.navigator.push({
                component: SubmitOrderResult,
                params: {
                    isOk: true, title: '您的需求已成功提交', content: '已经收到您提交的需求，老师将尽快与您联系。',
                    notice: null, popToTop: true
                }
            });
        }).catch(error => {
            console.log('error:   ' + error);
        })
    }


    _onStartShouldSetResponderCapture(event) {
        Keyboard.dismiss();
    }

    _inputOnLayout(event) {
        // console.log(event);
        // inputComponents.push(event.nativeEvent.target);
    }

    render() {
        return (
            <View onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}
                  style={{flex: 1, backgroundColor: "white"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                <NavBar
                    title="提交留学需求"
                    leftIcon="ios-arrow-back"

                    leftPress={this.back.bind(this)}
                />
                <ScrollView style={{marginBottom: 40 + global.params.iPhoneXHeight}}>
                    {this.dataSource.map((item, i) => {
                        return (
                            <View key={i}>
                                <View
                                    style={{justifyContent: 'center', height: 36, backgroundColor: 'rgb(244,244,244)'}}>
                                    <Text allowFontScaling={false}
                                          style={{marginLeft: 14, fontSize: 15}}>{item.title}</Text>
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
                <TouchableOpacity activeOpacity={0.8} style={[styles.footerBtnStyle]}
                                  onPress={this.submitZufang.bind(this)}
                >
                    <Text allowFontScaling={false} style={{fontSize: 17, color: 'white'}}>提交</Text>
                </TouchableOpacity>
                <MessageBarAlert ref="alert"/>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={this.state.atTimes}
                    cancelButtonIndex={0}
                    onPress={this.handlePress}
                />
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
        // marginRight: 14
    },
    cellTextInputStyle: {
        width: 180,
        height: 38,
        marginLeft: 30,
        textAlign: 'right',
        color: global.params.backgroundColor,
        fontSize: 14,
        marginRight: 14,
    },
    rightRowStyle: {
        width: 8,
        height: 14,
    },
    cellChooseStyle: {
        flexDirection: 'row',
        // width: width - 80,
        justifyContent: 'flex-end',
        marginRight: 15,
        alignItems: 'center'
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