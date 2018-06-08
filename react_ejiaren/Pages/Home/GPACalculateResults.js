import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    StatusBar,
    Text,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native'


import NavBar from '../Componnet/NavBar'
import VisaNoInfo from "../Serve/VisaPay/VisaNoInfo";
let {width} = Dimensions.get('window')
export default class GPACalculateResults extends Component {
    constructor(props) {
        super(props)

    }
    back() {
        this.props.navigator.pop()
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f5f5f5"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                <NavBar
                    title='计算结果'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <View style={{marginTop:50,justifyContent:'center',alignItems:'center'}}>
                    <Text allowFontScaling={false} style={{fontSize:17}}>美加等常见GPA成绩(4分制)</Text>
                    <View  style={styles.showLayStyle}>
                        <Text allowFontScaling={false} style={{
                            fontSize:15,
                        }}>{this.props.fourResult}</Text>
                    </View>
                </View>

                <View style={{marginTop:50,justifyContent:'center',alignItems:'center'}}>
                    <Text allowFontScaling={false} style={{fontSize:17}}>英澳加等常见GPA成绩(百分制)</Text>
                    <View  style={styles.showLayStyle}>
                        <Text allowFontScaling={false} style={{
                            fontSize:15,
                        }}>{this.props.hundResult}</Text>
                    </View>
                </View>

                <View  style={styles.shipTextStyle}>
                    <Text allowFontScaling={false} numberOfLines={2} style={{
                        fontSize:14,
                        color:'rgb(111,111,111)',
                        lineHeight:18,
                        letterSpacing:1,
                        textAlign:'center',
                    }}>各留学国家院校有各自的算法，以上成绩换算（采用标准算法）仅供参考。</Text>
                </View>

                <TouchableOpacity activeOpacity={0.8} style={styles.resetBtnStyle} onPress={()=>{
                    // DeviceEventEmitter.emit('resetGpa');
                    this.props.navigator.pop();
                }}>
                    <Text allowFontScaling={false} style={{color:'white',fontSize:17}}>返回</Text>
                </TouchableOpacity>

            </View>
        )
    }
}

const styles = StyleSheet.create({

    showLayStyle:{
        marginTop:8,
        width:width - 40,
        height:36,
        backgroundColor:'rgb(222,222,222)',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:4,
        // borderColor:'rgb(177,177,177)',
        // borderWidth:0.5
    },
    shipTextStyle:{
        marginTop:40,
        justifyContent:'center',
        alignItems:'center',
        height:50,
        width:width - 80,
        marginLeft:40,
    },
    resetBtnStyle:{
        marginLeft:15,
        width:width - 30,
        height:44,
        backgroundColor:global.params.backgroundColor,
        borderRadius:4,
        justifyContent:'center',
        alignItems:'center',
        marginTop:30,
    }

})