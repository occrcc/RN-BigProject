import React, {Component} from 'react'
import {
    Text,
    View,
    ScrollView,
    Image,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    RefreshControl,
    StatusBar,
    DeviceEventEmitter,
    TouchableOpacity,
    Platform

} from 'react-native'

import {Navigator} from 'react-native-deprecated-custom-components'

import Alert from 'rnkit-alert-view';
import px2dp from '../../../Util'
import NavBar from '../../Componnet/NavBar'
// import SetSearchVC from './MineOtherPages/SetSearchVC'
import MyCollectVC from '../MineOtherPages/MyCollectVC'

import MyFriendVC from '../MineOtherPages/MyFriendVC'
import MyWalletVC from '../MineOtherPages/MyWalletVC'
import InvitationCodeVC from '../MineOtherPages/InvitationCodeVC'
import OftenInfoVC from '../MineOtherPages/OftenInfoVC'
import AccountSecurityVC from '../MineOtherPages/AccountSecurityVC'
import MyInfo from '../MineOtherPages/MyInfoVC'
import LoginVC from '../../Main/LoginVC'
import {CachedImage} from "react-native-img-cache";


import Icon from 'react-native-vector-icons/Ionicons'
import storage from "../../RNAsyncStorage";

let {width, height} = Dimensions.get('window')

var HomeServers = require('../../Home/HomeServers')

