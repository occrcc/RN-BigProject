/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */

'use strict';

import React, {Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    DeviceEventEmitter,
} from 'react-native'

import NavBar from '../../Componnet/NavBar'
import Item from '../../Componnet/Item'
import storage from '../../RNAsyncStorage'
import px2dp from '../../../Util'
import ChangePwd from './ChangePasswordVC'

import {Navigator} from 'react-native-deprecated-custom-components'


export default class AccountSecurityVC extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nickname: '',
            mobile: '',
            isLoad: false,
            token:''
        }
    }

    componentWillMount() {
        storage.load({
            key: 'userInfo',
        }).then(ret => {
            this.setState({token:ret.token,nickname: ret.user.nickname, mobile: ret.user.mobile, isLoad: true});

        }).catch(err => {

        })
    }

    back() {
        this.props.navigator.pop()
    }

    exitAccount(){
        storage.remove({
            key: 'userInfo'
        }).then(()=>{
            DeviceEventEmitter.emit('upLoadNavigator',{chuo_count:0,message_count:0});
            DeviceEventEmitter.emit('ChuoUpLoadList',true);
            DeviceEventEmitter.emit('changeUser',{isLoad:false});
            DeviceEventEmitter.emit('uploadServeUserInfo',{isLoad:false});
            // DeviceEventEmitter.emit('refreshBadge');
            this.props.navigator.pop();
        });
    }

    changePassword(name) {

        console.log('token  :' + this.state.token);

        this.props.navigator.push({
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            component: name,
            params: {token:this.state.token},
        });
    }

    _renderListItem() {

        if (this.state.isLoad) {
            let config = [
                {icon: "", name: "昵称", subName: this.state.nickname, disable: true},
                {icon: "", name: "账号", subName: this.state.mobile, disable: true},
                {icon: "", name: "修改密码",  onPress: this.changePassword.bind(this, ChangePwd)},
            ]
            return config.map((item, i) => {
                return (<Item key={i} {...item}/>)
            })
        } else {
            let config = [
                {icon: "", name: "昵称", subName: '1', disable: true},
                {icon: "", name: "账号", subName: '2', disable: true},
                {icon: "", name: "修改密码" , disable: true},
            ]
            return config.map((item, i) => {
                return (<Item key={i} {...item}/>)
            })
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <NavBar
                    title="账户与安全"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <View>
                    {this._renderListItem()}
                </View>
                <TouchableOpacity style={styles.exitLog} onPress={this.exitAccount.bind(this)}>
                    <Text style={styles.exitText}> 退出登陆</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    exitLog: {
        position: "absolute", bottom: 60, left: 20, right: 20, height: 46,
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 23,
        justifyContent:'center',
    },
    exitText: {
        color: "red",
        fontSize: px2dp(15),
        textAlign: 'center',
        backgroundColor: 'rgba(255,255,255,0)',
    }
})