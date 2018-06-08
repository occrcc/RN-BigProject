import React, {Component} from 'react'
import {
    StatusBar,
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    Text,
    TextInput,
    DeviceEventEmitter,
    InteractionManager,
    Platform,
    Linking

} from 'react-native'

import NavBar from '../../Componnet/NavBar'
let {width} = Dimensions.get('window')
var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import VisaFillCurrency from './VisaFillCurrency'


import _ from 'lodash'

var currencys = [];
var submitObj = {};
export default class VisaNoInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            danwei:'请选择货币单位',
            currency:['Cancel'],

        }
        this.handlePress = this.handlePress.bind(this)
        this.showActionSheet = this.showActionSheet.bind(this)
    }

    showActionSheet() {
        console.log(this.props.item, this.props.serveId);
        this.ActionSheet.show()
    }

    handlePress(i) {
        if (i === 0){

        }else {
            let selectItem = currencys[i-1];
            submitObj['currencyId'] = selectItem.id;
            console.log(selectItem);
            let name = selectItem.name + ' ' + selectItem.short_name;
            this.setState({danwei:name})
        }
    }

    back() {
        this.props.navigator.pop();
    }

    componentWillMount() {
        submitObj = _.cloneDeep(this.props.item);
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
        submitObj = {}
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

    next(){
        if (!submitObj.hasOwnProperty('school') || submitObj['school'].length < 1 ){
            this.showAlert('学校或国家必须填写');
            return;
        }
        submitObj['countryid'] = 0;
        this.props.navigator.push({
            component: VisaFillCurrency,
            params: {item: submitObj},
        })
    }

    keFu() {
        let url = 'tel:021-61984772';
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
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
                    rightIcon="icon_kefu"
                    rightPress={this.keFu.bind(this)}
                />
                <View style={styles.headTitleStyle}>
                    <Text style={{marginLeft:14,fontSize:15,color:'black',fontWeight:'bold'}}>选择学校或国家</Text>
                </View>

                <View style={{alignItems:'center',justifyContent:'center',marginLeft:0,marginRight:0}}>
                    <Text style={{marginTop:60,fontSize:16}}>请填写学校名称或国家</Text>

                    <TextInput
                        onChangeText={(text) => submitObj['school'] = text}
                        placeholderTextColor='#727272'
                        placeholder='请输入信息'
                        returnKeyType={'done'}
                        style={{textAlign: 'center',borderColor:'rgb(111,111,111)',borderWidth:1,borderRadius:4,marginTop:20,width:width - 30,height:36}}
                    />
                    <Text style={{marginTop:20,fontSize:12,color:'rgb(144,144,144)'}}>【填写学校名时请标注学校所在国家】</Text>

                </View>


                <View style={styles.footerViewStyle}>
                    <TouchableOpacity activeOpacity={0.8} style={[styles.footerBtnStyle,{backgroundColor:global.params.backgroundColor}]}
                                      onPress={this.next.bind(this)}
                    >
                        <Text style={{fontSize:17,color:'white'}}>下一步</Text>
                    </TouchableOpacity>
                </View>


                <MessageBarAlert ref="alert"/>

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
    cellChooseStyle: {
        flexDirection: 'row',
    },
    rightRowStyle: {
        width: 8,
        height: 14,
        marginLeft: 8,
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
    subViewType: {
        marginRight: 14
    },
    cellTextInputStyle: {
        width: 180,
        height: 38,
        marginRight: 15,
        textAlign: 'right',
        color: global.params.backgroundColor,
        fontSize: 14
    },

    footerViewStyle:{
        position: 'absolute',
        left: 0,
        right: 0,
        height: 44,
        bottom: global.params.iPhoneXHeight,
        backgroundColor: 'white',
    },
    footerBtnStyle:{
        justifyContent:'center',
        alignItems:'center',
        height:44
    },
})