export default class MineGeneral extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRefreshing: false,
            userInfo: null,
            isLoad: false,
            messageRedPoint: false
        }

        this.config = [
            {
                title: '我的社交',
                item: [{name: "收藏", imgUrl: 'icon_shoucang', page: MyCollectVC}, {
                    name: "消息中心",
                    imgUrl: 'icon_lianxi',
                    page: MyFriendVC
                }]
            },
            {
                title: '设置',
                item: [
                    {
                        name: "我的钱包",
                        imgUrl: 'icon_qianbao',
                        page: MyWalletVC
                    },
                    {
                        name: global.params.OgnzId === '163' ? "邀请码" : '',
                        imgUrl: 'icon_yaoqingma',
                        page: InvitationCodeVC
                    },
                    {
                        name: "常用信息",
                        imgUrl: 'icon_xinxi',
                        page: OftenInfoVC
                    },
                    {
                        name: "账户与安全",
                        imgUrl: 'icon_anquan',
                        page: AccountSecurityVC
                    }
                ]
            }
        ]

    }

    componentDidMount() {
        this._onRefresh();
        this.changeUser = DeviceEventEmitter.addListener('changeUser', (obj) => {
            this.setState({userInfo: obj.userInfo, isLoad: obj.isLoad});
        });

        this.hideRedPoint = DeviceEventEmitter.addListener('refreshBadge', () => {
            storage.load({
                key: 'userInfo',
            }).then(ret => {
                this.setState({
                    userInfo: ret,
                    isLoad: true
                }, () => {
                    this.hideAndShowRedPoint(this.state.userInfo);
                });
            })
        });

        this.uploadUser = DeviceEventEmitter.addListener('uploadUser', () => {
            storage.load({
                key: 'userInfo',
            }).then(ret => {
                this.setState({
                    userInfo: ret,
                    isLoad: true
                });
            })
        });
    }

    hideAndShowRedPoint(ret) {
        if (ret) {
            HomeServers.getNavigatorBadge(ret.token).then(res => {
                if (parseInt(res.message_count) > 0) {
                    this.setState({messageRedPoint: true});
                } else {
                    this.setState({messageRedPoint: false});
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }


    componentWillUnmount() {
        this.changeUser.remove();
        this.uploadUser.remove();
        this.hideRedPoint.remove();
    }


    componentWillMount() {
        storage.load({
            key: 'userInfo',
        }).then(ret => {
            this.setState({
                userInfo: ret,
                isLoad: true
            });
            this.hideAndShowRedPoint(ret);
        }).catch(err => {
        })
    }

    goPage(name) {
        if (this.state.userInfo) {
            this.props.navigator.push({
                component: name,
                params: {userInfo: this.state.userInfo},
            })
        } else {
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
    }

    rightPress(name) {
        this.props.navigator.push({
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            component: name,
            title: '23132'
        });
    }

    _onRefresh() {
        this.setState({isRefreshing: true});
        setTimeout(() => {
            this.setState({isRefreshing: false});
        }, 1500)
    }

    messageTips(item) {
        if (item.name === '消息中心') {
            if (this.state.messageRedPoint) {
                return (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text allowFontScaling={false}
                              style={{fontSize: 15, color: 'rgb(122,122,122)'}}>{item.name}</Text>
                        <View style={{marginLeft: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: 'red'}}/>
                    </View>
                )
            } else {
                return (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text allowFontScaling={false}
                              style={{fontSize: 15, color: 'rgb(122,122,122)'}}>{item.name}</Text>
                    </View>
                )
            }
        }

        return (
            <Text allowFontScaling={false} style={{fontSize: 15, color: 'rgb(122,122,122)'}}>{item.name}</Text>
        )
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            return (
                <View key={i}>
                    <View style={{height: 36, justifyContent: 'center', backgroundColor: 'rgb(222,222,222)'}}>
                        <Text allowFontScaling={false} style={{marginLeft: 15, fontSize: 16,}}>{item.title}</Text>
                    </View>
                    {item.item.map((item, i) => {
                        if (item.name.length > 0) {
                            return (
                                <View key={i}
                                      style={{
                                          height: 44,
                                          alignItems: 'center',
                                          flexDirection: 'row',
                                          backgroundColor: 'white'
                                      }}>
                                    <Image source={{uri: item.imgUrl}}
                                           style={{resizeMode: 'stretch', marginLeft: 15, width: 18, height: 18,}}/>
                                    <TouchableOpacity activeOpacity={0.9} style={{
                                        width: width - 30,
                                        height: 44,
                                        marginLeft: 15,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#f5f5f5',
                                        justifyContent: 'center',
                                    }} onPress={this.goPage.bind(this, item.page)}>

                                        {this.messageTips(item)}
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    })}
                </View>
            )
        })
    }

    loadHeaderView() {
        let topHight = (Platform.OS === 'ios' ? 44 : 0 ) + global.params.iPhoneXHeight;
        let viewHiget = Platform.OS === 'ios' ? 800 : 140;
        let ss = topHight + 100;
        return (
            <TouchableOpacity activeOpacity={1}
                              style={{height: viewHiget, width: width, backgroundColor: global.params.backgroundColor}}
                              onPress={this.goPage.bind(this, MyInfo)}
            >
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: ss,
                    backgroundColor: 'transparent'
                }}>
                    <View style={{backgroundColor: 'transparent', width: width, height:topHight}}/>
                    <View style={{
                        flexDirection: "row",
                        height: ss - topHight,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent'
                    }}>
                        <Image
                            source={{uri: this.state.userInfo ? this.state.userInfo.user.profile_image_url : 'defu_user'}}
                            style={{
                                marginLeft: 20,
                                width: px2dp(60),
                                height: px2dp(60),
                                borderRadius: px2dp(30)
                            }}
                        />
                        <View style={{flex: 1, marginLeft: 10, paddingVertical: 5}}>
                            <Text style={{
                                color: "white",
                                fontSize: px2dp(15)
                            }}>{this.state.userInfo ? this.state.userInfo.user.nickname : '未登陆'}</Text>
                            <View style={{marginTop: px2dp(10), flexDirection: "row"}}>
                                <Icon name="ios-pin-outline" size={px2dp(14)}
                                      color="white"/>
                                <Text style={{
                                    color: "white",
                                    fontSize: 13,
                                    paddingLeft: 5
                                }}>{this.state.userInfo ? this.state.userInfo.user.city.cityname : ''}</Text>
                            </View>
                        </View>
                        <Icon name="ios-arrow-forward-outline" size={px2dp(22)} color="white"
                              style={{marginRight: 26, marginTop: 14}}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        let offset = Platform.OS === 'ios' ? 600 : 0;
        return (
            <View style={{flex: 1, backgroundColor: "#f5f5f5",}}>

                {/*设置状态栏颜色，backgroundColor只对android有效*/}
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                    backgroundColor={global.params.backgroundColor}
                    // translucent={true}
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentOffset={{x: 0, y: offset + 56}}
                    contentInset={{top: -(offset + 56), left: 0, bottom: 0, right: 0}}
                    style={styles.scrollView}

                >
                    {this.loadHeaderView()}
                    <View style={{
                        minHeight: height - 64 - px2dp(46),
                        paddingBottom: 20,
                        backgroundColor: "rgb(235,235,235)"
                    }}>
                        <View>
                            {this._renderListItem()}
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        marginBottom: px2dp(0),
        backgroundColor: "rgb(235,235,235)"
    },
    userHead: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "rgb(235,235,235)"
    },
    numbers: {
        flexDirection: "row",
        backgroundColor: "#fff",
        height: 74
    },
    numItem: {
        flex: 1,
        height: 74,
        justifyContent: "center",
        alignItems: "center"
    }
})
