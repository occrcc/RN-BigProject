import React, {Component} from 'react'
import {
    View,
    StatusBar,
    DeviceEventEmitter,
    Image,
    Platform,
    InteractionManager
} from 'react-native'

import storage from "../RNAsyncStorage";
var HomeServers  = require('./HomeServers')

import Alert from 'rnkit-alert-view';
import LoginVC from '../Main/LoginVC'
import {Navigator} from 'react-native-deprecated-custom-components'
import ServeHtml from '../Serve/ServeHtml/ServeHtml'
import ServeZufang from '../Serve/ServeWeights/ServeZuFang'
import ServeList from '../Serve/ServeList/ServeList'
import ServeXCJieji from '../Serve/ServeHtml/ServeXCJieji'
import VisaPay from '../Serve/VisaPay/VisaPay'
import UnionPay from '../Serve/ServeHtml/UnionPay'
import ServeJieji from '../Serve/ServeJieji/JiejiHome'
import ZixunWeb from '../Zixun/ZixunHtmlView'
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import HomeStudyAbroad from './HomeStudyAbroad'
import GPA from './GPA'
import DeviceInfo from 'react-native-device-info'
import HomeGeneral from './OgnzHomePages/HomeGeneral'

var ServeApi  = require('../Serve/ServeApi/ServeApi')
var UserInfoServe = require('../Mine/Servers/UserInfoServes')
import HomeHtml from './OgnzHomePages/HomeHtml'
import HomeSubmitDem from './OgnzHomePages/HomeSubmitDem'
import HomeSubmitZixun from './OgnzHomePages/HomeSubmitZixun'

// 创建原生模块
var NativeTest = require('react-native').NativeModules.Native;

// import Home from "./OgnzHomePages/Home286" ;
// import Home from "./OgnzHomePages/Home287" ;
import Home from "./OgnzHomePages/Home163" ;
// import Home from "./OgnzHomePages/Home288" ;
// import Home from "./OgnzHomePages/Home289" ;
// import Home from "./OgnzHomePages/Home290" ;

//code-push
import codePush from 'react-native-code-push'

export default class EJRHome extends Component {
    constructor(props) {
        super(props)
        this.state={
            userInfo:null,
            headImageUrl:'',
            headImageArr:[],
            activities:[],
        }
    }

    componentWillMount() {
        this.getUserInfo();
        this.getTopImage();
    }

    componentDidMount() {

        codePush.sync();

        storage.save({
            key: 'newFeature',
            data: 'newFeature',
        });

        // storage.remove({
        //     key: 'newFeature',
        // })

        MessageBarManager.registerMessageBar(this.refs.alert);
        this.uploadServeUserInfo = DeviceEventEmitter.addListener('uploadServeUserInfo', () => {
            this.getUserInfo();
        });

        this.homeDidSelectMiddleItem = DeviceEventEmitter.addListener('homeDidSelectMiddleItem', (item) => {
            this.selectItem(item);
            console.log('homeDidSelectMiddleItem,  ' ,item);
        });

        this.homeDidSelectRow = DeviceEventEmitter.addListener('homeDidSelectRow', (item) => {
            this.selectRow(item,false);
        });

        this.didSelectHeadImage = DeviceEventEmitter.addListener('didSelectHeadImage', (item) => {
            console.log('didSelectHeadImage,  ' ,item);
            this.selectItem(item.clickParam);
        });

        this.didSelectActivitieItem = DeviceEventEmitter.addListener('didSelectActivitieItem', (item) => {
            this.didSelectActivitieItemFun(item);
        });

        this.homeDidSelectTopItem = DeviceEventEmitter.addListener('homeDidSelectTopItem', (item) => {
            this.selectTopItem(item);
        });

        this.refreshBadge = DeviceEventEmitter.addListener('refreshBadge', () => {
            this.getUserInfo();
        });

        this.appInfo = DeviceEventEmitter.addListener('senderAppInfo', (eventName) => {
            this.sendAppInfo(eventName);
        });

        InteractionManager.runAfterInteractions(()=>{
            this.sendAppInfo('首页');
        });
    }

    didSelectActivitieItemFun(item){
        console.log('didSelectActivitieItem,  ' ,item);
        if(!this.state.userInfo){
            this.showAlert();
            return;
        }

        this.props.navigator.push({
            component: HomeHtml,
            params: {userInfo:this.state.userInfo,title:item.title ? item.title:'活动',item:item},
        })
    }

    getTopImage() {
        ServeApi.getTopImage().then(res => {
            storage.save({
                key: global.params.AppLaunchPic,
                data: res.app_launch_pic,
            })

            Platform.OS === 'ios' && NativeTest.saveAppXHLaunchAd(res.app_launch_pic);
            if (res.index_banners.length > 0) {
                this.setState({headImageUrl:res.index_banners});
            }
            if (res.index_bannerList.length > 0) {
                this.setState({headImageArr:res.index_bannerList});
            }

            if (res.activities.length > 0){
                this.setState({activities:res.activities});
            }

        }).catch(err => {
            console.log('error  ' + err);
        })
    }

    // 传原生一个字符串 + 回调
    callBackOne = ()=>{
        NativeTest.testCallbackEventOne(('我是RN给原生的'),(error, events) => {
            if (error) {
                console.error(error);
            } else {
                alert(events)
            }
        })
    }

