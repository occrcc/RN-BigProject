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
    Platform
} from 'react-native'

var ServeApi = require('../ServeApi/ServeApi')
let {width,height} = Dimensions.get('window')
import NavBar from '../../Componnet/NavBar'
// import ChooseList from './ChooseList'
import ActionSheet from 'react-native-actionsheet'
import ChooseAddress from "../../Mine/MineOtherPages/ChooseAddress";
// import Alert from 'rnkit-alert-view';
import DatePicker from 'react-native-datepicker'
var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import storage from '../../RNAsyncStorage'

var submitObj = {}
// var regAmount = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;

export default class ServeUnionDemand extends Component {

    constructor(props) {
        super(props)
        this.state={
            collegeType:['Cancel', '微信好友', '分享到QQ'],
            fee_type:'',
            school_name:'',
            isZuer:true,
            minDate:'2018-01-01',
            showDate:'2018-01-01',
            userInfo:null,
        }
        this.dataSource = [
            {
                fieldName: 'country_name',
                fieldType: 3,
                title: '目的地国家',
                textfieldType: '',
                fieldPlaceHolder: '请选择国家',
                defaultValue: ''
            },
            {
                fieldName: 'school_name',
                fieldType: 1,
                title: '学校名称',
                textfieldType: 'default',
                fieldPlaceHolder: '请输入您要去的学校名称',
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
                fieldName: 'contact_name',
                fieldType: 1,
                title: '需求人姓名',
                textfieldType: 'default',
                fieldPlaceHolder: '请输入需求人姓名',
                defaultValue: ''
            },
            {
                fieldName: 'contact_phone',
                fieldType: 1,
                title: '联系电话',
                textfieldType: 'numeric',
                fieldPlaceHolder: '我们会尽快联系您',
                defaultValue: ''
            },
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

    }

    getUserInfo(){
        storage.load({
            key: 'userInfo',
            autoSync: true
        }).then(res=>{
            this.setState({userInfo:res});
            submitObj['access_token'] = res.token;
        }).catch(err=>{
            this.setState({userInfo:null});
        })
    }

    componentDidMount() {

        MessageBarManager.registerMessageBar(this.refs.alert);
        this.chooseSchool = DeviceEventEmitter.addListener('chooseCitys',(schoolItem) =>{
            console.log(schoolItem);
            // submitObj['country_id'] = schoolItem.id;
            submitObj['country_name'] = schoolItem.name;
        })

        InteractionManager.runAfterInteractions(()=>{
            this.getUserInfo();
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
        MessageBarManager.unregisterMessageBar();
    }

    handlePress(i) {
        if (i === 0) return;
        submitObj['fee_type'] = this.state.collegeType[i];
        this.setState({fee_type:this.state.collegeType[i]});
    }



    handleInput = (textVal, fieldName,) => {
        submitObj[fieldName] = textVal;
    }

    didSelectRow(item){
        console.log(item.fieldName);
         if (item.fieldName === 'fee_type') {
            this.ActionSheet.show();
        }else if (item.fieldName === 'country_name') {
            this.props.navigator.push({
                component: ChooseAddress,
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
                        // keyboardType='numeric'
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

    showAlert(message,type){
        MessageBarManager.showAlert({
            alertType: type,
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

        if (!submitObj.hasOwnProperty('country_name') || submitObj['country_name'].length < 1 ){
            this.showAlert('请选择国家');
            return;
        }else if (!submitObj.hasOwnProperty('school_name') || submitObj['school_name'].length < 1){
            this.showAlert('请输入你要去的学校名称');
            return;
        }else if (!submitObj.hasOwnProperty('fee_type') || submitObj['fee_type'].length < 1){
            this.showAlert('请选择费用类别');
            return;
        }else if (!submitObj.hasOwnProperty('attime') || submitObj['attime'].length < 1){
            this.showAlert('请选择缴费时间');
            return;
        }else if (!submitObj.hasOwnProperty('contact_name') || submitObj['contact_name'].length < 1){
            this.showAlert('请输入需求人姓名');
            return;
        }else if (!submitObj.hasOwnProperty('contact_phone') || submitObj['contact_phone'].length < 1){
            this.showAlert('请输入联系人电话');
            return;
        }
        console.log(submitObj);
        ServeApi.submitUnionNoSchool(submitObj).then(res=>{
            console.log(res);
            this.showAlert('提交成功，伴伴将在2个工作日联系您, 请保持手机畅通。','success');
            setTimeout(()=>{
                this.props.navigator.popToTop();
            },2500);
        }).catch(error=>{
            console.log('error:  ' + error);
            this.showAlert(error,'error');
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
                <ScrollView>
                    {this.dataSource.map((item, i) => {
                        return (
                            <View key={i}>
                                {this.readerRow(item, i)}
                            </View>
                        )
                    })}

                    <View style={{margin:20}}>
                        <Text style={{lineHeight:16,color:'rgb(204, 67, 38)',fontSize:14}}>【注】您提交需求后的2个工作日内，伴伴将与您联系，核实需求，请注意接听。</Text>
                    </View>

                </ScrollView>

                <View style={styles.footerViewStyle}>
                    <TouchableOpacity activeOpacity={0.8} style={[styles.footerBtnStyle,{backgroundColor:global.params.backgroundColor}]}
                                      onPress={this.next.bind(this)}
                    >
                        <Text style={{fontSize:17,color:'white'}}>提交需求</Text>
                    </TouchableOpacity>
                </View>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={this.state.collegeType}
                    cancelButtonIndex={0}
                    onPress={this.handlePress.bind(this)}
                />
                <MessageBarAlert ref="alert"/>
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
        position: 'absolute',
        left: -20,
        right: 0,
        bottom: 0,
        backgroundColor:'white',

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
    popContentViewStyle:{
        // bottom:40 + global.params.iPhoneXHeight,
        // height:40,
        // left:14,
        // right:14,
        marginLeft: 14,
        width:width-28,
        marginTop:20,
        height:40,
        marginBottom:20 + global.params.iPhoneXHeight,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor:global.params.backgroundColor
    },
});