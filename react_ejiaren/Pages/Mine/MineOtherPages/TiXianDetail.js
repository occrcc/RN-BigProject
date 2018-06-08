/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */


'use strict';

import React, {Component} from 'react'
import {
    View,
    Text,
    StatusBar,
    InteractionManager,
    Platform,
    DeviceEventEmitter,
    Dimensions,
    Image,
    ScrollView,
    TouchableOpacity
} from 'react-native'

import NavBar from '../../Componnet/NavBar'

let {width} = Dimensions.get('window')

export default class TiXianDetail extends Component {
    constructor(props) {
        super(props)
    }

    back() {
        this.props.navigator.pop();
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'white',borderRadius:4}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                <NavBar
                    title="余额提现"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <ScrollView style={{marginTop:44,}}>
                    <Image source={{uri:'yuer_head'}} style={{width:width,height:width * 0.5}} />
                    <View style={{width:width - 40,height:120,marginTop:44,
                        borderBottomColor:"#f5f5f5",
                        borderBottomWidth:1,
                        borderTopColor:"#f5f5f5",
                        borderTopWidth:1,
                        marginLeft:20
                    }}>
                        <View style={{flexDirection:'row',width:width - 40,height:60,alignItems:'center',justifyContent:'space-between'}}>
                            <Text style={{marginLeft:15,fontSize:15,color:'#969696'}}>提现金额</Text>
                            <Text style={{fontSize:15,marginRight:15,color:'#2a2a2a'}}>￥{this.props.amount}</Text>
                        </View>
                        <View style={{flexDirection:'row',width:width - 40,height:60,alignItems:'center',justifyContent:'space-between'}}>
                            <Text style={{marginLeft:15,fontSize:15,color:'#969696'}}>退款方式</Text>
                            <Text style={{fontSize:15,marginRight:15,color:'#2a2a2a'}}>原路退回资金来源账户</Text>
                        </View>
                    </View>

                    <View style={{marginTop:40,justifyContent:'center',alignItems:'center',width:width,height:40}}>
                        <Text style={{color:'#a7a7a7',fontSize:15}}>如有疑问可以资讯客服：021-61984772</Text>
                    </View>

                    <TouchableOpacity activeOpacity={0.8} style={{marginTop:20,width:width - 40,marginLeft:20,
                        height:42,
                        borderRadius:4,
                        backgroundColor:global.params.backgroundColor,
                        justifyContent:'center',
                        alignItems:'center'
                    }} onPress={()=>{
                        DeviceEventEmitter.emit('uploadMyWallet');
                        this.props.navigator.popToTop();
                    }}>
                        <Text style={{color:'white',fontSize:15}}>完成</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        )
    }
}


