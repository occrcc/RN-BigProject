import React, {Component} from 'react'
import {
    Text,
    View,
    StatusBar,
    StyleSheet,
    DeviceEventEmitter,
    Image,
    ScrollView,
    Dimensions,
    InteractionManager,
    TouchableOpacity
} from 'react-native'


var UserInfoServes = require('../Servers/UserInfoServes')
let {width} = Dimensions.get('window')


export default class MyMindCoupons extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            isDidSelectRow: false,
            activeOpacity: 1,
            loaded: false,
            tip:'亲，你还没有未使用的优惠券'
        }
    }

    componentDidMount() {

        InteractionManager.runAfterInteractions(() => {

            let tip = '亲，你还没有未使用的优惠券';
            if (this.props.categraryId === 1){
                tip = '没有已使用的优惠券';
            }else if (this.props.categraryId === 2) {
                tip = '没有已过期的优惠券';
            }
            this.setState({
                tip: tip,
            })

            let userInfo = this.props.userInfo;
            var submit = {};
            submit['access_token'] = userInfo.token;
            submit['type'] = this.props.categraryId;
            UserInfoServes.getCouponList(submit).then(res => {
                console.log(res);
                this.setState({
                    loaded: true,
                    dataSource: res,
                })
            }).catch(error => {
                console.log('error:', error);
            })
        });
    }

    back() {
        this.props.navigator.pop()
    }


    loadD() {


        let imgName = 'youhui_wei';
        if (this.props.categraryId === 1){
            imgName = 'youhui_shiyong';
        }else if (this.props.categraryId === 2) {
            imgName = 'youhui_guoqi';
        }

        if (this.state.loaded) {
            if (this.state.dataSource.length > 0) {
                return (
                    <ScrollView>
                        {this.state.dataSource.map((item, i) => {
                            return (
                                <View key={i} style={styles.cellStyle}>
                                    <Image style={styles.cellImageStyle} source={{uri:imgName}}/>
                                    <View style={styles.leftTextViewStyle}>
                                        <Text style={styles.leftTextStyle}><Text style={{color:'white',fontSize:16}}>￥</Text>{item.discount}</Text>
                                    </View>
                                    <View style={styles.rightTextViewStyle}>
                                        <Text style={{fontSize: 16}}>{item.discount}元优惠券</Text>
                                        <Text style={{
                                            marginTop: 8,
                                            fontSize: 13,
                                            color: '#727272'
                                        }}>使用范围：{item.conditionFormat}</Text>
                                        <Text style={{
                                            marginTop: 8,
                                            fontSize: 11,
                                            color: '#727272'
                                        }}>有效期:{item.expireTime_format}</Text>
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>
                );
            } else {
                return (
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={{uri: 'youhuiquan'}}
                               style={{resizeMode: 'stretch', marginTop: 100, width: 200, height: 130}}/>
                        <Text style={{textAlign: 'center', marginTop: 30, fontSize: 17, color: 'rgb(111,111,111)'}}>{this.state.tip}</Text>
                    </View>
                )
            }
        } else {
            return (
                <Image source={{uri: 'scr_youhui'}} style={{marginTop:15,width: width, height: width * 1.5}}/>
            );
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f5f5f5"}}>
                {this.loadD()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cellStyle:{
        width:width - 30,
        margin:14,
        marginBottom:0,
        height:100,

    },
    cellImageStyle:{
        flex:1,
        borderRadius:4,
        // resizeMode:'stretch'
    },
    leftTextViewStyle:{
        position:'absolute',
        width:100,
        height:100,
        backgroundColor:'transparent',
        alignItems:'center',
        justifyContent:'center'
    },
    leftTextStyle:{
        fontSize:24,
        color:'#f5f5f5'
    },
    rightTextViewStyle:{
        position:'absolute',
        width:width - 145,
        height:100,
        marginLeft:120,
        backgroundColor:'transparent',
        justifyContent:'center'
    }

});