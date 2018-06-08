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
    DeviceEventEmitter,
    Platform,
    Keyboard
} from 'react-native';

import Button from '../Componnet/Button'
import px2dp from '../../Util'
import Alert from  'rnkit-alert-view'

let {width, height} = Dimensions.get('window')
export default class regGetSmsCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phonePlaceholder: '请输入手机号码',
            phoneNumber: '',
            mesCode: '',
        };
    }

    getMesCode(){
        if (this.state.phoneNumber.length < 1){
            Alert.alert(
                'Error', '手机号码不能为空', [
                    {text: 'Ok', onPress: () => console.log('OK Pressed!')},],
            );
            return;
        }
        DeviceEventEmitter.emit('didScrollForWidth', width * 2,this.state.phoneNumber);
    }

    scrollDidScroll() {
        console.log('滚动');
        DeviceEventEmitter.emit('didScrollForWidth', 0);
    }

    _onStartShouldSetResponderCapture (event) {
        Keyboard.dismiss();
    }


    render() {
        return (
            <View style={styles.cellStyle} onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture.bind(this)}>
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

                <Button style={{top: 20, width: width - 40, height: 45}} onPress={this.getMesCode.bind(this)}>
                    <View style={{
                        borderRadius: 6,
                        height: px2dp(45),
                        flexDirection: "row",
                        backgroundColor: "rgba(216, 60, 48, 1)",
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <Text style={{color: "#ffffff", fontSize: px2dp(15)}}>{"获取验证码"}</Text>
                    </View>
                </Button>

                <TouchableOpacity onPress={this.scrollDidScroll.bind(this)} style={{position: "absolute",
                    bottom: Platform.OS === 'ios' ?  global.params.iPhoneXHeight : 23,
                    left: 20, right: 20, height: 46}}>
                    <View>
                        <View style={{height: px2dp(0.5), backgroundColor: "#ffffff",}}></View>
                        <Text style={{
                            color: "#ffffff",
                            fontSize: px2dp(14),
                            height: px2dp(45),
                            textAlign:'center',
                            marginTop:13,
                            backgroundColor:'rgba(255,255,255,0)',
                        }}> {"返回"}</Text>
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

    cellStyle: {
        width: width,
        // 水平居中和垂直居中
        alignItems: 'center',
    },

    textInputStyle: {
        width: width - 100,
        height: 44,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 13
    },

})
