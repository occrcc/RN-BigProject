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
    Platform,
    TouchableNativeFeedback

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
import Myorder from '../../Serve/ServeWeights/MyOrderList'
import MyCoupons from '../MineOtherPages/MyCoupons'

export default class Mine290 extends Component {
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

            console.log('userInfo:',ret);
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



    messageTips(item) {
        if (item.name === '消息中心') {
            if (this.state.messageRedPoint && this.state.userInfo) {
                return (
                    <View style={{flexDirection: 'row', height:44,alignItems: 'center',marginLeft:10}}>
                        <Text allowFontScaling={false}
                              style={{fontSize: 11, color: '#828282'}}>{item.name}</Text>
                        <View style={{marginLeft: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: 'red'}}/>
                    </View>
                )
            }
        }

        return (
            <View style={{flexDirection: 'row',height:44, alignItems: 'center',marginLeft:10}}>
                <Text allowFontScaling={false}
                      style={{fontSize: 11, color: '#828282'}}>{item.name}</Text>
            </View>
        )
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            return (
                <View key={i}>
                    {item.item.map((item, i) => {
                        if (item.name.length > 0) {
                            return (
                                <TouchableOpacity activeOpacity={0.9} key={i} style={{
                                    width: width - 54,
                                    height: 44,
                                    flexDirection: 'row',
                                    marginLeft: 27,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#f5f5f5',
                                    alignItems: 'center',
                                    justifyContent:'space-between'
                                }} onPress={this.goPage.bind(this, item.page)}>
                                    <View style={{flexDirection:'row',height:44,alignItems:'center'}}>
                                        <Image source={{uri: item.imgUrl}}
                                               style={{resizeMode: 'stretch',  width: 15, height: 15,}}/>
                                        {this.messageTips(item)}
                                    </View>
                                    <Image source={{uri: 'icon_cell_rightarrow'}}
                                           style={{resizeMode: 'stretch',  width: 6, height: 9, }}/>
                                </TouchableOpacity>
                            )
                        }
                    })}
                </View>
            )
        })
    }

    loadHeaderView() {

        var funAry = [
            {img:'dingdan_290',title:'我的订单'},
            {img:'qianbao_290',title:'我的钱包'},
            {img:'youhui_290',title:'优惠券'},
        ]

        return (
            <View style={styles.headViewStyle}>
                <Image style={styles.headImageStyle} source={{uri:'mine_head_290'}}/>
                <View style={[styles.headImageStyle,styles.headContentViewStyle,]} >
                    <TouchableOpacity activeOpacity={0.2} style={{position:'absolute',  width:44,height:44,right:15,top:44,justifyContent:'center',alignItems:'center'}}
                                             onPress={
                                                 this.goPage.bind(this, MyInfo)
                                             }
                    >
                        <Image source={{uri:'mine_setting290'}} style={{width:15,height:15}}/>
                    </TouchableOpacity>
                    <Image
                        source={{uri: this.state.userInfo ? this.state.userInfo.user.profile_image_url : 'defu_user'}}
                        style={styles.userHeadImage}/>

                    <View style={{flex: 1, paddingVertical: 5,backgroundColor:'transparent'}}>
                        <Text style={{
                            color:'white',
                            fontWeight:'bold',
                            marginTop:5,
                            textAlign:'center',
                            fontSize: px2dp(15)
                        }}>{this.state.userInfo ? this.state.userInfo.user.nickname : '未登陆'}</Text>
                        <View style={{marginTop: px2dp(5), alignItems:'center', flexDirection: "row",alignItems:'center'}}>
                            <Image style={{width:8,height:10}} source={{uri:'mine_loca_290'}}/>
                            <Text style={{
                                color: "white",
                                fontSize: 11,
                                paddingLeft: 5
                            }}>{this.state.userInfo ? this.state.userInfo.user.city.cityname : '未设置'}</Text>
                        </View>
                    </View>
                    <View style={[styles.headFootView]} >
                        {funAry.map((item,i)=>{
                            return(
                                <TouchableOpacity activeOpacity={0.8}  key={i} style={{width:120,height:96,justifyContent:'center',alignItems:'center'}}
                                                  onPress={
                                                      this.clickHeaderBtn.bind(this, item.title)
                                                  }
                                >
                                    <Image source={{uri:item.img}} style={{width:22,height:28}}/>
                                    <Text style={{color:'white',fontSize:10,marginTop:3}}>{item.title}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
            </View>
        )
    }

    clickHeaderBtn(name) {

        if (this.state.userInfo) {
            let vcName = Myorder;
            if (name === '我的钱包') {
                vcName = MyWalletVC;
            } else if (name === '优惠券') {
                vcName = MyCoupons;
            }
            this.props.navigator.push({
                component: vcName,
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

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#FFFFFF",}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                    backgroundColor={global.params.backgroundColor}
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}

                >
                    {this.loadHeaderView()}
                    {this._renderListItem()}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headViewStyle:{
        width:width,
        height:245,
    },
    headImageStyle:{
        position:'absolute',
        flex:1,
        width:width,
        height:245,
    },
    headContentViewStyle:{
        alignItems:'center'
    },
    userHeadImage:{
        marginTop:44,
        width: px2dp(61),
        height: px2dp(61),
        borderRadius: px2dp(30.5),
        borderWidth:3,
        borderColor:'white'
    },
    headFootView:{
        width:width,
        height:96,
        backgroundColor:'transparent',
        position:'absolute',
        bottom:0,
        justifyContent:'space-around',
        alignItems:'center',
        flexDirection:'row'
    }

})
