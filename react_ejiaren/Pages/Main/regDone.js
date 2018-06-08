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

export default class regDone extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mesCode: '',
            pwd: '',
            realiNamePlaceholder: '真实姓名(用于老师与您沟通时可以找到您)',
            realiName:'',
            email: '',
            emailPlaceholder:'邮箱(用于您能正常接收老师的通知与资料)',
            isTeacher:false
        };
    }

    resDone() {
        if (this.state.mesCode.length < 1
            || this .state.pwd.length < 1
            || this .state.realiName.length < 1
            || this .state.email.length < 1){
            Alert.alert(
                'Error', '请检查信息是否完整填写', [
                    {text: 'Ok', onPress: () => console.log('OK Pressed!')},],
            );
            return;
        }

        DeviceEventEmitter.emit('regDone', {
            'validcode': this.state.mesCode,
            'password': this.state.pwd,
            'realname': this.state.realiName,
            'email': this.state.email,
            'teacher': this.state.isTeacher,
        });
    }

    scrollDidScroll() {
        DeviceEventEmitter.emit('didScrollForWidth', 0);
    }

    render() {
        return (
            <View style={styles.cellStyle}>
                <View style={styles.textInput}>
                    <Image source={{uri: 'phone'}} style={{resizeMode:'stretch',width: 20, height: 22, marginLeft: 22}}/>
                    <TextInput
                        style={styles.textInputStyle}
                        underlineColorAndroid='transparent'
                        placeholder='输入验证码'
                        onChangeText={(mesCode) => this.setState({mesCode})}
                        value={this.state.mesCode}
                    />
                </View>
                <View style={styles.textInput}>
                    <Image source={{uri: 'pwd'}} style={{resizeMode:'stretch',width: 20, height: 22, marginLeft: 22}}/>
                    <TextInput
                        style={styles.textInputStyle}
                        underlineColorAndroid='transparent'
                        placeholder='输入密码'
                        onChangeText={(pwd) => this.setState({pwd})}
                        value={this.state.pwd}
                    />
                </View>
                <View style={styles.textInput}>
                    <Image source={{uri: 'people_log'}} style={{resizeMode:'stretch',width: 20, height: 22, marginLeft: 22}}/>
                    <TextInput
                        style={styles.textInputStyle}
                        underlineColorAndroid='transparent'
                        placeholder={this.state.realiNamePlaceholder}
                        onChangeText={(realiName) => this.setState({realiName})}
                        value={this.state.realiName}
                    />
                </View>
                <View style={styles.textInput}>
                    <Image source={{uri: 'email_log'}} style={{resizeMode:'stretch',width: 20, height: 22, marginLeft: 22}}/>
                    <TextInput
                        style={styles.textInputStyle}
                        underlineColorAndroid='transparent'
                        placeholder={this.state.emailPlaceholder}
                        onChangeText={(email) => this.setState({email})}
                        value={this.state.email}
                    />
                </View>

                <Button style={{top: 20, width: width - 40, height: 45}} onPress={this.resDone.bind(this)}>
                    <View style={{
                        borderRadius: 6,
                        height: px2dp(45),
                        flexDirection: "row",
                        backgroundColor: "rgba(216, 60, 48, 1)",
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <Text style={{color: "#ffffff", fontSize: px2dp(15)}}>{"完成"}</Text>
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
