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
import MessageDetail from './MyMessageDetailList'

let {width} = Dimensions.get('window')
export default class MyFriendVC extends Component {
    constructor(props) {
        super(props)
        this.state = {
            getMineDate: '',
            section0Subtitle: '暂无未读系统消息',
            section1Subtitle: '暂无未读订单消息',
            section2Subtitle: '暂无未读优惠券消息',
            section3Subtitle: '暂无活动消息',
        }

        this.messageAry = [
            {
                imgurl: 'icon_xitong',
                title: '系统消息',
                type:3
            },
            {
                imgurl: 'icon_dingdan',
                title: '订单信息',
                type:1
            },
            {
                imgurl: 'icon_coupons',
                title: '优惠券',
                type:2
            }]
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
        this.uploadMyMessageList = DeviceEventEmitter.addListener('uploadMyMessageList', ()=>{
            this.getSelfMessage();
        });
        InteractionManager.runAfterInteractions(() => this.getSelfMessage());

        // let active =  {
        //     imgurl: 'icon_activity',
        //     title: '活动信息',
        //     type:4
        // };
        // if (global.params.OgnzId !== '289'){
        //     this.messageAry.push(active);
        // }
    }

    componentWillUnmount() {
        this.uploadMyMessageList.remove();
    }


    getSelfMessage() {

        UserInfoServes.userNotificationBadge(this.props.userInfo.token).then(res => {
            console.log(res);

            if (parseInt(res.t.system) > 0) {
                this.setState({section0Subtitle: '您有' + res.t.system + '条未读系统消息'});
            }else {
                this.setState({section0Subtitle: '暂无未读系统消息'});
            }

            if (parseInt(res.t.order) > 0) {
                this.setState({section1Subtitle: '您有' + res.t.order + '条未读订单消息'});
            }else {
                this.setState({section1Subtitle: '暂无未读订单消息'});
            }

            if (parseInt(res.t.coupon) > 0) {
                this.setState({section2Subtitle: '您有' + res.t.coupon + '条未读优惠券消息'});
            }else {
                this.setState({section2Subtitle: '暂无未读优惠券消息'});
            }

            if (parseInt(res.t.act) > 0) {
                this.setState({section2Subtitle: '您有' + res.t.act + '条未读活动消息'});
            }else {
                this.setState({section2Subtitle: '暂无活动消息'});
            }

        }).catch(error => {
            console.log('error :' + error);
        })
    }

    didSelectRow(i) {

        console.log(this.messageAry[i]);
        let item = this.messageAry[i];

        this.props.navigator.push({
            component: MessageDetail,
            params: {
                userInfo: this.props.userInfo,
                item:item
            }
        });
    }

    subView(i) {

        let subtitle = '';
        switch (i){
            case 0 : subtitle = this.state.section0Subtitle; break;
            case 1 : subtitle = this.state.section1Subtitle; break;
            case 2 : subtitle = this.state.section2Subtitle; break;
            case 3 : subtitle = this.state.section3Subtitle; break;
        }
        return (
            <View style={{height: 24, justifyContent: 'center'}}>
                <Text style={{
                    fontSize: 13,
                    color: '#b7b7b7'
                }}>{subtitle}</Text>
            </View>
        )
    }

    loadD() {
        return (
            <ScrollView>
                {this.messageAry.map((item, i) => {
                    return (
                        <TouchableOpacity activeOpacity={0.8} key={i} style={styles.messageCellStyle} onPress={
                            this.didSelectRow.bind(this, i)
                        }>
                            <Image source={{uri: item.imgurl}} style={styles.messageImageStyle}/>
                            <View style={styles.textViewStyle}>
                                <View style={{
                                    flexDirection: 'row',
                                    height: 24,
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{fontSize: 16, color: '#2a2a2a'}}>{item.title}</Text>
                                    <Text style={{fontSize: 14, color: '#969696'}}>{this.state.getMineDate}</Text>
                                </View>
                                {this.subView(i)}
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        )

    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <NavBar
                    title="消息中心"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}

                />
                {this.loadD()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    messageCellStyle: {
        flexDirection: 'row',
        width: width,
        height: 72,
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(244,244,244)'
    },
    messageImageStyle: {
        marginLeft: 14,
        marginTop: 12,
        width: 48,
        height: 48,
        borderRadius: 4,
    },
    textViewStyle: {
        marginLeft: 14,
        width: width - 90,
        height: 48,
        marginTop: 12,
        justifyContent: 'center'
    }
})