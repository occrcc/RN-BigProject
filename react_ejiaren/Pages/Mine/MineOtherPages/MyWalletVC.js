/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */

'use strict';

import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    DeviceEventEmitter,
    Image
} from 'react-native'

import NavBar from '../../Componnet/NavBar'
import {List, ListItem} from 'react-native-elements'
import storage from '../../RNAsyncStorage'
import AccountPrePaid from './AccountsPrepaid'
import MyWallDetail from './MyWalletDetail'
import Tixian from './TiXian'
var UserInfoServes = require('../Servers/UserInfoServes')

export default class MyWalletVC extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userInfo: null,
        }
    }

    back() {
        this.props.navigator.pop()
    }

    componentWillMount() {
        this.loadUserInfo();
    }

    loadUserInfo(){
        UserInfoServes.getUserForToken(this.props.userInfo.token).then(res=>{
            console.log(res);
            storage.save({
                key: 'userInfo',
                data: res,
            });
            this.setState({
                userInfo: res
            });
        }).catch(error=>{
            console.log('获取用户余额失败 : ' + error)
        })

        // storage.load({
        //     key: 'userInfo',
        // }).then(ret => {
        //     this.setState({
        //         userInfo: ret
        //     });
        // })
    }

    componentDidMount() {
        this.uploadMywallet = DeviceEventEmitter.addListener('uploadMywallet', ()=>{
            this.loadUserInfo();
        });
    }

    componentWillUnmount() {
        this.uploadMywallet.remove();
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <NavBar
                    title="我的钱包"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <ScrollView>
                    <List containerStyle={{
                        marginTop: 0,
                    }}>
                        <ListItem
                            title={'我的余额:￥' + (this.state.userInfo ? this.state.userInfo.amount.toFixed(2) : 0.00)}
                            subtitle='现金余额可用于购买所有服务产品（当余额大于支付金额时，支付方式默认为余额支付）'
                            subtitleNumberOfLines={2}
                            containerStyle={[styles.containerStyle, {height: 80}]}
                            rightIcon={<View/>}
                            subtitleStyle={styles.subtitleStyle}
                            titleStyle={styles.titleStyle}

                        />
                        <ListItem
                            title=''
                            rightIcon={<View/>}
                            containerStyle={[styles.containerStyle,{backgroundColor:'rgba(244,244,244,1)',height:22}]}
                        />
                        <ListItem
                            onPress={()=>{
                                this.props.navigator.push({
                                    component: MyWallDetail,
                                    params: {userInfo:this.state.userInfo},
                                })
                            }}
                            avatar={{uri:'shouzhi'}}
                            roundAvatar
                            title='收支明细'
                            subtitle='每一笔成功的收支记录'
                            avatarStyle={{height:26,width:26}}
                            avatarOverlayContainerStyle={{backgroundColor:'white',}}
                            containerStyle={styles.containerStyle}
                            subtitleStyle={{fontSize: global.params.CellRightTitleFontSize,marginTop:3,fontStyle:'normal',
                                fontWeight:'normal',}}
                            titleStyle={{color: global.params.CellTitleColor,fontSize: global.params.CellTitleFontSize,}}
                            // rightIcon={<Image source={{uri: 'icon_cell_rightarrow'}}
                            //                   style={{marginTop:10,marginRight: 0, width: 8, height: 12}}/>}
                        />
                        <ListItem
                            title=''
                            rightIcon={<View/>}
                            containerStyle={[styles.containerStyle,{backgroundColor:'rgba(244,244,244,1)',height:22}]}
                        />
                        <ListItem
                            onPress={()=>{
                                this.props.navigator.push({
                                    component: AccountPrePaid,
                                    params: {source:this.state.userInfo},
                                })
                            }}
                            avatar={{uri:'back_right'}}
                            roundAvatar
                            title='我要充值'
                            avatarStyle={{height:26,width:26}}
                            avatarOverlayContainerStyle={{backgroundColor:'white',}}
                            containerStyle={styles.containerStyle}
                            subtitleStyle={{fontSize: global.params.CellRightTitleFontSize,marginTop:3}}
                            titleStyle={{color: global.params.CellTitleColor,fontSize: global.params.CellTitleFontSize,}}
                            // rightIcon={<Image source={{uri: 'icon_cell_rightarrow'}}
                            //                   style={{marginTop:10,marginRight: 0, width: 8, height: 12}}/>}
                        />
                        <ListItem
                            onPress={()=>{
                                this.props.navigator.push({
                                    component: Tixian,
                                    params: {userInfo:this.state.userInfo},
                                })
                            }}
                            avatar={{uri:'back_lift'}}
                            roundAvatar
                            title='我要提现'
                            rightTitle='提现会在7个工作日内到账'
                            rightTitleStyle={{
                                fontSize: 11,
                                color: global.params.CellRightTitleColor
                            }}
                            avatarStyle={{height:26,width:26}}
                            avatarOverlayContainerStyle={{backgroundColor:'white',}}
                            containerStyle={styles.containerStyle}
                            subtitleStyle={{fontSize: global.params.CellRightTitleFontSize,marginTop:3}}
                            titleStyle={{color: global.params.CellTitleColor,fontSize: global.params.CellTitleFontSize,}}
                            // rightIcon={<Image source={{uri: 'icon_cell_rightarrow'}}
                            //                   style={{marginTop:10,marginRight: 0, width: 8, height: 12}}/>}
                        />
                    </List>
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({

    containerStyle: {
        borderBottomWidth: global.params.CellLineViewHight,
        borderBottomColor: global.params.CellRightTitleColor,
        height: 50
    },
    subtitleStyle: {
        fontSize: global.params.CellRightTitleFontSize,
        marginTop: 10,
        fontStyle:'normal',
        fontWeight:'normal',
    },
    titleStyle: {
        fontSize: 17,
        color: global.params.CellTitleColor
    }
})