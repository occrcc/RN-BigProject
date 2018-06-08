import React, {Component} from 'react'
import {
    View,
    ListView,
    StyleSheet,
    Dimensions,
    Text,
    StatusBar,
    TouchableOpacity,
    DeviceEventEmitter,
    Image,
    ScrollView,
    InteractionManager,
    Platform,


} from 'react-native'

var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
let {width, height} = Dimensions.get('window')
import NavBar from '../../Componnet/NavBar'
import {FormLabel, FormInput, FormValidationMessage} from 'react-native-elements'
import {Navigator} from 'react-native-deprecated-custom-components'
import SchoolCardInfo from './SchoolCardInfo'
import ServeUploadStudent from './ServeUploadStudentInfo'
import ServeConfirm from './ServeUnionConfirm'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

var ServeApi = require('../ServeApi/ServeApi')
import Alert from 'rnkit-alert-view';

var submitObj = {}

export default class ServeUnionStudentInfo extends Component {
    constructor(props) {
        super(props)
        this.dataSource = [
            {
                fieldName: 'contact_name',
                fieldType: 1,
                title: '中文姓名',
                textfieldType: '',
                fieldPlaceHolder: '请与中国居民身份证保持一致',
                defaultValue: ''
            },
            {
                fieldName: 'eng_name',
                fieldType: 1,
                title: '英文姓名',
                textfieldType: '',
                fieldPlaceHolder: '姓/名 请与学校登记的英文名保持一致',
                defaultValue: ''
            },
            {
                fieldName: 'id_card',
                fieldType: 1,
                title: '身份证号',
                textfieldType: '',
                fieldPlaceHolder: '请如实填写，将用于外管局核实学生身份',
                defaultValue: ''
            },
            {
                fieldName: 'student_id',
                fieldType: 1,
                title: '学号',
                textfieldType: 'phone',
                fieldPlaceHolder: 'StudentID（可见offer）',
                defaultValue: ''
            },
            {
                fieldName: 'contact_phone',
                fieldType: 1,
                title: '联系电话',
                textfieldType: 'phone',
                fieldPlaceHolder: '便于联系核对信息',
                defaultValue: ''
            },
            {
                fieldName: 'contact_email',
                fieldType: 0,
                title: '邮箱',
                textfieldType: 'default',
                fieldPlaceHolder: '便于接收确认邮件',
                defaultValue: ''
            },
            {
                fieldName: 'reference',
                fieldType: 0,
                title: '汇款附言',
                textfieldType: '',
                fieldPlaceHolder: '学校来函要求备注的内容',
                defaultValue: '',

            }
        ]
    }

    back() {
        this.props.navigator.pop();
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
        })
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        submitObj = this.props.submitObj;
        this.school_cardinfo = DeviceEventEmitter.addListener('school_cardinfo', (res) => {
            submitObj['bank_info'] = res;
            console.log(submitObj);
        });

        this.serveUnion_push = DeviceEventEmitter.addListener('serveUnion_push', () => {
            console.log(submitObj);
            setTimeout(() => {
                this.props.navigator.push({
                    component: ServeUploadStudent,
                    params: {submitObj: submitObj},
                })
            }, 1500);
        });
    }


    componentWillUnmount() {
        this.school_cardinfo.remove();
        this.serveUnion_push.remove();
        MessageBarManager.unregisterMessageBar();
    }

    handleInput = (textVal, fieldName,) => {
        submitObj[fieldName] = textVal;
        console.log('textVal : ' + textVal);
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

    next() {

        let na = /^[\u4E00-\u9FA5]{2,10}$/;
        let ph = /^1[34578]\d{9}$/;
        let em = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        var numId = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

        if (!submitObj.hasOwnProperty('contact_name') || submitObj['contact_name'].length < 1 || !na.test(submitObj['contact_name'])) {
            this.showAlert('中文姓名格式不正确');
            return;
        } else if (!submitObj.hasOwnProperty('eng_name') || submitObj['eng_name'].length < 1) {
            this.showAlert('英文姓名格式不正确');
            return;
        } else if (!submitObj.hasOwnProperty('id_card') || submitObj['id_card'].length < 1 || !numId.test(submitObj['id_card'])) {
            this.showAlert('身份证号格式不正确');
            return;
        } else if (!submitObj.hasOwnProperty('student_id') || submitObj['student_id'].length < 1) {
            this.showAlert('学号不能为空');
            return;
        } else if (!submitObj.hasOwnProperty('contact_phone') || submitObj['contact_phone'].length < 1 || !ph.test(submitObj['contact_phone'])) {
            this.showAlert('联系电话格式不正确');
            return;
        } else if (!submitObj.hasOwnProperty('contact_email') || submitObj['contact_email'].length < 1 || !em.test(submitObj['contact_email'])) {
            this.showAlert('邮箱格式不正确');
            return;
        }

        console.log(submitObj);
        submitObj['zh_name'] =  submitObj['contact_name'];

        ServeApi.getSchoolType(submitObj['school_id']).then(res => {
            if (res.result) {
                this.props.navigator.push({
                    sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                    component: ServeConfirm,
                    params: {submitObj: submitObj},
                })
            } else {
                let schoolCards = submitObj['collect_params'].split(',');
                this.props.navigator.push({
                    sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                    component: SchoolCardInfo,
                    params: {schoolCard: schoolCards, submitObj: submitObj},
                })
            }
        }).catch(error => {
            console.log('error  ' + error);
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
                    title='银联汇款'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <Image source={{uri: 'unionpay2'}} style={styles.headerImageStyle}/>
                <KeyboardAwareScrollView style={{marginBottom:44 + global.params.iPhoneXHeight}}>
                    <View>
                        <View style={{marginLeft: 14, flexDirection: 'row', height: 40, alignItems: 'center',}}>
                            <Image source={{uri: 'icon_student'}} style={{resizeMode: 'stretch',width: 20, height: 20, marginRight: 8}}/>
                            <Text style={{fontSize: 15, color: 'black'}}>学生信息</Text>
                        </View>
                        <View style={{marginBottom: 8, marginLeft: 15, marginRight: 15}}>
                            <Text style={{
                                fontSize: 13,
                                color: 'rgb(186,53,46)'
                            }}>请准确填写以下信息，如因信息不准确将延误到账时间，可能会带来不必要的损失。</Text>
                        </View>
                    </View>

                    {this.dataSource.map((item, i) => {
                        return (
                            <View key={i}>
                                <FormLabel>{item.title}</FormLabel>
                                <FormInput
                                    inputStyle={{fontSize: 15}}
                                    placeholder={item.fieldPlaceHolder}
                                    onChangeText={(textVal) => this.handleInput(textVal, item.fieldName)}
                                />
                            </View>
                        )
                    })}
                </KeyboardAwareScrollView>
                <MessageBarAlert ref="alert"/>
                <TouchableOpacity activeOpacity={0.8} style={[styles.footerBtnStyle]}
                                  onPress={this.next.bind(this)}
                >
                    <Text style={{fontSize: 17, color: 'white'}}>下一步</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    headerImageStyle: {
        width: width,
        height: 34,
    },

    footerBtnStyle: {
        position: 'absolute',
        bottom: global.params.iPhoneXHeight,
        height: 44,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: global.params.backgroundColor
    }
});