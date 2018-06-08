/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Dimensions,
    TouchableOpacity,
    DeviceEventEmitter

} from 'react-native';
import Button from '../Componnet/Button'
import px2dp from '../../Util'
import Alert from 'rnkit-alert-view';

let {width, height} = Dimensions.get('window')
import ForgetPwd from './ForgetPassword'

export default class ContentScrollView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phonePlaceholder: '手机号',
            phoneNumber: '',
            pwaPlaceholder: '密码',
            pwaNumber: '',
        };
    }

    login() {

        if (this.state.phoneNumber.length < 1 || this
                .state.phoneNumber.length < 1){
            Alert.alert(
                'Error', '用户名或密码不能为空', [
                    {text: 'Ok', onPress: () => console.log('OK Pressed!')},],
            );
            return;
        }

        DeviceEventEmitter.emit('login', {
            'phoneNumber': this.state.phoneNumber,
            'pwaNumber': this.state.pwaNumber
        });
        /*
        this.props.navigator.push({
            component: EditAddress,
            args: {
                pageType: 0,
                title: "新增地址"
            }
        })*/
    }

    scrollDidScroll() {
        DeviceEventEmitter.emit('didScrollForWidth', width);
    }


    render() {
        return (
            <View style={styles.cellStyle}>
                <View style={styles.textInput}>
                    <Image source={{uri: 'phone'}} style={{resizeMode:'stretch',width: 20, height: 22, marginLeft: 22}}/>
                    <TextInput
                        style={styles.textInputStyle}
                        underlineColorAndroid='transparent'
                        placeholder={this.state.phonePlaceholder}
                        onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                        value={this.state.phoneNumber}
                    />
                </View>
                <View style={styles.textInput}>
                    <Image source={{uri: 'pwd'}} style={{resizeMode:'stretch',width: 20, height: 22, marginLeft: 22}}/>
                    <TextInput
                        style={styles.textInputStyle}
                        underlineColorAndroid='transparent'
                        placeholder={this.state.pwaPlaceholder}
                        onChangeText={(pwaNumber) => this.setState({pwaNumber})}
                        value={this.state.pwaNumber}
                        secureTextEntry={true}
                    />
                </View>

                <Button style={styles.forgetPasswordStyle} onPress={()=>{
                    this.props.navigator.push({
                        component: ForgetPwd,
                    })
                }}>
                    <Text style={{backgroundColor:'rgba(255,255,255,0)',color: "#ffffff", fontSize: px2dp(12)}}>{"忘记密码"}</Text>
                </Button>

                <Button style={{top: 20, width: width - 40, height: 45}} onPress={this.login.bind(this)}>
                    <View style={{
                        borderRadius: 6,
                        height: px2dp(45),
                        flexDirection: "row",
                        backgroundColor: "rgba(216, 60, 48, 1)",
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <Text style={{color: "#ffffff", fontSize: px2dp(15)}}>{"登录"}</Text>
                    </View>
                </Button>

                <TouchableOpacity onPress={this.scrollDidScroll.bind(this)} style={{position: "absolute", bottom: 0, left: 20, right: 20, height: 46}}>
                    <View>
                        <View style={{height: px2dp(0.5), backgroundColor: "#ffffff",}}></View>
                        <Text style={{
                            color: "#ffffff",
                            fontSize: px2dp(14),
                            height: px2dp(45),
                            textAlign:'center',
                            marginTop:13,
                            backgroundColor:'rgba(255,255,255,0)',
                        }}> {"我要注册"}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({

    textInput: {
        // position: 'absolute',
        width: width - 40,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 6,
        // opacity:0.5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 8,

    },

    forgetPasswordStyle:{
        height: 32,
        marginLeft: width - 130,
        marginTop:15,
        width:80,
        alignItems:'flex-end',
        justifyContent: 'center',
    },

    cellStyle: {
        width: width,
        height:height - height * 0.35,
        // 水平居中和垂直居中
        alignItems: 'center',
        flex:1
    },

    textInputStyle: {
        width: width - 100,
        height: 44,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 13
    },

})