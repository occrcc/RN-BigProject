import React, {Component} from 'react'
import {
    View,
    ListView,
    StyleSheet,
    Dimensions,
    StatusBar,
    PixelRatio,
    TouchableOpacity,
    Text,
    Image,
    InteractionManager, DeviceEventEmitter
} from 'react-native'

//加载指示器

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import NavBar from '../Componnet/NavBar'


let {width} = Dimensions.get('window')

export default class OrderSuccessfulPage extends Component {
    constructor(props) {
        super(props)
    }

    back() {
        this.props.navigator.pop();
    }


    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            console.log(this.props.orderInfo);
        });

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
                    title="交易详情"
                />
                <View style={styles.headViewStyle}>
                    <Image source={{uri: 'icon_ok'}} style={styles.headIconStyle}/>
                    <Text style={styles.titleStyle}>支付成功</Text>
                </View>

                <View style={{marginTop:20}}>
                    <View style={{
                        height:44,
                        borderBottomWidth:0.5,
                        borderBottomColor:'rgb(222,222,222)',
                        alignItems:'center',
                        justifyContent:'space-between',
                        flexDirection:'row'
                    }}>
                        <Text style={{fontSize:15,marginLeft:14}}>订单号</Text>
                        <Text style={{color:'rgb(177,177,177)',fontSize:13,marginRight:14}}>{this.props.orderInfo.sn}</Text>
                    </View>
                    <View style={{
                        height:44,
                        borderBottomWidth:0.5,
                        borderBottomColor:'rgb(222,222,222)',
                        alignItems:'center',
                        justifyContent:'space-between',
                        flexDirection:'row'
                    }}>
                        <Text style={{fontSize:15,marginLeft:14}}>服务名称</Text>
                        <Text numberOfLines={2} style={{textAlign:'right',width:width - 100, color:'rgb(177,177,177)',fontSize:13,marginRight:14}}>{this.props.orderInfo.serveName}</Text>
                    </View>
                    <View style={{
                        height:44,
                        borderBottomWidth:0.5,
                        borderBottomColor:'rgb(222,222,222)',
                        alignItems:'center',
                        justifyContent:'space-between',
                        flexDirection:'row'
                    }}>
                        <Text style={{fontSize:15,marginLeft:14}}>下单时间</Text>
                        <Text style={{color:'rgb(177,177,177)',fontSize:13,marginRight:14}}>{this.props.orderInfo.createtime}</Text>
                    </View>
                </View>

                <TouchableOpacity activeOpacity={0.8} style={styles.popContentViewStyle}
                                  onPress={()=>{



                                      var destinationRoute = null;
                                      const routes = this.props.navigator.state.routeStack;
                                      for (var i = routes.length - 1; i >= 0; i--) {
                                          console.log(routes[i].component.displayName);
                                          if(routes[i].component.displayName === "MyOrderList"){
                                              destinationRoute = this.props.navigator.getCurrentRoutes()[i];
                                              break;
                                          }
                                      }
                                      if (destinationRoute){
                                          this.props.navigator.popToRoute(destinationRoute);
                                      }else {
                                          this.props.navigator.popToTop();
                                      }

                                      //通知已支付订单刷新界面
                                      DeviceEventEmitter.emit('refreshMyOrderList', -1);
                                      DeviceEventEmitter.emit('refreshMyOrderList', 0);
                                      DeviceEventEmitter.emit('refreshMyOrderList', 1);
                                  }}
                >
                    <Text style={{fontSize: 16, color: '#ffffff'}}>完成</Text>
                </TouchableOpacity>

            </View>
        )
    }
}

const styles = StyleSheet.create({

    headViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headIconStyle:{
        width:80,
        height:80,
        marginTop:30,
        marginBottom:28,
        resizeMode:'stretch'
    },
    titleStyle:{
        fontSize:15,
        color:'#b2b2b2',
        marginBottom:5,

    },
    contentStyle:{
        fontSize:13,
        color:'#969696',
        marginBottom:18,
        marginRight:15,
        marginLeft:15,
    },
    popContentViewStyle:{
        marginLeft:14,
        marginRight:14,
        borderRadius:4,
        marginTop:30,
        height:44,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:global.params.backgroundColor,
    }
})