    async sendAppInfo(eventName){
        if (eventName === "Mine") {
            eventName = '我的';
        }else if (eventName === "Zixun") {
            eventName = '资讯';
        }else if (eventName === "Serve") {
            eventName = '服务';
        }else if (eventName === "Home") {
            eventName = '首页';
        }

        let ipAddress = '';
        if (Platform.OS === 'ios') {
            ipAddress = ''
        }else {
            ipAddress =  await DeviceInfo.getIPAddress().then(ip => {
                return ip;
            });
        }
        setTimeout(()=>{
            let userId = this.state.userInfo ? this.state.userInfo.user.id : 0;
            let type = Platform.OS === 'ios' ? 0 : 1;
            UserInfoServe.sendAppInfo(userId,type,eventName,ipAddress).then(res=>{
                // console.log(res);
            }).catch(error=>{
                // console.log('error: ' + error);
            })
        },500);
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
        this.uploadServeUserInfo.remove();
        this.homeDidSelectMiddleItem.remove();
        this.homeDidSelectRow.remove();
        this.homeDidSelectTopItem.remove();
        this.refreshBadge.remove();
        this.appInfo.remove();
        this.didSelectHeadImage.remove();
        this.didSelectActivitieItem.remove();
    }

    rightPress(name) {
        this.props.navigator.push({
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            component: name,
        });
    }

    showAlert(){
        Alert.alert(
            '提示', '没有检测到您的账号', [
                {text: '以后再说', onPress: () => console.log('以后再说')},
                {
                    text: '去登陆', onPress: () => {
                    this.rightPress(LoginVC)
                }
                },
            ],
        );
    }

    notifeNavigator(ret){
        HomeServers.getNavigatorBadge(ret.token).then(res=>{
            DeviceEventEmitter.emit('upLoadNavigator',res);
        }).catch(err=>{
            console.log(err);
        })
    }

    getUserInfo() {
        storage.load({
            key: 'userInfo',
        }).then(ret => {
            this.setState({userInfo:ret});
            this.notifeNavigator(ret);
            DeviceEventEmitter.emit('updataPushToken',ret);
        }).catch(err => {
            console.log('未检测到账号：' + err.name);
            this.setState({userInfo:null});
        })
    }

    selectRow(item,isHeader){

        console.log('selectItem:',item);
        this.props.navigator.push({
            component: ZixunWeb,
            params: {sorce:item,isHeader:isHeader},
        })
    }


    selectTopItem(item){

        let title = item[0];
        let name = null;
        let step = null;
        let id = item[2];
        if (title === '留学申请'){
            name = HomeStudyAbroad;
        }else if (title === 'GPA计算'){
            name = GPA;
        }else if (title === '语言测评'){
            name = null;
        }else if (title === '背景提升'){
            name = null;
        }else if (title === '留学荟'){
            name = HomeGeneral;
            step = item[2];
        }else if (title === '行业培训'){
            name = HomeGeneral;
            step = item[2];
        }else if (title === '留学咨询'){
            name = HomeStudyAbroad;
        }else if (title === '成功案例'){
            name = HomeGeneral;
            step = item[2];
        }else if (title === '精品课程'){
            name = HomeGeneral;
            step = item[2];
        }else if (title === '特色服务'){
            name = HomeGeneral;
            step = item[2];
        }else if (title === '团队服务'){
            name = HomeGeneral;
            step = item[2];
        }else if (title === '名师风采'){
            name = HomeGeneral;
            step = item[2];
        }else if (title === '职业评测'){
            name = HomeHtml;
        }else if (id === -1 && title === '课程申请'){
            name = HomeSubmitDem;
        }else if (id === -1 && title === '语言申请'){
            name = HomeSubmitZixun;
        }

        if  (name) {
            if (name !== HomeGeneral && !this.state.userInfo && name !== GPA) {
                this.showAlert();
                return;
            }
            this.props.navigator.push({
                component: name,
                params: {categraryId:step,userInfo:this.state.userInfo,title:title},
            })
        }else {
            this.alertMessage();
        }
    }

    alertMessage(){
        Alert.alert(
            '提示', '该功能暂未开放，敬请期待！', [
                {text: '好的'},
            ],
        );
    }

    selectItem(item) {
        if(!this.state.userInfo){
            this.showAlert();
            return;
        }

        console.log(item);
        if(item.view === 'v5'){
            console.log('v5');
            this.pushView(ServeHtml,item);
        }else if(item.view === 'v2'){
            console.log('v2');
            if (item.id === 7){
                this.pushView(ServeZufang,item);
            }else if (item.id === 2){
                this.pushView(ServeJieji,item);
            }else {
                this.pushView(ServeList,item);
            }
        }else if(item.view === 'v6'){
            this.props.navigator.push({
                component: ServeXCJieji,
                params: {userInfo:this.state.userInfo,title:'国际机票'},
            })
        }else if(item.view === 'v7'){
            this.props.navigator.push({
                component: ServeXCJieji,
                params: {webUrl:item.url,title:'存款证明'},
            })
        }else if(item.view === 'v1'){
            this.props.navigator.push({
                component: UnionPay,
                params: {userInfo:this.state.userInfo,item:item},
            })
        }else if(item.view === 'v8'){
            console.log('v8');
            this.pushView(VisaPay,item);
        }else if(item.view === 'v9'){
            console.log('v9');
            this.selectRow(item,true);
        }
    }

    pushView(name,item){
        this.props.navigator.push({
            component: name,
            params: {item:item,userInfo:this.state.userInfo},
        })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white",}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                    backgroundColor={global.params.backgroundColor}
                    // backgroundColor='white'
                />
                <Home activities={this.state.activities} headImageUrl={this.state.headImageUrl} headImageArr={this.state.headImageArr}/>
                <MessageBarAlert ref="alert"/>
            </View>
        )
    }
}
