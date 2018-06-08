import React, {Component} from 'react'
import {
    StatusBar,
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    Text,
    DeviceEventEmitter,
    InteractionManager,
    Platform
} from 'react-native'

import NavBar from '../../Componnet/NavBar'

import {CachedImage} from 'react-native-img-cache'

var ServeApi = require('../ServeApi/ServeApi')
import ServeHtml from '../ServeHtml/ServeHtml'
import ServeZufang from '../ServeWeights/ServeZuFang'
import ServeList from '../ServeList/ServeList'
import Alert from 'rnkit-alert-view';
import LoginVC from '../../Main/LoginVC'
import Myorder from '../ServeWeights/MyOrderList'
import ServeXCJieji from '../ServeHtml/ServeXCJieji'
import UnionPay from '../ServeHtml/UnionPay'
import ServeJieji from '../ServeJieji/JiejiHome'
import {Navigator} from 'react-native-deprecated-custom-components'
import VisaPay from '../VisaPay/VisaPay'
import MyWalletVC from '../../Mine/MineOtherPages/MyWalletVC'
import MyCoupons from '../../Mine/MineOtherPages/MyCoupons'

let {width} = Dimensions.get('window')
import storage from '../../RNAsyncStorage'
import VisaNoInfo from "../VisaPay/VisaNoInfo";

var HomeServers = require('../../Home/HomeServers')

export default class EJRServe extends Component {
    constructor(props) {
        super(props)
        this.state = {
            topImageUrl: 'serve_header',
            title: '服务',
            listSectionItem: [],
            userInfo: null,
            loaded: false,
            orderRedPoint: false,
            couponRedPoint: false,
        }
    }

