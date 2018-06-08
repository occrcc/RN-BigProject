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
import ServeConfirm from './ServeUnionConfirm'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import _ from 'lodash'

var ServeApi = require('../ServeApi/ServeApi')

var submitObj = {}

export default class SchoolCardInfo extends Component {
    constructor(props) {
        super(props)
        this.state={
            dataSource:[],
        }
    }

    back() {
        this.props.navigator.pop();
    }

    componentWillMount() {

    }

    componentWillUnmount() {
        submitObj = {}
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        console.log(this.props.schoolCard);

        InteractionManager.runAfterInteractions(() => {
            this.setDataSource();
        })
    }

    setDataSource() {
        let dataSource = [];
        for (let i = 0; i < this.props.schoolCard.length; i++) {
            let obj = this.props.schoolCard[i];
            let createObj = {
                fieldName: i + '',
                title: obj,
                fieldPlaceHolder: '请填写' + obj,
            }
            dataSource.push(createObj);
        }
        console.log(dataSource);
        this.setState({dataSource:dataSource});
    }

    componentWillUnmount() {
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
        for (let i = 0; i < this.props.schoolCard.length; i++) {
            if (!submitObj.hasOwnProperty(i + '') || submitObj[i + ''].length < 1) {
                this.showAlert(this.props.schoolCard[i] + '不能为空');
                return;
            }
        }
        let newS = "";
        for (let i = 0 ; i<this.props.schoolCard.length; i++) {
            let value = submitObj[i + ''];
            let key = this.props.schoolCard[i];
            let ss = key+'##'+value+'||';
            newS += ss;
        }

        newS = newS.substring(0,newS.length - 2);
        // DeviceEventEmitter.emit('school_cardinfo', newS);

        var values = _.cloneDeep(this.props.submitObj);
        values['bank_info'] = newS;

        this.props.navigator.push({
            component: ServeConfirm,
            params: {submitObj:values},
        })
    }

    cardInfoExplain(item){
        var explain = '';
        if (item.title === '国际识别码') {
            explain = 'SWIFT Code（简称银行国际代码）一般用于发电汇，信用证电报， 每个银行都有，用于快速处理银行间电报往来。'
        }else if (item.title === 'ABA码') {
            explain = 'ABA Number----是由美国银行家协会在美联储监管和协助下提出的金融机构识别码。用于银行的交易，转帐，清算等的路由确认。由9位数字组成，例：121000248。'
        }else if (item.title === 'BIC码') {
            explain = ' BIC Number----银行国际代码，又被称为SWIFT地址BIC，相当于各个银行的身份证号。'
        }else if (item.title === 'IBAN号') {
            explain = 'SWIFT Code（简称银行国际代码）一般用于发电汇，信用证电报， 每个银行都有，用于快速处理银行间电报往来。'
        }
        if (explain.length > 0) {
            return (
                <View style={{marginTop:5,marginBottom:15,marginLeft:15,marginRight:15,backgroundColor:'rgb(255,255,255)'}}>
                    <Text style={{fontSize:13,lineHeight:16,color:'rgb(144,144,144)'}}>{explain}</Text>
                </View>
            )
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
                    title='银联汇款'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <KeyboardAwareScrollView style={{marginBottom:44 + global.params.iPhoneXHeight}}>
                    <View>
                        <View style={{marginLeft: 14, flexDirection: 'row', height: 40, alignItems: 'center',}}>
                            <Image source={{uri: 'school_card'}} style={{resizeMode: 'stretch',width: 24, height: 20, marginRight: 8}}/>
                            <Text style={{fontSize: 15, color: 'black'}}>收款账户信息</Text>
                        </View>
                        <View style={{marginBottom: 8, marginLeft: 15, marginRight: 15}}>
                            <Text style={{
                                fontSize: 13,
                                color: 'rgb(186,53,46)'
                            }}>请准确填写以下信息，如因信息不准确将延误到账时间，可能会带来不必要的损失。</Text>
                        </View>
                    </View>

                    {this.state.dataSource.map((item, i) => {
                        return (
                            <View key={i}>
                                <FormLabel>{item.title}</FormLabel>
                                <FormInput
                                    inputStyle={{fontSize: 15}}
                                    placeholder={item.fieldPlaceHolder}
                                    onChangeText={(textVal) => this.handleInput(textVal, item.fieldName)}
                                />
                                {this.cardInfoExplain(item)}
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
        bottom:  global.params.iPhoneXHeight,
        height: 44,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: global.params.backgroundColor
    }
});