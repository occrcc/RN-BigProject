/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Dimensions,
    Platform,
    DeviceEventEmitter,
    BackHandler,
    View
} from 'react-native';

import Icomoon from 'react-native-vector-icons/Icomoon'
import TabNavigator from 'react-native-tab-navigator'
// import  BadgeView  from './BadgeView'
let {width, height} = Dimensions.get('window')
import Alert from 'rnkit-alert-view';


import Home from '../Home/EJRHome'
import Zixun from '../Zixun/EJRZixun'
import Chuo from '../Chuo/EJRChuo'
import Serve from '../Serve/EJRServe'
import Mine from '../Mine/EJRMine'
import px2dp from '../../Util/index'

import '../../common/GlobalContants'
import * as WeChat from 'react-native-wechat'
import SplashScreen from 'react-native-smart-splash-screen'
import storage from "../RNAsyncStorage";

// import Getui from 'react-native-getui'
import UmengPush from 'react-native-umeng-push';
var BadgeAndroid = require('react-native-android-badge');


var HomeServers = require('../Home/HomeServers')

var {NativeAppEventEmitter} = require('react-native');

var lastBackTime = ""
var receiveRemoteNotificationSub = null;
var resigsteClientIdSub = null;
var clickRemoteNotificationSub = null;

// 创建原生模块
var NativeTest = require('react-native').NativeModules.Native;


