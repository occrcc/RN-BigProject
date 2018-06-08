import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    StatusBar,
    ScrollView,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Platform,
    Keyboard
} from 'react-native'


import NavBar from '../../Componnet/NavBar'

let {width} = Dimensions.get('window')

var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager
import Picker from 'react-native-picker';
import ActionSheet from 'react-native-actionsheet'
import SubmitOrderResult from '../../Serve/SubmitOrderResults'

var HomeServe = require('../HomeServers')

var submitObj = {}


export default class HomeSubmitZixun extends Component {
    constructor(props) {
        super(props)
        this.state = {
            kemu: '',
            atTimes: ['取消', '女', '男'],
            gender: '',
            selectAry:[],
        }

        this._showTimePicker = this._showTimePicker.bind(this);
        this.handlePress = this.handlePress.bind(this)
        this.showActionSheet = this.showActionSheet.bind(this)

        this.dataSource = [
            {
                title: '',
                item: [
                    {title: '咨询科目', fieldType: 3, fieldName: 'kemu'},
                    {
                        title: '所在城市',
                        fieldType: 1,
                        fieldName: 'city',
                        fieldPlaceHolder: '请填写所在城市',
                        textfieldType: ''
                    },
                ]
            },
            {
                title: '',
                item: [
                    {
                        title: '姓名',
                        fieldType: 1,
                        fieldName: 'username',
                        fieldPlaceHolder: '请填写真实姓名',
                        textfieldType: ''
                    },
                    {title: '性别', fieldType: 3, fieldName: 'gender'},
                    {
                        title: '联系电话',
                        fieldType: 1,
                        fieldName: 'phone',
                        fieldPlaceHolder: '请填写联系手机号',
                        textfieldType: 'phone'
                    },
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

    componentWillMount() {
        HomeServe.getSubmitZixun().then(res => {
            this.setState({selectAry:res});
        }).catch(error => {
            console.log('error:  ' + error);
        })
    }


    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
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
        let gender = this.state.atTimes[i];
        submitObj['gender'] = gender;
        this.setState({gender: gender});
    }

    _showTimePicker() {
        let pickerData = this.state.selectAry;
        Picker.init({
            pickerData,
            pickerConfirmBtnText: '确认',
            pickerCancelBtnText: '取消',
            pickerTitleText: ' ',
            onPickerConfirm: (data) => {
                submitObj['kemu'] = data[0];
                this.setState({
                    kemu: data,
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
        if (rowData.title === '咨询科目') {
            this._showTimePicker();
        } else if (rowData.title === '性别') {
            this.showActionSheet();
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
                    }}>{rowData.title === '咨询科目' ? this.state.kemu : this.state.gender}</Text>
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
        if (!submitObj.hasOwnProperty('kemu') || submitObj['kemu'].length < 1) {
            this.showAlert('请选择咨询科目');
            return;
        } else if (!submitObj.hasOwnProperty('city') || submitObj['city'].length < 1) {
            this.showAlert('请输入所在城市');
            return;
        } else if (!submitObj.hasOwnProperty('username') || submitObj['username'].length < 1) {
            this.showAlert('请填写联系人姓名');
            return;
        } else if (!submitObj.hasOwnProperty('gender') || submitObj['gender'].length < 1) {
            this.showAlert('请选择您的性别');
            return;
        } else if (!submitObj.hasOwnProperty('phone') || submitObj['phone'].length < 1) {
            this.showAlert('请填写联系人电话');
            return;
        }

        submitObj['access_token'] = this.props.userInfo.token;
        console.log(submitObj);
        HomeServe.submitZixun(submitObj).then(res => {
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
                    title="语言申请"
                    leftIcon="ios-arrow-back"

                    leftPress={this.back.bind(this)}
                />
                <ScrollView style={{marginBottom: 40 + global.params.iPhoneXHeight}}>
                    {this.dataSource.map((item, i) => {
                        return (
                            <View key={i}>
                                <View
                                    style={{justifyContent: 'center', height: 24, backgroundColor: 'rgb(244,244,244)'}}>
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