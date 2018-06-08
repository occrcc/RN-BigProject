import React, {Component} from 'react'
import {
    View,
    ListView,
    StyleSheet,
    Dimensions,
    Image,
    Text,
    TouchableOpacity,
    DeviceEventEmitter, InteractionManager,
    RefreshControl
} from 'react-native'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let {width} = Dimensions.get('window')
var ServeApi = require('../ServeApi/ServeApi')

export default class MyOrderListView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: ds.cloneWithRows([]),
            visible: false,
            totalPage: 0,
            index: 1,
            size: 10,
            isLoadingMore: false,
            datas: []
        }
    }

    componentWillMount() {
        this.getSource();
    }

    componentWillUnmount() {
        this.refreshMyOrderList.remove();
    }

    componentDidMount() {
        this.refreshMyOrderList = DeviceEventEmitter.addListener('refreshMyOrderList', (stateId) => {
            if (stateId === this.props.categraryId) {
                this.getSource()
            }
        });
    }

    getSource() {
        ServeApi.getMyOrders(this.props.categraryId, this.state.index, this.state.size, this.props.userInfo.token).then(res => {
            let newArr = res.list;
            console.log(res);
            this.setState({
                dataSource: ds.cloneWithRows(newArr),
                totalPage: res.totalpage,
                datas: newArr,
                index: 1,
            })
        }).catch(err => {
            console.log('error :' + err);
        })
    }


    orderStatus(rowData) {
        let order_status = parseInt(rowData.order_status);
        if (order_status === 0 || order_status === 7) {
            return (
                <TouchableOpacity activeOpacity={0.8} style={styles.btnStyle} onPress={() => {
                    DeviceEventEmitter.emit('myOrderPay', rowData);
                }}>
                    <Text style={{color: 'rgb(224, 87, 15)', fontSize: 14, fontWeight: 'bold'}}>待支付</Text>
                </TouchableOpacity>
            )
        } else {
            let btnTitle = '';
            switch (order_status) {
                case 1: {
                    btnTitle = "已支付";
                }
                    break;
                case 3: {
                    btnTitle = "已完成";
                }
                    break;
                case 4: {
                    btnTitle = "已评价";
                }
                    break;
                case 6: {
                    btnTitle = "待处理";
                }
                    break;
                case 9: {
                    btnTitle = "已取消";
                }
                    break;
                case 10: {
                    btnTitle = "已关闭";
                }
                    break;
                default:
                    break;
            }
            return (
                <View style={styles.btnStyle}>
                    <Text style={{color: 'rgb(224, 87, 15)', fontSize: 14, fontWeight: 'bold'}}>{btnTitle}</Text>
                </View>
            )
        }
    }


    renderRow(rowData, rowID) {
        let serveType = parseInt(rowData.serveType);
        let imageUrl = rowData.img.length > 0 ? rowData.img : 'default_serve_logo';

        console.log(imageUrl);

        return (
            <View key={rowID}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => {
                    DeviceEventEmitter.emit('myOrderHtml', rowData);
                }}>
                    <View style={styles.cellTopLineStyle}>
                        <Image source={{uri: serveType === 10 ? 'xiecheng' : 'pinpai'}} style={styles.cellTopImgStyle}/>
                        <Text style={styles.topTitleStyle}>{'品牌服务'}</Text>
                    </View>
                    <View style={styles.rowContentStyle}>
                        <Image source={{uri: imageUrl}} style={styles.serveImageType}/>
                        <View style={styles.contentTextStle}>
                            <Text numberOfLines={2} style={{fontSize: 16, marginLeft: 15}}>{rowData.serveName}</Text>
                            <Text style={{
                                color: 'rgb(188,188,188)',
                                marginTop: 24,
                                fontSize: 15,
                                marginLeft: 15
                            }}>{rowData.createtime}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={styles.priceLabStyle}>
                    <Text style={{
                        fontSize: 14,
                        marginLeft: 15,
                    }}>实付款:￥{rowData.price}</Text>
                    {this.orderStatus(rowData)}
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                {this.loadD()}
            </View>
        )
    }


    _loadMoreData() {
        this.setState({
            isLoadingMore: true
        }, () => {
            let index = this.state.index;
            index++;
            ServeApi.getMyOrders(this.props.categraryId, index, this.state.size, this.props.userInfo.token).then(res => {
                let newArr = res.list;
                let datas = this.state.datas;
                for (var i = 0; i < newArr.length; i++) {
                    datas.push(newArr[i])
                }
                this.setState({
                    index: index,
                    datas: datas,
                    dataSource: ds.cloneWithRows(datas),
                    isLoadingMore: false
                })
                console.log('this.datas.length:    ' + datas.length);
            }).catch(err => {
                console.log('error :' + err);
            })
        })

    }

    _toEnd() {
        //ListView滚动到底部，根据是否正在加载更多 是否正在刷新 是否已加载全部来判断是否执行加载更多
        if (this.state.isLoadingMore || this.state.totalPage <= this.state.index) {
            return;
        }

        InteractionManager.runAfterInteractions(() => {
            console.log("触发加载更多 toEnd() --> ");
            this._loadMoreData();
        });
    }

    _renderFooter() {
        if (this.state.totalPage === this.state.index) {
            return (
                <View style={{width: width, height: 30, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 12, color: 'rgb(188,188,188)'}}>我是有底线的</Text>
                </View>
            )
        } else {
            return (
                <View style={{width: width, height: 30, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 12, color: 'rgb(188,188,188)'}}>加载更多</Text>
                </View>
            )
        }
    }

    loadD() {
        if (this.state.dataSource.getRowCount() === 0) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={{uri: 'youhuiquan'}}
                           style={{resizeMode: 'stretch', marginTop: 100, width: 200, height: 130}}/>
                    <Text style={{
                        textAlign: 'center',
                        marginTop: 30,
                        fontSize: 17,
                        color: 'rgb(111,111,111)'
                    }}>{this.state.tip}</Text>
                </View>
            );
        } else {
            return (
                <ListView
                    style={{marginBottom: global.params.iPhoneXHeight}}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this.getSource.bind(this)}
                        />}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    enableEmptySections={true}
                    onEndReached={this._toEnd.bind(this)}
                    renderFooter={this._renderFooter.bind(this)}
                    onEndReachedThreshold={10}
                />

            );
        }
    }
}

const styles = StyleSheet.create({
    cellTopLineStyle: {
        flexDirection: 'row',
        width: width,
        height: 38,
        borderBottomColor: 'rgb(244,244,244)',
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    cellTopImgStyle: {
        resizeMode: 'stretch',
        height: 18,
        width: 18,
        marginLeft: 15
    },
    topTitleStyle: {
        marginLeft: 15,
        fontSize: 15,
    },
    rowContentStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: 'rgb(244,244,244)',
        borderBottomWidth: 1,
        height: 100,
    },
    serveImageType: {
        marginLeft: 15,
        width: 120,
        height: 80,
        borderRadius: 2,
        resizeMode: 'stretch',
    },
    contentTextStle: {
        width: width - 165,
    },
    priceLabStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
        borderBottomColor: 'rgb(244,244,244)',
        borderBottomWidth: 8,
    },
    btnStyle: {
        position: 'absolute',
        borderRadius: 4,
        right: 15,
        borderColor: 'rgb(224, 87, 15)',
        borderWidth: 1,
        width: 80,
        height: 28,
        top: 4,
        justifyContent: 'center',
        alignItems: 'center'
    }
})