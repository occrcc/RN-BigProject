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
    Keyboard,
    DeviceEventEmitter
} from 'react-native'


import NavBar from '../../Componnet/NavBar'
import {Navigator} from 'react-native-deprecated-custom-components'

let {width} = Dimensions.get('window')

var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager
import Picker from 'react-native-picker';
import SubmitOrderResult from '../../Serve/SubmitOrderResults'
import ChooseDem from './HomeChooseDem'

var HomeServe = require('../HomeServers')

var submitObj = {};

export default class HomeSubmitDem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstValue:'请选择课程名称',
        }

        this._showTimePicker = this._showTimePicker.bind(this);

        this.dataSource = [
            {
                title: '',
                item: [
                    {title: '课程名称', fieldType: 3, fieldName: 'kmmc'},
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

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        this.subscription = DeviceEventEmitter.addListener('getDem', (res)=>{
            submitObj['kmmc'] = res[1];
            submitObj['kmlb'] = res[0];
            this.setState({firstValue:res[1]});
        });
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
        submitObj = {};
        this.subscription.remove();
    }

    handleInput = (textVal, fieldName) => {
        submitObj[fieldName] = textVal;
    }

    _showTimePicker() {
        this.props.navigator.push({
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            component: ChooseDem,
        });
    }

    didSelectRow(rowData) {
        this.refs.textInput1.blur();
        console.log(rowData);
        if (rowData.title === '课程名称') {
            this._showTimePicker();
        }
    }

    rightView(rowData, rowID) {
        let fieldType = rowData.fieldType;
        if (fieldType === 1) {
            let keyboard = 'default';
            if (rowData.textfieldType === 'phone') {
                keyboard = 'numeric'
            }
            return (
                <TextInput ref="textInput1" key={rowID} placeholder={rowData.fieldPlaceHolder} placeholderTextColor='#727272'
                           style={styles.cellTextInputStyle}
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
                        width:200,
                        textAlign:'right'
                    }}>{this.state.firstValue}</Text>
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
        if (!submitObj.hasOwnProperty('kmmc') || submitObj['kmmc'].length < 1 ){
            this.showAlert('请选择科目名称'); return;
        }else if (!submitObj.hasOwnProperty('username') || submitObj['username'].length < 1){
            this.showAlert('请输入姓名'); return;
        }else if (!submitObj.hasOwnProperty('phone') || submitObj['phone'].length < 1){
            this.showAlert('请输入联系人电话'); return;
        }
        submitObj['access_token'] = this.props.userInfo.token;
        console.log(submitObj);

        HomeServe.submitDem(submitObj).then(res=>{
            console.log(res);
            this.props.navigator.push({
                component: SubmitOrderResult,
                params:{
                    isOk: true, title: '您的需求已成功提交', content: '已经收到您提交的需求，老师将尽快与您联系。',
                    notice: null, popToTop: true
                }
            });
        }).catch(error=>{
            console.log('error:   '+ error);
        })
    }


    _onStartShouldSetResponderCapture (event) {
        Keyboard.dismiss();
    }

    _inputOnLayout(event){
        // console.log(event);
        // inputComponents.push(event.nativeEvent.target);
    }

    render() {
        return (
            <View onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)} style={{flex: 1, backgroundColor: "white"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                <NavBar
                    title={this.props.title}
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <ScrollView style={{marginBottom: 40 + global.params.iPhoneXHeight}}>
                    {this.dataSource.map((item, i) => {
                        return (
                            <View key={i}>
                                <View
                                    style={{justifyContent: 'center', height: 26, backgroundColor: 'rgb(244,244,244)'}}>
                                    <Text allowFontScaling={false} style={{marginLeft: 14, fontSize: 15}}>{item.title}</Text>
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
        marginRight:14,
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
        alignItems:'center'
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