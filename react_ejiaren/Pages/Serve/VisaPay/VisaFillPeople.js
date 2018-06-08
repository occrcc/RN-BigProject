import React, {Component} from 'react'
import {
    View,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    ScrollView,
    TextInput,
    InteractionManager,
    Platform,
    Dimensions
} from 'react-native'


import NavBar from '../../Componnet/NavBar'

var submitObj = {};
import storage from "../../RNAsyncStorage";
var UserApi = require('../../Mine/Servers/UserInfoServes')
var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager
import Modal from 'react-native-modal'
let {width,height} = Dimensions.get('window');
var ServeApi = require('../ServeApi/ServeApi')
import OrderPay from '../OrderPay'
import {Navigator} from 'react-native-deprecated-custom-components'
var GetDataApi = require('../../Service/getData');

import _ from 'lodash'

export default class VisaFillPeople extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo:null,
            isModalVisible: false,
            teacherName:'',
            source: [
                {title:'中文姓名',defaultValue:'',fieldPlaceHolder:'请输入中文姓名',keyboard:'default',textfieldType:'',fieldName:'contact_name'},
                {title:'联系电话',defaultValue:'',fieldPlaceHolder:'请输入联系人电话',keyboard:'numeric',textfieldType:'',fieldName:'contact_phone'},
                {title:'邮箱',defaultValue:'',fieldPlaceHolder:'请输入邮箱',keyboard:'email-address',textfieldType:'',fieldName:'contact_email'},
                {title:'邀请码',defaultValue:'',fieldPlaceHolder:'邀请码',keyboard:'numeric',textfieldType:'yqm',fieldName:'yqm'},
                {title:'备注',defaultValue:'',fieldPlaceHolder:'美国签证必须填写CGI码',keyboard:'default',textfieldType:'',fieldName:'notice'},
            ],
        }
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

    back() {
        this.props.navigator.pop()
    }

    goPay(){
        for (let j = 0, len = this.state.source.length; j < len; j++) {
            let item = this.state.source[j];
            let key = item.fieldName;
            if( key === 'notice' || (key === 'yqm' && global.params.OgnzId !== '163') ){
            }else {
                if (!submitObj.hasOwnProperty(key) || submitObj[key].length < 1) {
                    this.showAlert(item.title + '不能为空');
                    return;
                }
            }
        }
        this.submitVisaPayOrder();
        // ServeApi.getCheckUserCode(2,this.props.submitObj.result.totalprice,this.state.userInfo.token).then(res=>{
        //     console.log(res);
        //     this.submitVisaPayOrder(res);
        // }).catch(error=>{
        //     console.log('error  :' + error);
        // })

    }

    submitVisaPayOrder(){
        var values = _.cloneDeep(submitObj);
        values['access_token'] = this.state.userInfo.token;
        values['from'] = Platform.OS === 'ios' ? 0 : 3;
        delete(values['result']);
        console.log(values)

        ServeApi.submitVisaPayOrler(values).then(res=>{
            console.log(res);
            this.props.navigator.push({
                sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                component: OrderPay,
                params: {orderInfo: res,userInfo:this.state.userInfo,visa:true},
            })

        }).catch(error=>{
            console.log('error  :' + error);
        })
    }

    showMingxi(){
        this.setState({isModalVisible: true});
    }

    componentWillMount() {
        submitObj = this.props.submitObj;

    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
        submitObj = {};
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        InteractionManager.runAfterInteractions(()=>{
            storage.load({
                key: 'userInfo',
            }).then(ret => {
                this.setState({
                    userInfo: ret,
                });
                UserApi.getRegInfo(ret.token).then(res=>{
                    this.setDefultValue(res,ret.token);
                }).catch(error=>{
                })
            }).catch(err => {
            });
        })
    }

    setDefultValue(userInfo,token){

        submitObj['contact_name'] = userInfo.realname;
        submitObj['contact_phone'] = userInfo.mobile;
        submitObj['contact_email'] = userInfo.email;
        submitObj['teacher_email'] = userInfo.teacher_email;
        if (userInfo.teacher_email.length > 0) {
            GetDataApi.getYqm(userInfo.teacher_email, token).then(res => {
                console.log(res);
                if (res.states === 'true') {
                    this.setState({teacherName: res.name});
                } else {
                    this.setState({teacherName: ''});
                }
            }).catch(err => {
                console.log('error:  ' + err);
            });
        }

        let source = [
            {title:'中文姓名',defaultValue:userInfo.realname,fieldPlaceHolder:'请输入中文姓名',keyboard:'default',textfieldType:'',fieldName:'contact_name'},
            {title:'联系电话',defaultValue:userInfo.mobile,fieldPlaceHolder:'请输入联系人电话',keyboard:'numeric',textfieldType:'',fieldName:'contact_phone'},
            {title:'邮箱',defaultValue:userInfo.email,fieldPlaceHolder:'请输入邮箱',keyboard:'email-address',textfieldType:'',fieldName:'contact_email'},
            {title:'邀请码',defaultValue:userInfo.teacher_email,fieldPlaceHolder:'邀请码',keyboard:'numeric',textfieldType:'yqm',fieldName:'yqm'},
            {title:'备注',defaultValue:'',fieldPlaceHolder:'美国签证必须填写CGI码',keyboard:'default',textfieldType:'',fieldName:'notice'},
        ]
        this.setState({
            source:source,
        })
    }

    handleInput = (textVal, fieldName, type) => {
        submitObj[fieldName] = textVal;
        if (type === 'yqm') {
            GetDataApi.getYqm(textVal, this.state.userInfo.token).then(res => {
                console.log(res);
                if (res.states === 'true') {
                    this.setState({teacherName: res.name});
                } else {
                    this.setState({teacherName: ''});
                }
                submitObj[fieldName] = textVal;
            }).catch(err => {
                console.log('error:  ' + err);
            });
        }
    }

    teacherName(item){
        if (item.fieldName === 'yqm') {
            return (
                <View >
                    <Text >{this.state.teacherName}</Text>
                </View>
            )
        }
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
                    <Text style={{marginLeft:14,fontSize:15,color:'black',fontWeight:'bold'}}>STEP3 填写联系人信息</Text>
                </View>

                <ScrollView style={{marginTop:20}}>
                    {this.state.source.map((item,i)=>{
                        return (
                            <View key={i} style={styles.cellContentViewStyle}>
                                <Text style={styles.cellTitleStyle}>{item.title}</Text>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    {this.teacherName(item)}
                                    <TextInput placeholder={item.fieldPlaceHolder} placeholderTextColor='#727272'
                                               style={styles.cellTextInputStyle}
                                               onChangeText={(textVal) => this.handleInput(textVal, item.fieldName, item.textfieldType)}
                                               underlineColorAndroid='transparent'
                                               keyboardType={item.keyboard}
                                               defaultValue={item.defaultValue}
                                               returnKeyType={'done'}
                                    >
                                    </TextInput>
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>

                <View style={styles.priceAndPayViewStyle}>
                    <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                        <Text style={{marginLeft: 14, fontSize: 15, color: '#727272'}}>订单总额:</Text>
                        <Text style={{marginLeft: 3, fontSize: 18, color: '#ff0e0e'}}>{'￥' + this.props.submitObj.result.totalprice}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} style={styles.payBtnStyle} onPress={this.goPay.bind(this)}>
                        <Text style={{color: '#ffffff', fontSize: 16}}>
                            去支付
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.mixiStyle} onPress={this.showMingxi.bind(this)}>
                        <Image source={{uri: 'icon_mingxi'}}
                               style={{resizeMode:'stretch',width: 16, height: 18, marginBottom: 4}}/>
                        <Text style={{color: global.params.backgroundColor, fontSize: 12, textAlign: 'center'}}>明细</Text>
                    </TouchableOpacity>
                </View>
                <MessageBarAlert ref="alert"/>

                <Modal  isVisible={this.state.isModalVisible} >
                    <View style={{ flex: 1,width:width,height:height }}>
                        <View ref='detailView' style={styles.popViewStyle} >
                            <View style={{marginBottom:10,alignItems:'center',backgroundColor:'#dedede',height:44,flexDirection:'row',justifyContent:'space-between'}}>
                                <Text style={{marginLeft:15,fontSize:14,color:'#969696'}}>费用明细</Text>
                                <TouchableOpacity style={{marginRight:14}} onPress={()=>{
                                    this.setState({isModalVisible:false})
                                }}>
                                    <Image source={{uri:'icon_quxiao'}} style={{width:16,height:16}}/>
                                </TouchableOpacity>
                            </View>
                            {
                                this.props.submitObj.result.priceList.map((item,i)=>{
                                    return (
                                        <View key={i} style={{
                                            backgroundColor:'white',
                                            justifyContent:'space-between',
                                            alignItems:'center',
                                            height:42,
                                            borderBottomColor:'#f5f5f5',
                                            borderBottomWidth:1,
                                            flexDirection:'row'
                                        }}>
                                            <Text style={{marginLeft:15,fontSize:15,color:'#969696'}}>{item.priceName}</Text>
                                            <Text style={{marginRight:15,fontSize:13,color:'#969696'}}>￥{item.totalprice}</Text>
                                        </View>
                                    )
                                })
                            }
                            <View style={{
                                backgroundColor:'white',
                                justifyContent:'flex-end',
                                alignItems:'center',
                                height:42,
                                flexDirection:'row',
                                marginBottom:20,
                            }}>
                                <Text style={{marginRight:15,fontSize:13,color:'#969696'}}>
                                    总价: ￥{this.props.submitObj.result.totalprice}</Text>
                            </View>
                            <View style={styles.tabFooterViewStyle}>
                                <Text style={{
                                    marginLeft: 14,
                                    color: '#969696',
                                    fontSize: 12,
                                    letterSpacing: 1,
                                    lineHeight: 18
                                }}>
                                    注意事项:{'\n'}
                                    <Text style={{marginTop: 5, fontSize: 11, color: '#b2b2b2'}}>
                                        • 以上手续费标准参考信用卡发卡银行和VISA机构;{'\n'}
                                        • 个人信用卡外币使用同样存在此类费用，详情可咨询各大银行;{'\n'}
                                        • 如您觉得手续费过高，建议您尝试银联汇款功能。{'\n'}</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </Modal>

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

    cellTextInputStyle: {
        width: 220,
        height: 38,
        marginRight: 15,
        textAlign: 'right',
        color: global.params.backgroundColor,
        fontSize: 14,
    },

    popViewStyle:{
        width:width - (Platform.OS === 'ios' ? 0 : 40),
        marginLeft:Platform.OS === 'ios' ? -20 : 0,
        backgroundColor:'white',
        position: 'absolute',
        bottom:0,
        left:0,
        right:0
    },

    tabFooterViewStyle: {
        backgroundColor: 'white',
        marginBottom: global.params.iPhoneXHeight,
    },
});