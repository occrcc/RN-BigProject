/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */

'use strict';

import React, {Component} from 'react'
import {
    View,
    ScrollView,
    TouchableWithoutFeedback,
    Platform,
    DeviceEventEmitter,
    Text,
    Dimensions,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native'

import NavBar from '../../Componnet/NavBar'
import {List, ListItem} from 'react-native-elements'
import storage from '../../RNAsyncStorage'
import Prompt from 'react-native-prompt'

let {width} = Dimensions.get('window')
var UserInfoServes = require('../Servers/UserInfoServes')
var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

var selectRow = 0;
var selectSection = 0;

export default class OftenInfoVC extends Component {
    constructor(props) {
        super(props)
        this.state = {
            token: '',
            loadInfo: false,
            isShow: false,
            myInfo: {},
            placeholder: "请输入昵称",
            rowAry: [
                {
                    title: '常用信息',
                    subItmes: [{subTitle: '真实姓名', rightTitle: ''}, {subTitle: '手机号', rightTitle: ''}, {
                        subTitle: '微信号',
                        rightTitle: ''
                    }, {subTitle: '邮箱', rightTitle: ''}]
                },
                {title: '其它信息', subItmes: [{subTitle: '老师邮箱', rightTitle: ''}]},
            ]
        }
    }

    back() {
        this.props.navigator.pop()
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
    }

    componentWillUnmount() {
        selectSection = 0;
        selectRow = 0;
        MessageBarManager.unregisterMessageBar();
    }

    componentWillMount() {
        UserInfoServes.getRegInfo(this.props.userInfo.token).then(rep => {
            console.log(rep);
            this.setRightVales(rep);
        }).catch(err => {
            console.log(err);
        })
    }

    setRightVales(rep){
        let rowAry = [
            {
                title: '常用信息', subItmes: [
                {subTitle: '真实姓名', rightTitle: rep.realname},
                {subTitle: '手机号', rightTitle: rep.mobile},
                {subTitle: '微信号', rightTitle: rep.weixin},
                {subTitle: '邮箱', rightTitle: rep.email}]
            },
            {title: '其它信息', subItmes: [{subTitle: '老师邮箱', rightTitle: rep.teacher_email}]},
        ]
        this.setState({rowAry: rowAry})
    }


    chooseNickName(section, row) {
        selectSection = section;
        selectRow = row;
        let placeStr = '';
        if (section === 0) {
            switch (row) {
                case 0: placeStr = '请输入真实姓名'; break;
                case 1: placeStr = '请输入手机号'; break;
                case 2: placeStr = '请输入微信号'; break;
                case 3: placeStr = '请输入邮箱'; break;
                default: placeStr = '请输入老师邮箱';break;
            }
        } else {
            placeStr = '请输入老师邮箱';
        }

        this.setState({
            placeholder: placeStr,
            isShow: true,
        });
    }

    showAlert(message,isError){
        MessageBarManager.showAlert({
            alertType: isError ? 'error':'success' ,
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

    submitNickName(changeValue) {
        let keu = '';
        if (selectSection === 0) {
            switch (selectRow) {
                case 0: keu = 'realname'; break;
                case 1: keu = 'mobile'; break;
                case 2: keu = 'weixin'; break;
                case 3:  keu = 'email'; break;
                default: keu = 'nothing'; break;
            }
        } else {
            keu = 'teacher_email';
        }
        UserInfoServes.saveInfo(keu, changeValue, this.props.userInfo.token).then(rep => {
            storage.save({
                key: 'firstStart',
                data: 'firstStart',
            }).then(() => {
                DeviceEventEmitter.emit('isShowTopTips');
            });
            this.setRightVales(rep);
            this.showAlert('保存成功');
            this.setState({
                myInfo: rep,
                isShow: false,
            });
        }).catch(err => {
            console.log(err);
            this.showAlert(err,true);
        })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <NavBar
                    title="常用信息"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <ScrollView>
                    {this.state.rowAry.map((item, i) => {
                        return (
                            <View key={i}>
                                <View style={styles.groupHeaderStyle}>
                                    <Text style={styles.groupTitleStyle}>{item.title}</Text>
                                </View>
                                {item.subItmes.map((subItem, j) => {
                                    return (
                                        <TouchableOpacity activeOpacity={0.8} key={j} style={styles.contentCellStyle}
                                                          onPress={this.chooseNickName.bind(this, i, j)}>
                                            <Text style={styles.contentCellTitleStyle}>{subItem.subTitle}</Text>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <Text style={{
                                                    fontSize: 14,
                                                    marginRight: 8,
                                                    color: 'rgb(177,177,177)'
                                                }}>{subItem.rightTitle}</Text>
                                                <Image source={{uri: 'icon_cell_rightarrow'}}
                                                       style={{marginRight: 14, width: 8, height: 12}}/>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        )
                    })}
                </ScrollView>
                <Prompt
                    title={' '}
                    visible={this.state.isShow}
                    placeholder={this.state.placeholder}
                    defaultValue=''
                    cancelText={'取消'}
                    submitText={'提交'}
                    onCancel={() => this.setState({
                        isShow: false,
                        message: "You cancelled"
                    })}
                    onSubmit={(value) => {
                        this.submitNickName(value + '')
                    }}
                />
                <MessageBarAlert ref="alert"/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    groupHeaderStyle: {
        backgroundColor: '#f5f5f5',
        width: width,
        height: 36,
        justifyContent: 'center'
    },
    groupTitleStyle: {
        marginLeft: 15,
        fontSize: 17,
    },
    contentCellStyle: {
        width: width,
        height: 44,
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    contentCellTitleStyle: {
        marginLeft: 15,
        fontSize: 15,
    }
})