export default class Main extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            currentTab: 'Home',
            badge: [0, 0, 0, 0, 0],
            pushToken: null,
            userInfo: null
        }
        this.tabNames = [
            ["首页", "home", "Home", <Home {...this.props}/>],
            ["资讯", "zixun", "Zixun", <Zixun {...this.props}/>],
            ["Chuo", "chuo", "Chuo", <Chuo {...this.props}/>],
            ["服务", "serve", "Serve", <Serve {...this.props}/>],
            ["我的", "my", "Mine", <Mine {...this.props}/>]
        ]
        this.lastBackPressed = false;
    }

    componentWillMount() {
        storage.load({
            key: 'userInfo',
        }).then(ret => {
            this.setState({
                userInfo: ret,
            });
        })
        Platform.OS === 'ios' && NativeTest.addBadgeNumber(0);
    }

    componentDidMount() {
        // 方法调用
        this.updataPushToken = DeviceEventEmitter.addListener('updataPushToken', (res) => {
            if (Platform.OS === 'ios') {
                this.senderIosDeviceToken(this.state.pushToken, res);
            } else {
                this.senderAndroidDeviceToken(this.state.pushToken, res);
            }
        });

        WeChat.registerApp(global.payParams.wx_appid);
        if (Platform.OS === 'ios') {
            //获取DeviceToken
            UmengPush.getDeviceToken(deviceToken => {
                this.setState({pushToken: deviceToken});
                this.senderIosDeviceToken(deviceToken, this.state.userInfo);
            });

            //接收到推送消息回调
            UmengPush.didReceiveMessage(message => {
                DeviceEventEmitter.emit('ChuoUpLoadList');
                DeviceEventEmitter.emit('refreshBadge');
                // Alert.alert(
                //     '收到推送通知', message, [
                //         {text: '知道了', onPress: () => console.log('以后再说')},
                //     ],
                // );
            });

            //点击推送消息打开应用回调
            UmengPush.didOpenMessage(message => {
                console.log("didOpenMessage:", message);
            });

        } else {
            receiveRemoteNotificationSub = NativeAppEventEmitter.addListener(
                'receiveRemoteNotification',
                (notification) => {
                    //消息类型分为 cmd 和 payload 透传消息，具体的消息体格式会有差异
                    switch (notification.type) {
                        case "cid":
                            this.setState({pushToken: notification.cid});
                            // Alert.alert('初始化获取到cid',JSON.stringify(notification))
                            this.senderAndroidDeviceToken(notification.cid, this.state.userInfo);
                            break;
                        case "cmd":
                            // Alert.alert('cmd 消息通知',JSON.stringify(notification))
                            break;
                        case "payload":
                            // Alert.alert('payload 消息通知',JSON.stringify(notification))
                            // Alert.alert(
                            //     '收到推送', JSON.stringify(notification), [
                            //         {text: '知道了', onPress: () => console.log('以后再说')},
                            //     ],
                            // );
                            var payload = notification;
                            if (payload.sub_view === 'chuo') {
                                DeviceEventEmitter.emit('ChuoUpLoadList');
                            }
                            if (payload.sub_view === 'message') {
                                DeviceEventEmitter.emit('refreshBadge');
                            }
                            break;
                        default:
                    }
                }
            )
        }

        SplashScreen.close({
            animationType: SplashScreen.animationType.scale,
            duration: 850,
            delay: 500,
        })


        this.upLoadNavigator = DeviceEventEmitter.addListener('upLoadNavigator', res => {
            console.log('fadfad' + JSON.stringify(res));
            let badge = this.state.badge;
            badge[2] = res.chuo_count;
            badge[4] = res.message_count;
            this.setState({
                badge: badge
            })

            if (Platform.OS === 'ios'){
                NativeTest.addBadgeNumber(res.chuo_count);
            }else {
                BadgeAndroid.setBadge(parseInt(res.chuo_count));
            }
        });

        BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.props.navigator) {
                let routes = this.props.navigator.getCurrentRoutes();
                let lastRoute = routes[routes.length - 1]; // 当前页面对应的route对象
                if (lastRoute.onHardwareBackPress) {// 先执行route注册的事件
                    let flag = lastRoute.onHardwareBackPress();
                    if (flag === false) {// 返回值为false就终止后续操作
                        return true;
                    }
                }
                if (routes.length === 1) {// 在第一页了,2秒之内点击两次返回键，退出应用
                    if (this.lastBackPressed && (lastBackTime + 2000) >= Date.now()) {
                        return false;
                    }
                    //放一句话
                    this.lastBackPressed = true;
                    // 此处可以根据情况实现 点2次就退出应用，或者弹出rn视图等
                    //记录点击返回键的时间
                    lastBackTime = Date.now()
                    Alert.alert(
                        '提示', '再点一次将退出应用！', [
                            {text: '确定', onPress: () => console.log('以后再说')},
                        ],
                    );
                } else {
                    this.props.navigator.pop();
                }
            }
            return true;
        });
    }

    senderAndroidDeviceToken(deviceToken, res) {
        if (res) {
            HomeServers.senderAndroidDeviceToken(res.token, deviceToken).then(res => {
                console.log(res);
            }).catch(error => {
                console.log('error:  ' + error);
            })
        }
    }


    senderIosDeviceToken(deviceToken, res) {
        if (res) {
            HomeServers.senderIosDeviceToken(res.token, deviceToken).then(res => {
                console.log(res);
            }).catch(error => {
                console.log('error:  ' + error);
            })
        }
    }


    componentWillUnmount() {
        this.upLoadNavigator.remove();
        this.updataPushToken.remove();
        receiveRemoteNotificationSub && receiveRemoteNotificationSub.remove();
        clickRemoteNotificationSub && clickRemoteNotificationSub.remove();
        resigsteClientIdSub && resigsteClientIdSub.remove();
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', () => {
            });
        }
    }


    switchNav(name) {
        // console.log('switchNav:'+name)
        DeviceEventEmitter.emit('senderAppInfo', name);
        this.setState({currentTab: name})
        if (name === 'Chuo') {
            console.log('通知刷新chuo界面')
            DeviceEventEmitter.emit('ChuoUpLoadList');
        }
    }

    render() {
        var selectColro = global.params.backgroundColor;
        return (
            <TabNavigator tabBarStyle={styles.tabbar}>
                {
                    this.tabNames.map((item, i) => {
                        return (
                            <TabNavigator.Item
                                key={i}
                                //renderBadge={() => <BadgeView />}
                                badgeText={this.state.badge[i] > 0 ? this.state.badge[i] : ""}
                                tabStyle={styles.tabStyle}
                                title={item[0]}
                                selected={this.state.currentTab === item[2]}
                                selectedTitleStyle={{color: global.params.backgroundColor}}
                                renderIcon={() => <Icomoon name={item[1]} size={px2dp(22)} color="#666"/>}
                                renderSelectedIcon={() => <Icomoon name={item[1].replace(/\-outline$/, "")}
                                                                   size={px2dp(22)} color={selectColro}/>}
                                onPress={() => this.switchNav(item[2])}>
                                {item[3]}
                            </TabNavigator.Item>
                        )
                    })
                }
            </TabNavigator>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    tabbar: {
        height: 49 + global.params.iPhoneXHeight,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    hide: {
        transform: [
            {translateX: width}
        ]
    },
    tabStyle: {
        padding: px2dp(0),
        marginBottom: global.params.iPhoneXHeight,
        marginTop: 5,
    }
});

