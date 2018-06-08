import React, {Component} from 'react'
import {
    Text,
    View,
    StatusBar,
    WebView,
    StyleSheet,
    TouchableOpacity,
    Image,
    InteractionManager
} from 'react-native'

import ServeUnionPay from '../ServeUnionPay/ServeUnionpay'
import Alert from 'rnkit-alert-view';

export default class UnionPay extends Component {
    constructor(props) {
        super(props)
    }

    back() {
        this.props.navigator.pop()
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            if (this.props.item.alertMessage.length > 0) {
                setTimeout(()=>this.showAlertTips(),1500);
            }
        });
    }

    showAlertTips() {
        Alert.alert(
            '提示', this.props.item.alertMessage, [
                {text: '知道了' },
            ],
        );
    }

    getWebView() {
        let url = 'http://m.ejiarens.com/banban/tuition_fee';
        console.log(url);
        return (
            <WebView
                source={{uri: url}}
                startInLoadingState={true}
                domStorageEnabled={true}
                javaScriptEnabled={true}
            >
            </WebView>
        )
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                {this.getWebView()}
                <TouchableOpacity activeOpacity={0.6} style={styles.backButtonStyle} onPress={this.back.bind(this)}>
                    <Image source={{uri: 'icon_back_blue'}} style={{width: 24, height: 24}}/>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8} style={styles.footerViewStyle} onPress={()=>{
                    this.props.navigator.push({
                        component: ServeUnionPay,
                        params: {orderInfo:this.props.userInfo},
                    })
                }}>
                    <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>GO</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    backButtonStyle: {
        position: 'absolute',
        left: 15, top:  global.params.iPhoneXHeight + 20,
    },

    footerViewStyle:{
        position: 'absolute',
        height:44,
        backgroundColor:global.params.backgroundColor,
        left: 0,
        right:0,
        bottom: global.params.iPhoneXHeight ,
        justifyContent:'center',
        alignItems:'center'
    }
});