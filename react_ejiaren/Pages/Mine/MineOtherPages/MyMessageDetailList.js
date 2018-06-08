/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */

'use strict';

import React, {Component} from 'react'
import {
    View,
    Image,
    Text,
    ScrollView,
    Dimensions,
    StyleSheet,
    InteractionManager,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native'

import NavBar from '../../Componnet/NavBar'

var UserInfoServes = require('../Servers/UserInfoServes')
var HomeServers = require('../../Home/HomeServers')
import MyCoupons from './MyCoupons'
import MyOrder from '../../Serve/ServeWeights/MyOrderList'

let {width} = Dimensions.get('window')
export default class MyMessageDetailList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messageAry: [],
            getMineDate: '',
        }
    }

    back() {
        this.props.navigator.pop();
    }

    componentWillMount() {
        var myDate = new Date();
        var _format = function (number) {
            return (number < 10 ? ('0' + number) : number);
        };
        let getMineDate = myDate.getFullYear() + "-" + _format(myDate.getMonth() + 1) + "-" + _format(myDate.getDate());
        this.setState({getMineDate: getMineDate})

    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => this.getSelfMessage())
    }

    getSelfMessage() {
        let token = this.props.userInfo.token;
        let type = this.props.item.type;

        DeviceEventEmitter.emit('refreshBadge');

        UserInfoServes.myMessageDetailList(token, type, 1).then(res => {
            console.log(res);
            if (res.list.length > 0) {
                this.setState({messageAry: res.list})
            }
        }).catch(error => {
            console.log('error :' + error);
        });

        UserInfoServes.myMessageReaded(token, type).then(res => {
            DeviceEventEmitter.emit('uploadMyMessageList');
        }).catch(error => {
            console.log('error :' + error);
        });


        HomeServers.getNavigatorBadge(token).then(res => {
            DeviceEventEmitter.emit('upLoadNavigator', res);
        }).catch(err => {
            console.log(err);
        })
    }

    showMoreMessage() {

        let type = this.props.item.type;
        if (type === 3) return;
        this.props.navigator.push({
            component: type === 1 ? MyOrder : MyCoupons,
            params: {
                userInfo: this.props.userInfo,
            }
        });
    }

    formatDateTime(inputTime) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
    };

    deleteMessage(item, i) {
        let messageAry = this.state.messageAry;
        messageAry.splice(i, 1);
        this.setState({messageAry: messageAry});

        let token = this.props.userInfo.token;
        UserInfoServes.myMessageDelete(token, item.id).then(res => {
            console.log('删除成功 ', res);
        }).catch(error => {
            console.log('error :' + error);
        });
    }

    showOther (){
        if (this.props.item.type !== 3) {
            return (
                <TouchableOpacity activeOpacity={0.8} style={{
                    width:width - 50,
                    marginLeft:10,
                    justifyContent:'center',
                    height:36
                }} onPress={this.showMoreMessage.bind(this)}>
                    <Text style={{fontSize:14,color:global.params.backgroundColor}}>点击查看>></Text>
                </TouchableOpacity>
            )
        }
    }

    loadD() {
        if (this.state.messageAry.length > 0) {
            return (
                <ScrollView>
                    {this.state.messageAry.map((item, i) => {
                        return (
                            <View key={i} >
                                <View
                                    style={{width: width, height: 40, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{
                                        textAlign: 'right',
                                        marginTop: 14,
                                        marginRight: 14,
                                        fontSize: 14,
                                        color: '#b7b7b7'
                                    }}>{this.formatDateTime(item.createtime)}</Text>
                                </View>
                                <View style={styles.cellContentViewStyle} >
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: width - 50,
                                        marginLeft:10,
                                        height:40,
                                        borderBottomColor:'rgb(244,244,244)',
                                        borderBottomWidth:1
                                    }}>
                                        <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                            <Image source={{uri: this.props.item.imgurl}}
                                                   style={{marginRight:8,marginLeft:8, width: 18, height: 18}}/>
                                            <Text numberOfLines={1}
                                                  style={{color: 'rgb(111,111,111)', fontSize: 13}}>{item.title}</Text>
                                        </View>
                                        <TouchableOpacity activeOpacity={0.8}
                                                          style={{
                                                              width: 40,
                                                              height: 22,
                                                              justifyContent: 'center',
                                                              alignItems: 'center'
                                                          }}
                                                          onPress={this.deleteMessage.bind(this, item, i)}
                                        >
                                            <Image source={{uri: 'icon_delete'}} style={{
                                                resizeMode: 'stretch',
                                                width: 16, height: 16
                                            }}/>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{flex: 1 ,
                                        borderBottomColor:'rgb(244,244,244)',
                                        borderBottomWidth:1,
                                        width: width - 50,
                                        marginLeft:10,
                                        backgroundColor:'white'
                                    }}>
                                        <Text
                                            selectable={true}
                                            numberOfLines={0} style={{
                                            lineHeight: 18,
                                            color: '#969696',
                                            fontSize: 13,
                                            margin:15,
                                            marginRight:0,
                                            marginLeft:4,
                                        }}>{item.content}</Text>
                                    </View>
                                    {this.showOther()}
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>
            )
        } else {
            return (
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Image source={{uri: 'no_image'}} style={{marginTop: 110, width: 148, height: 90}}/>
                    <Text style={{
                        marginTop: 20,
                        textAlign: 'center',
                        color: 'rgb(111,111,111)',
                        fontSize: 15
                    }}>你还没有记录 </Text>
                </View>
            )
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f5f5f5"}}>
                <NavBar
                    title={this.props.item.title}
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                {this.loadD()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cellContentViewStyle: {
        width: width - 30,
        // height:100,
        backgroundColor: 'white',
        borderRadius: 4,
        margin: 15,
        marginBottom: 0,
        // flexDirection: 'row'
    },

})