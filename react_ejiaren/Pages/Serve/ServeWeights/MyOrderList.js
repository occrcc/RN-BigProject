import React, {Component} from 'react'
import {
    View,
    StatusBar,
    StyleSheet,
    DeviceEventEmitter
} from 'react-native'

import NavBar from '../../Componnet/NavBar'

var ServeApi = require('../ServeApi/ServeApi')
import {Navigator} from 'react-native-deprecated-custom-components'
import OrderPay from '../OrderPay'
import ScrollableTabView, {ScrollableTabBar} from "react-native-scrollable-tab-view"
import OrderList from './MyOrderListView'
import OrderHtml from './MyorderHtml'
import FillPrice from './FillPrice'

import Spinner from 'react-native-loading-spinner-overlay';

export default class MyOrderList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orderList: [],
            visible: false
        }
        this.headerArr = [{title: '全部', id: '-1'}, {title: '待支付', id: '0'}, {title: '已支付', id: '1'}, {
            title: '已完成',
            id: '3'
        }, {title: '已关闭', id: '10'}]
    }

    componentDidMount() {
        this.myOrderPayListner = DeviceEventEmitter.addListener('myOrderPay', (orderInfo) => {
            this.requestPayOrder(orderInfo);
        });

        this.myOrderHmtlListner = DeviceEventEmitter.addListener('myOrderHtml', (orderInfo) => {
            this.props.navigator.push({
                component: OrderHtml,
                params: {orderInfo: orderInfo, userInfo: this.props.userInfo},
            })
        });
    }

    componentWillUnmount() {
        this.myOrderHmtlListner.remove();
        this.myOrderPayListner.remove();
    }

    back() {
        this.props.navigator.pop()
    }

    requestPayOrder(orderInfo) {
        this.setState({
            visible: true
        });
        let sn = orderInfo.sn;
        let titele = orderInfo.titele;
        let payCode = orderInfo.pay_code;
        let id = orderInfo.id;

        var orderUrl = '';
        if (orderInfo.order_status === 0 || orderInfo.order_status === 7) {
            orderUrl = 'serve/order_view/' + id;
        }
        ServeApi.getPayBeforOrderDetail(orderUrl, this.props.userInfo.token).then(res => {
            console.log(res);
            this.props.navigator.push({
                sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                component: OrderPay,
                params: {orderInfo: res, userInfo: this.props.userInfo},
            })

            this.setState({
                visible: false
            });
        }).catch(err => {
            console.log('error:  ' + err);
            this.setState({
                visible: false
            });
        })
    }

    bucha() {
        this.props.navigator.push({
            component: FillPrice,
            params: {userInfo: this.props.userInfo},
        })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                <NavBar
                    title='我的订单'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                    rightTitle='补差价'
                    rightPress={this.bucha.bind(this)}


                />

                <ScrollableTabView
                    initialPage={0}
                    // scrollWithoutAnimation={true}
                    renderTabBar={() => < ScrollableTabBar
                        underlineStyle={{backgroundColor: global.params.backgroundColor, height: 2}}
                        activeTextColor={global.params.backgroundColor}
                        textStyle={{fontSize: 16}}
                        backgroundColor='white'
                        tabStyle={{paddingLeft: 12, paddingRight: 12, paddingBottom: 0}}
                        inactiveTextColor='#696969'
                    />}
                >
                    {
                        this.headerArr.map((item, i) => {
                            return (
                                <View key={i} tabLabel={item.title} style={styles.itemLayout}>
                                    <OrderList categraryId={item.id} navigator={navigator}
                                               userInfo={this.props.userInfo}/>
                                </View>
                            );
                        })
                    }
                </ScrollableTabView>
                <Spinner visible={this.state.visible} size={"small"}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemLayout: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});