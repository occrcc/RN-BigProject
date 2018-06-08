import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    StatusBar,
    Image,
    ScrollView,
    TouchableOpacity,
    Text,
    TextInput,
    DeviceEventEmitter,
    InteractionManager,
    Platform,
    Keyboard
} from 'react-native'

var ServeApi = require('../ServeApi/ServeApi')
let {width,height} = Dimensions.get('window')
import NavBar from '../../Componnet/NavBar'
import ChooseList from './ChooseList'
import ActionSheet from 'react-native-actionsheet'
import ChooseSchoolVC from "../../Mine/MineOtherPages/ChooseSchoolVC";
import Alert from 'rnkit-alert-view';
import ServeHtml from '../ServeHtml/ServeXCJieji'
import {Navigator} from 'react-native-deprecated-custom-components'
import DatePicker from 'react-native-datepicker'
import Modal from 'react-native-modal'
var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import StudentInfo from './ServeUnionStudentInfo'

var submitObj = {}
var regAmount = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;


export default class ServeUnionpay extends Component {

    constructor(props) {
        super(props)
        this.state={
            huilv:0.00,
            allPrice:0.00,
            countryItem:null,
            input_amount:0.00,
            collegeType:['Cancel', '微信好友', '分享到QQ'],
            fee_type:'',
            school_name:'',
            isZuer:true,
            showZuer:'使用服务 +25(USD)',
            minDate:'2018-01-01',
            isModalVisible: false,
            showDate:'2018-01-01',
            keybordShow:true
        }
        this.dataSource = [
            {
                fieldName: 'country_name',
                fieldType: 3,
                title: '选择国家',
                textfieldType: '',
                fieldPlaceHolder: '请选择国家',
                defaultValue: ''
            },
            {
                fieldName: 'school_name',
                fieldType: 3,
                title: '学校名称',
                textfieldType: '',
                fieldPlaceHolder: '请选择学校',
                defaultValue: ''
            },
            {
                fieldName: 'fee_type',
                fieldType: 3,
                title: '费用类别',
                textfieldType: '',
                fieldPlaceHolder: '请选择费用类别',
                defaultValue: ''
            },
            {
                fieldName: 'attime',
                fieldType: 3,
                title: '缴费截止时间',
                textfieldType: '',
                fieldPlaceHolder: '截止时间至少大于3个工作日',
                defaultValue: ''
            },
            {
                fieldName: 'input_amount',
                fieldType: 1,
                title: '金额',
                textfieldType: 'numeric',
                fieldPlaceHolder: '请输入金额',
                defaultValue: ''
            },
            {
                fieldName: 'empty',
                fieldType: 0,
                title: '汇率',
                textfieldType: 'default',
                fieldPlaceHolder: '请填写学校',
                defaultValue: ''
            },
            {
                fieldName: 'empty',
                fieldType: 0,
                title: '预估价格',
                textfieldType: '',
                fieldPlaceHolder: '',
                defaultValue: '',
            }
        ]
    }

    back() {
        this.props.navigator.pop()
    }