    componentWillMount() {
        this.getTopImage();
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.getUserInfo();
        });
        this.uploadServeUserInfo = DeviceEventEmitter.addListener('uploadServeUserInfo', () => {
            this.getUserInfo();
        });
    }



    componentWillUnmount() {
        this.uploadServeUserInfo.remove();
    }

    getUserInfo() {
        console.log('getUserInfo');
        storage.load({
            key: 'userInfo',
            autoSync: true
        }).then(res => {
            console.log('当前用户：' + JSON.stringify(res));
            this.setState({userInfo: res});
            this.getServeListItems(res.token);
            this.getRedTips(res.token);
        }).catch(err => {
            this.setState({userInfo: null});
            this.getServeListItems('');
        })
    }

    getRedTips(token){
        HomeServers.getNavigatorBadge(token).then(res => {
            if (parseInt(res.order_count) > 0) {
                this.setState({orderRedPoint: true});
            }
            if (parseInt(res.coupon_count) > 0) {
                this.setState({couponRedPoint: true});
            }
        }).catch(err => {
            console.log(err);
        })
    }

    rightPress(name) {
        this.props.navigator.push({
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            component: name,
        });
    }

    showAlert() {
        Alert.alert(
            '提示', '没有检测到您的账号', [
                {text: '以后再说', onPress: () => console.log('以后再说')},
                {
                    text: '去登陆', onPress: () => {
                    this.rightPress(LoginVC)
                }
                },
            ],
        );
    }

    getServeListItems(token) {
        console.log('getServeListItems');
        ServeApi.getServeListItems(token).then(res => {
            console.log(res);
            this.setState({
                loaded: true,
                listSectionItem: res,
            })
        }).catch(err => {
            console.log('error  ' + err);
        })
    }

    getTopImage() {
        ServeApi.getTopImage().then(res => {
            this.setState({
                topImageUrl: res.Serve_banners,
                title: res.name
            })
        }).catch(err => {
            console.log('error  ' + err);
        })
    }

    selectItem(item) {

        if (!this.state.userInfo) {
            this.showAlert();
            return;
        }

        console.log(item);

        if (item.view === 'v5') {
            console.log('v5');
            this.pushView(ServeHtml, item);
        } else if (item.view === 'v2') {
            console.log('v2');
            if (item.id === 7) {
                this.pushView(ServeZufang,item);
            } else if (item.id === 2) {
                this.pushView(ServeJieji, item);
            } else {
                this.pushView(ServeList, item);
            }
        } else if (item.view === 'v6') {
            this.props.navigator.push({
                component: ServeXCJieji,
                params: {userInfo: this.state.userInfo, title: '国际机票'},
            })
        } else if (item.view === 'v7') {
            this.props.navigator.push({
                component: ServeXCJieji,
                params: {webUrl: item.url, title: '存款证明'},
            })
        } else if (item.view === 'v1') {
            this.props.navigator.push({
                component: UnionPay,
                params: {userInfo: this.state.userInfo,item:item},
            })
        } else if (item.view === 'v8') {
            console.log('v8');
            this.pushView(VisaPay, item);
        }
    }

    pushView(name, item) {
        this.props.navigator.push({
            component: name,
            params: {item: item, userInfo: this.state.userInfo},
        })
    }

    clickHeaderBtn(name) {
        if (!this.state.userInfo) {
            this.showAlert();
            return;
        }
        console.log(name);
        let vcName = Myorder;
        if (name === '我的钱包') {
            vcName = MyWalletVC;
        } else if (name === '优惠券') {
            vcName = MyCoupons;
        }

        this.props.navigator.push({
            component: vcName,
            params: {userInfo: this.state.userInfo},
        })

    }

    showRedPoint(i) {
        if (i === 0 && this.state.orderRedPoint) {
            return (
                <View style={{marginLeft: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: 'red'}}/>
            )
        } else if (i === 2 && this.state.couponRedPoint) {
            return (
                <View style={{marginLeft: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: 'red'}}/>
            )
        }
    }

    loadD() {
        if (this.state.loaded) {
            return (
                <ScrollView style={{backgroundColor: '#fafafa', marginBottom: global.params.iPhoneXHeight}}>

                    <View>
                        {
                            this.state.listSectionItem.map((sectionItem, i) => {
                                return (
                                    <View key={i} style={styles.sectionViewStyle}>
                                        <View style={styles.contentItemsStyle}>
                                            {
                                                sectionItem.items.map((item, i) => {
                                                    if (item.iconUrl.length > 0) {
                                                        return (
                                                            <TouchableOpacity key={i} activeOpacity={0.8}
                                                                              style={styles.mainListItemStyle}
                                                                              onPress={this.selectItem.bind(this, item)}
                                                            >
                                                                <Image  source={{uri:this.getImgUrl(item.iconUrl)}}
                                                                             style={styles.mainListImageStyle}/>
                                                                <Text
                                                                    style={styles.mainListTitleStyle}>{item.name}</Text>
                                                            </TouchableOpacity>
                                                        )
                                                    } else {
                                                        return (
                                                            <View key={i} >
                                                            </View>
                                                        )
                                                    }
                                                })
                                            }
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            );
        } else {
            return (
                <Image source={{uri: 'scr_server'}} style={{width: width, height: width * 1.5}}/>
            );
        }
    }

    getImgUrl(url){
        let arr = [
            {
                name: 'http://pic.ejiarens.com/servePanelIcon/priceIcon.png',
                replaceUrl: 'icon_1_290'
            },
            {
                name: 'http://pic.ejiarens.com/servePanelIcon/giffgaff.png',
                replaceUrl: 'icon_8_290'
            },
            {
                name: 'http://pic.ejiarens.com/servePanelIcon/zufangIcon.png',
                replaceUrl: 'icon_7_290'
            },
            {
                name: 'http://pic.ejiarens.com/servePanelIcon/shipping.png',
                replaceUrl: 'icon_3_290'
            },
            {
                name: 'http://pic.ejiarens.com/servePanelIcon/airportIcon.png',
                replaceUrl: 'icon_2_290'
            },
            {
                name: 'http://pic.ejiarens.com/servePanelIcon/flightIcon.png',
                replaceUrl: 'icon_17_290'
            },
            {
                name: 'http://pic.ejiarens.com/servePanelIcon/translate.png',
                replaceUrl: 'icon_18_290'
            },
            {
                name: 'http://pic.ejiarens.com/servePanelIcon/ckzm.png',
                replaceUrl: 'icon_23_290'
            },
            {
                name: 'http://pic.ejiarens.com/servePanelIcon/hwjhr.png',
                replaceUrl: 'icon_41_290'
            },
            {
                name: 'http://pic.ejiarens.com/servePanelIcon/visa.png',
                replaceUrl: 'icon_24_290'
            },

        ];

        let item = arr.find(item => {
            return item.name === url
        })

        if (item) {
            return item.replaceUrl
        } else {
            return 'icon_999_290'
        }
    }



    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#fafafa",}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                    backgroundColor={global.params.backgroundColor}
                    // translucent={true}
                />
                <NavBar
                    title={this.state.title}
                />
                {this.loadD()}
            </View>
        )
    }
}

const styles = StyleSheet.create({

    headerImgStyle: {
        width: width,
        height: width * 0.5,
        backgroundColor: '#fafafa',
        resizeMode: 'stretch'
    },
    headItemStyle: {
        width: width / 3,
        height: 74,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRightWidth: 1,
        borderRightColor: '#fafafa'
    },
    sectionViewStyle: {
        width: width,
        justifyContent: 'center',
        backgroundColor: '#fafafa',
    },

    contentItemsStyle: {
        borderTopWidth: 1,
        borderTopColor: '#fafafa',
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginBottom:15
    },

    sectionTitleStyle: {
        color: '#2a2a2a',
        fontSize: 15,
        marginLeft: 14,
        marginTop: 14,
        marginBottom: 12,
    },
    mainListItemStyle: {
        width: (width - 45) / 2,
        height: 165,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        marginLeft:15,
        marginTop:14,

        shadowColor:'#000',
        shadowOffset:{width:0,height:7.5},
        shadowOpacity:0.05,
        borderRadius:5,

    },
    mainListImageStyle: {
        width: 110,
        height: 110,
        resizeMode: 'stretch',
    },

    mainListTitleStyle: {
        marginTop: 15,
        color: '#4a4a4a',
        fontSize: 10,
        fontWeight:'bold'
    }

})