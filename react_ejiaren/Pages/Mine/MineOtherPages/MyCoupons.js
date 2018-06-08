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


import NavBar from '../../Componnet/NavBar'

var UserInfoServes = require('../Servers/UserInfoServes')
let {width} = Dimensions.get('window')
import MindCoupons from './MyMindCoupons'


import ScrollableTabView, {ScrollableTabBar} from "react-native-scrollable-tab-view"

export default class MyCoupons extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            isDidSelectRow: false,
            activeOpacity: 1,
            loaded: false,
            headerArr: [{value: '未使用', id: 0}, {value: '已使用', id: 1}, {value: '已过期', id: 2}]
        }
    }

    componentDidMount() {

        InteractionManager.runAfterInteractions(() => {
            if (this.props.sourceList) {
                this.setState({
                    dataSource: this.props.sourceList,
                    isDidSelectRow: true,
                    loaded: true,
                    activeOpacity: 0.8
                })
            } else {
                let userInfo = this.props.userInfo;
                var submit = {};
                submit['access_token'] = userInfo.token;
                submit['type'] = 0;
                UserInfoServes.getCouponList(submit).then(res => {
                    console.log(res);
                    if (res.length > 0) {
                        this.setState({
                            loaded: true,
                            dataSource: res,
                        })
                    }
                }).catch(error => {
                    console.log('error:', error);
                })
            }
        });
    }

    back() {
        this.props.navigator.pop()
    }

    didSelectRow(item) {
        if (this.state.isDidSelectRow) {
            console.log(item);
            DeviceEventEmitter.emit('getConpone', item.code);
            this.props.navigator.pop();
        }
    }


    loadD() {
        if (this.props.sourceList) {
            if (this.state.loaded) {
                if (this.state.dataSource.length > 0) {
                    return (
                        <ScrollView>
                            {this.state.dataSource.map((item, i) => {
                                return (
                                    <TouchableOpacity activeOpacity={0.85} key={i} style={styles.cellStyle}
                                                      onPress={this.didSelectRow.bind(this, item)} >
                                        <Image style={styles.cellImageStyle} source={{uri: 'youhui_wei'}}/>
                                        <View style={styles.leftTextViewStyle}>
                                            <Text style={styles.leftTextStyle}><Text
                                                style={{color: 'white', fontSize: 16}}>￥</Text>{item.discount}</Text>
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
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    );
                } else {
                    return (
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Image source={{uri: 'youhuiquan'}}
                                   style={{resizeMode: 'stretch', marginTop: 100, width: 200, height: 130}}/>
                            <Text style={{textAlign: 'center', marginTop: 30, fontSize: 17, color: 'rgb(111,111,111)'}}>亲，您还没有优惠券哦！</Text>
                        </View>
                    )
                }
            } else {
                return (
                    <Image source={{uri: 'scr_youhui'}} style={{marginTop:15,width: width, height: width * 1.5}}/>
                );
            }
        } else {
            const {navigator} = this.props;
            return (
                <ScrollableTabView
                    initialPage={0}
                    // scrollWithoutAnimation={true}
                    style={{height: 20}}
                    renderTabBar={() => < ScrollableTabBar
                        underlineStyle={{backgroundColor: global.params.backgroundColor, height: 0}}
                        activeTextColor={global.params.backgroundColor}
                        textStyle={{fontSize: 16}}
                        backgroundColor='white'
                        tabStyle={{paddingLeft: 12, paddingRight: 12, paddingBottom: 0}}
                        inactiveTextColor='#696969'
                    />}
                >
                    {
                        this.state.headerArr.map((item, i) => {
                            return (
                                <View key={i} tabLabel={item.value} style={styles.itemLayout}>
                                    <MindCoupons userInfo={this.props.userInfo} categraryId={item.id}
                                                 navigator={navigator}/>
                                </View>
                            );
                        })
                    }
                </ScrollableTabView>
            )
        }
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
                    title='优惠券'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                {this.loadD()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cellStyle: {
        width: width - 30,
        margin: 14,
        marginBottom: 0,
        height: 100,
    },

    cellImageStyle: {
        flex: 1,
        borderRadius: 4,
        resizeMode:'stretch'
    },
    leftTextViewStyle: {
        position: 'absolute',
        width: 100,
        height: 100,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftTextStyle: {
        fontSize: 24,
        color: '#f5f5f5'
    },
    rightTextViewStyle: {
        position: 'absolute',
        width: width - 145,
        height: 100,
        marginLeft: 120,
        backgroundColor: 'transparent',
        justifyContent: 'center'
    },
    couponImgStyle: {
        width: 72,
        height: 72,
        marginLeft: 14,
    },
    textViewStyle: {
        marginLeft: 8,
        width: width - 130
    },
    itemLayout: {flex: 1, alignItems: 'center', justifyContent: 'center'}

});