    componentWillMount() {
        var myDate = new Date();
        myDate.setDate(myDate.getDate() + 3);
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var _format = function (number) {
            return (number < 10 ? ('0' + number) : number);
        };
        let getMineDate = myDate.getFullYear() + "-" + _format(month) + "-" + _format(day);
        this.setState({minDate: getMineDate,showDate:getMineDate});
        submitObj['attime'] = getMineDate;
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ()=>{this.setState({keybordShow:false})});
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', ()=>{this.setState({keybordShow:true})});

    }


    componentDidMount() {

        MessageBarManager.registerMessageBar(this.refs.alert);
        submitObj['use_full'] = '1';
        submitObj['chooseType'] = '0';
        this.chooseSchool = DeviceEventEmitter.addListener('chooseSchool',(schoolItem) =>{
            console.log(schoolItem);
            submitObj['school_id'] = schoolItem.id;
            submitObj['school_name'] = schoolItem.name;
            this.setState({school_name:schoolItem.name})
        })

        this.union_choose_country = DeviceEventEmitter.addListener('union_choose_country',(countryItem) =>{
            console.log(countryItem);
            let showZuer = '使用服务 +' + countryItem.full_surcharge + '(' + countryItem.currency_short + ')';
            submitObj['country_name'] = countryItem.name;
            submitObj['country_id'] = countryItem.id;
            submitObj['currency_icon'] = countryItem.currency_icon;
            submitObj['foreignCoin'] = countryItem.full_surcharge;
            submitObj['collect_params'] = countryItem.collect_params;

            let allPrice = parseFloat(countryItem.currency_exchange_rate) * parseFloat(this.state.input_amount);
            if (this.state.isZuer){
                let full_surcharge = parseFloat(countryItem.full_surcharge) * parseFloat(countryItem.currency_exchange_rate);
                allPrice += full_surcharge;
            }
            allPrice = Math.ceil(allPrice );
            this.setState({showZuer:showZuer,allPrice:allPrice,countryItem:countryItem,huilv:countryItem.currency_exchange_rate},()=>{
                console.log(submitObj);
            });
        })

        InteractionManager.runAfterInteractions(()=>{
            ServeApi.getCollegeType().then(res=>{
                res.unshift('取消');
                this.setState({collegeType:res});
            }).catch(error=>{
                console.log(error);
            })
        })
    }

    componentWillUnmount() {
        submitObj={};
        this.chooseSchool.remove();
        this.union_choose_country.remove();
        MessageBarManager.unregisterMessageBar();
    }

    handlePress(i) {
        if (i === 0) return;
        submitObj['fee_type'] = this.state.collegeType[i];
        this.setState({fee_type:this.state.collegeType[i]});
    }

    handleInput = (textVal, fieldName,) => {
        console.log('textVal : ' + textVal);
        if (regAmount.test(textVal)) {
            submitObj[fieldName] = textVal;
            let allPrice = parseFloat(this.state.huilv) * parseFloat(textVal);
            if (this.state.isZuer && submitObj['foreignCoin']) {
                let fore = parseFloat(submitObj['foreignCoin']) * parseFloat(this.state.huilv);
                allPrice += fore;
            }
            allPrice = Math.ceil(allPrice );
            this.setState({input_amount:textVal,allPrice:allPrice},()=>{
            })
        }else{
            this.setState({input_amount:textVal,allPrice:0.00},()=>{

            })
        }
    }

    didSelectRow(item){
        console.log(item.fieldName);
        if (item.fieldName === 'country_name'){
            ServeApi.getCountryList().then(res=>{

                this.props.navigator.push({
                    component: ChooseList,
                    params: {countrys:res},
                })
            }).catch(error=>{
                console.log('error  ' + error);
            })
        }else if (item.fieldName === 'fee_type') {
            this.ActionSheet.show();
        }else if (item.fieldName === 'school_name') {
            this.props.navigator.push({
                component: ChooseSchoolVC,
                params: {isUniopay:true,country_id:submitObj['country_id']},
            })
        }
    }

    readerRow(item, i) {
        if (item.fieldType === 3) {
            return (
                <TouchableOpacity activeOpacity={0.8} key={i} style={styles.cellContentViewStyle}
                                  onPress={this.didSelectRow.bind(this,item)}>
                    <View>
                        <Text style={styles.cellTitleStyle}>{item.title}</Text>
                    </View>
                    <View style={{flexDirection:'row',marginRight:15,alignItems:'center'}}>
                        {this.dateRightView(item)}
                        <Image source={{uri: 'right_go'}} style={styles.rightRowStyle}/>
                    </View>
                </TouchableOpacity>
            )
        } else if (item.fieldType === 1) {
            return (
                <View key={i} style={styles.cellContentViewStyle}>
                    <View>
                        <Text style={styles.cellTitleStyle}>{item.title}</Text>
                    </View>
                    <TextInput placeholder={item.fieldPlaceHolder} placeholderTextColor='#727272'
                               style={{marginRight:15,width:200,color: global.params.backgroundColor, fontSize: 14,  height: 38, textAlign: 'right'}}
                               defaultValue={item.defaultValue}
                               onChangeText={(textVal) => this.handleInput(textVal, item.fieldName)}
                               underlineColorAndroid='transparent'
                               returnKeyType='done'
                               keyboardType={item.textfieldType}
                    >
                    </TextInput>
                </View>
            )
        } else if (item.fieldType === 0) {
            return (
                <View key={i} style={styles.cellContentViewStyle}>
                    <View>
                        <Text style={styles.cellTitleStyle}>{item.title}</Text>
                    </View>
                    <View>
                        <Text style={{
                            fontSize: 14,
                            color: '#727272',
                            marginRight:14
                        }}>{item.title === '汇率' ? this.state.huilv : ('￥ ' + this.state.allPrice)}</Text>
                    </View>
                </View>
            )
        }
    }


    changeDate(date){
        console.log(date);
        submitObj['attime'] = date;
        this.setState({showDate:date});
    }

    dateRightView(item){
        if(item.fieldName === 'attime'){
            return (
                <DatePicker
                    style={{ width: 160, justifyContent: 'flex-end', alignItems: 'flex-end', }}
                    date={this.state.showDate}
                    mode="date"
                    minDate={this.state.minDate}
                    confirmBtnText="确定"
                    cancelBtnText="取消"
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
                        dateText:{
                            fontSize: 14,
                            color: '#727272'
                        }
                    }}
                    hideText={false}  //不显示日期文本
                    onDateChange={(datetime) => { this.changeDate(datetime)}}
                />
            )
        }else {
            return (
                <Text style={{
                    fontSize: 14,
                    color: '#727272'
                }}>{submitObj[item.fieldName] ? submitObj[item.fieldName] : item.fieldPlaceHolder}</Text>
            )
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

    buildbuttombar(){
        if (this.state.keybordShow){
            return (
                <View style={styles.footerViewStyle}>
                    <TouchableOpacity activeOpacity={0.8} style={[styles.footerBtnStyle,{backgroundColor:'rgb(240,143,43)'}]}
                                      onPress={()=>{
                                          this.setState({isModalVisible:true})
                                      }}
                    >
                        <Text style={{fontSize:15,color:'white'}}>预订须知</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={[styles.footerBtnStyle,{backgroundColor:global.params.backgroundColor}]}
                                      onPress={this.next.bind(this)}
                    >
                        <Text style={{fontSize:17,color:'white'}}>下一步</Text>
                    </TouchableOpacity>
                </View>
            )
        }else{
            return null
        }
    }


    next(){

        if (!submitObj.hasOwnProperty('country_name') || submitObj['country_name'].length < 1 ){
            this.showAlert('请选择国家');
            return;
        }else if (!submitObj.hasOwnProperty('school_id') || submitObj['school_id'].length < 1){
            this.showAlert('请选择学校');
            return;
        }else if (!submitObj.hasOwnProperty('fee_type') || submitObj['fee_type'].length < 1){
            this.showAlert('请选择费用类别');
            return;
        }else if (!submitObj.hasOwnProperty('attime') || submitObj['attime'].length < 1){
            this.showAlert('请选择缴费时间');
            return;
        }else if (!submitObj.hasOwnProperty('input_amount') || submitObj['input_amount'].length < 1){
            this.showAlert('请输入金额');
            return;
        }else if (!regAmount.test(submitObj['input_amount'])) {
            this.showAlert('金额格式不正确');
            return;
        }
        submitObj['pre_amount'] = this.state.allPrice;
        if (parseInt(this.state.allPrice) < 10000){

            Alert.alert(
                '说明', '1、银联汇款仅可提交金额在￥10000以上的订单。\n2、如您需要支付费用低于￥10000，请至【Visa支付】板块查询，如无您需要的服务，可通过以下方式联系我们：\n【国内】021-61984772（工作日9-18点）\n【官方QQ】4288 5810', [
                    {text: '知道了', onPress: () => console.log('知道了')},
                ],
            );
            return;
        }
        this.props.navigator.push({
            component: StudentInfo,
            params: {submitObj:submitObj},
        })
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
                <NavBar
                    title='银联汇款'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <Image source={{uri: 'unionpay1'}} style={styles.headerImageStyle}/>
                <ScrollView>
                    {this.dataSource.map((item, i) => {
                        return (
                            <View key={i}>
                                {this.readerRow(item, i)}
                            </View>
                        )
                    })}
                    <View>
                        <TouchableOpacity activeOpacity={0.6} style={{marginTop:20,alignItems:'center',flexDirection:'row',marginLeft:15}}
                                          onPress={()=>{
                                              Alert.alert(
                                                  '说明', '足额到账费是资金在跨境转款时由中间银行收取的手续费。\n资金周转过程中，中间行会直接从您的转款金额里面自动扣除。例如您需要转款 $10,000 实际到达账户的金额是 $9,975 左右，在银行柜台电汇也是会有这个费用的。\n因此如果您希望足额到账，请附加支付这部分费用。\n也欢迎您到任何一家可以做外汇业务的银行核实该项费用的真实性。', [
                                                      {text: '知道了', onPress: () => console.log('知道了')},
                                                  ],
                                              );
                                          }}>
                            <Text>足额到账服务</Text>
                            <Image source={{uri:'icon_zue'}} style={{marginLeft:8,width:16,height:16}}/>
                        </TouchableOpacity>
                        <View style={{flexDirection:'row',height:70,}}>
                            <TouchableOpacity activeOpacity={0.8} style={styles.zueStyle} onPress={()=>{
                                let allPrice = 0.00;
                                if(this.state.huilv > 0){
                                    allPrice = parseFloat(this.state.huilv) * parseFloat(this.state.input_amount);
                                    let fore = parseFloat(submitObj['foreignCoin']) * parseFloat(this.state.huilv);
                                    allPrice += fore;
                                    allPrice = Math.ceil(allPrice );
                                }
                                this.setState({allPrice:allPrice,isZuer:true},()=>{
                                    submitObj['use_full'] = '1';
                                })
                            }}>
                                <Image source={{uri:this.state.isZuer ? 'icon_gouxuan' : 'icon_circle'}} style={{marginRight:8,width:14,height:14}}/>
                                <Text style={{fontSize:12}}>{this.state.showZuer}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} style={[styles.zueStyle,{marginRight:15}]} onPress={()=>{
                                let allPrice = parseFloat(this.state.huilv) * parseFloat(this.state.input_amount);
                                allPrice = Math.ceil(allPrice );
                                this.setState({allPrice:allPrice,isZuer:false},()=>{
                                    submitObj['use_full'] = '0';
                                    Alert.alert(
                                        '注意', '如学费未能足额到账，部分学校将视为未缴清学费，逾期会影响学生选课，甚至会罚款，银行国际电汇也会扣除该费用。', [
                                            {text: '知道了', onPress: () => console.log('知道了')},
                                        ],
                                    );
                                })
                            }}>
                                <Image source={{uri:this.state.isZuer ? 'icon_circle' : 'icon_gouxuan'}} style={{marginRight:8,width:14,height:14}}/>
                                <Text style={{fontSize:12}}>不使用服务</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}
                                      onPress={()=>{
                                          this.props.navigator.push({
                                              sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                                              component: ServeHtml,
                                              params: {title:'服务协议',webUrl:'http://m.ejiarens.com/banban/college_pay_agreement'},
                                          })
                                      }}>
                        <Image source={{uri:'icon_gouxuan'}} style={{width:14,height:14}}/>
                        <Text style={{marginLeft:8,fontSize:13,color:'black'}}>同意《<Text style={{color:'red'}}>学费代理支付服务协议</Text>》</Text>
                    </TouchableOpacity>
                </ScrollView>

                {this.buildbuttombar()}

                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={this.state.collegeType}
                    cancelButtonIndex={0}
                    onPress={this.handlePress.bind(this)}
                />

                <MessageBarAlert ref="alert"/>

                <Modal  isVisible={this.state.isModalVisible} >
                    <View style={{ flex: 1,width:width,height:height }}>
                        <View ref='detailView' style={styles.popViewStyle} >
                            <Text style={{marginTop:20,letterSpacing: 1, lineHeight: 18,margin:15,color: '#969696', fontSize: 12,}}>
                                1、您的“缴费截止时间”至少大于3个工作日，如遇节假日还将作顺延（节假日及周末，国内银行无外汇牌价，无法交易）。
                                {'\n'}2、本订单只用于汇款到学校，不能汇款至个人帐户。
                                {'\n'}3、请正确填写个人信息，如因信息填写错误导致的损失，您需要自行承担。
                                {'\n'}4、关于取消订单：一旦汇出，不可取消。
                                {'\n'}5、系统将在3小时后根据汇率重新调整付款金额。请您尽快完成转账/汇款。
                                {'\n'}6、费用中包含的“足额到账费”是资金在跨境转款时由中间银行收取的手续费。资金周转过程中，中间行会直接从您的转款金额里面自动扣除。例如您需要转款 $10,000 实际到达账户的金额是 $9,975 左右，在银行柜台电汇也是会有这个费用的。
                                {'\n'}7、如您有任何疑问，请联系客服：（国内）021-61984772（工作日9-18点）</Text>
                            <TouchableOpacity activeOpacity={0.8} style={styles.popContentViewStyle}
                                              onPress={()=>{
                                                  this.setState({isModalVisible:false})
                                              }}
                            >
                                <Text style={{fontSize: 16, color: '#ffffff'}}>知道了</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    headerImageStyle: {
        width: width,
        height: 34,
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
    rightRowStyle: {
        width: 8,
        height: 14,
        marginLeft: 8,
    },
    zueStyle:{
        height:38,
        backgroundColor:'white',
        flex:3,
        marginTop:14,
        alignItems:'center',
        flexDirection:'row',
        marginLeft:15,
        borderRadius:4,
        borderColor:'rgb(188,188,188)',
        borderWidth:0.5,
        justifyContent:'center'
    },
    popViewStyle:{
        width:width - (Platform.OS === 'ios' ? 0 : 40),
        backgroundColor:'white',
        position: 'absolute',
        bottom:0,
        left:Platform.OS === 'ios' ? -20 : 0,
        right:0
    },
    footerViewStyle:{
        position: 'absolute',
        left: 0,
        right: 0,
        height: 88,
        bottom: global.params.iPhoneXHeight,
        backgroundColor: 'white',
    },
    footerBtnStyle:{
        justifyContent:'center',
        alignItems:'center',
        height:44
    },
    popContentViewStyle:{

        marginLeft: 14,
        width:Platform.OS === 'ios' ? width-28 : width - 68,
        marginTop:20,
        height:40,
        marginBottom:20 + global.params.iPhoneXHeight,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor:global.params.backgroundColor
    },
});