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
    InteractionManager
} from 'react-native'

import NavBar from '../Componnet/NavBar'

import {CachedImage} from 'react-native-img-cache'

var ServeApi = require('./ServeApi/ServeApi')
import ServeHtml from './ServeHtml/ServeHtml'
import ServeZufang from './ServeWeights/ServeZuFang'
import ServeList from './ServeList/ServeList'
import Alert from 'rnkit-alert-view';
import LoginVC from '../Main/LoginVC'
import Myorder from './ServeWeights/MyOrderList'
import ServeXCJieji from './ServeHtml/ServeXCJieji'
import UnionPay from './ServeHtml/UnionPay'
import ServeJieji from './ServeJieji/JiejiHome'
import {Navigator} from 'react-native-deprecated-custom-components'
import VisaPay from './VisaPay/VisaPay'
import MyWalletVC from '../Mine/MineOtherPages/MyWalletVC'
import MyCoupons from '../Mine/MineOtherPages/MyCoupons'

let {width} = Dimensions.get('window')
import storage from '../RNAsyncStorage'

export default class EJRServe extends Component {
    constructor(props) {
        super(props)
        this.state = {
            topImageUrl: 'serve_header',
            title: '服务',
            listSectionItem: [],
            userInfo:null,
            loaded:false
        }
        this.topItems = [
            ['icon_myorder', '我的订单'],
            ['icon_mywallet', '我的钱包'],
            ['icon_myyouhui', '优惠券'],
        ]
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

    getUserInfo(){
        console.log('getUserInfo');
        storage.load({
            key: 'userInfo',
            autoSync: true
        }).then(res=>{
            console.log('当前用户：'+JSON.stringify(res));
            this.setState({userInfo:res});
            this.getServeListItems(res.token);
        }).catch(err=>{
            //console.log('未检查到用户 '+err.message)
            this.setState({userInfo:null});
            // console.log('未检查到用户 ' + err)
            this.getServeListItems('');
        })
    }

    rightPress(name) {
        this.props.navigator.push({
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            component: name,
        });
    }

    showAlert(){
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
                loaded:true,
                listSectionItem: res,
            })
        }).catch(err => {
            console.log('error  ' + err);
        })
    }

    getTopImage() {
        ServeApi.getTopImage().then(res => {
            console.log(res);
            this.setState({

                topImageUrl: res.Serve_banners,
                title: res.name
            })
        }).catch(err => {
            console.log('error  ' + err);
        })
    }

    selectItem(item) {

        if(!this.state.userInfo){
            this.showAlert();
            return;
        }
        console.log(item);
        if(item.view === 'v5'){
            console.log('v5');
            this.pushView(ServeHtml,item);
        }else if(item.view === 'v2'){
            console.log('v2');
            if (item.id === 7){
                this.pushView(ServeZufang);
            }else if (item.id === 2){
                this.pushView(ServeJieji,item);
            }else {
                this.pushView(ServeList,item);
            }
        }else if(item.view === 'v6'){
            this.props.navigator.push({
                component: ServeXCJieji,
                params: {userInfo:this.state.userInfo,title:'国际机票'},
            })
        }else if(item.view === 'v7'){
            this.props.navigator.push({
                component: ServeXCJieji,
                params: {webUrl:item.url,title:'存款证明'},
            })
        }else if(item.view === 'v1'){
            this.props.navigator.push({
                component: UnionPay,
                params: {userInfo:this.state.userInfo},
            })
        }else if(item.view === 'v8'){
            console.log('v8');
            this.pushView(VisaPay,item);
        }
    }

    pushView(name,item){
        this.props.navigator.push({
            component: name,
            params: {item:item,userInfo:this.state.userInfo},
        })
    }

    clickHeaderBtn(name){
        if(!this.state.userInfo){
            this.showAlert();
            return;
        }
        console.log(name);
        if (name === '我的订单'){
            this.props.navigator.push({
                component: Myorder,
                params: {userInfo:this.state.userInfo},
            })
        }else if (name === '我的钱包'){
            this.props.navigator.push({
                component: MyWalletVC,
                params: {userInfo:this.state.userInfo},
            })
        }else if (name === '优惠券'){
            this.props.navigator.push({
                component: MyCoupons,
                params: {userInfo:this.state.userInfo},
            })
        }
    }



    loadD(){
        if (this.state.loaded){
            return (
                <ScrollView style={{backgroundColor: '#f5f5f5',marginBottom:global.params.iPhoneXHeight}}>
                    <CachedImage source={{uri: this.state.topImageUrl}} style={styles.headerImgStyle}/>
                    <View style={{flexDirection: 'row',marginBottom:10}}>
                        {this.topItems.map((item, i) => {
                            return (
                                <TouchableOpacity key={i} activeOpacity={0.8} style={styles.headItemStyle} onPress={
                                    this.clickHeaderBtn.bind(this,item[1])
                                }>
                                    <Image source={{uri: item[0]}} style={{width: 22, height: 22}}/>
                                    <Text
                                        style={{marginTop: 13, color: '#4a4a4a', fontSize: 14}}>{item[1]}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    <View>
                        {
                            this.state.listSectionItem.map((sectionItem, i) => {
                                return (
                                    <View key={i} style={styles.sectionViewStyle}>
                                        <Text style={styles.sectionTitleStyle}>{sectionItem.title}</Text>

                                        <View style={styles.contentItemsStyle}>
                                            {
                                                sectionItem.items.map((item, i) => {
                                                    if(item.iconUrl.length > 0){
                                                        return (
                                                            <TouchableOpacity key={i} activeOpacity={0.8}
                                                                              style={styles.mainListItemStyle}
                                                                              onPress={this.selectItem.bind(this,item)}
                                                            >
                                                                <CachedImage source={{uri: item.iconUrl}}
                                                                             style={styles.mainListImageStyle}/>
                                                                <Text style={styles.mainListTitleStyle}>{item.name}</Text>
                                                            </TouchableOpacity>
                                                        )
                                                    }else {
                                                        return (
                                                            <View key={i} style={styles.mainListItemStyle} >
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
        }else{
            return (
                <Image source={{uri: 'scr_server'}} style={{width:width,height:width*1.5}}/>
            );
        }
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
                    title={this.state.title}
                />
                {this.loadD()}
                {/*<ScrollView style={{backgroundColor: '#f5f5f5',marginBottom:global.params.iPhoneXHeight}}>*/}
                    {/*<CachedImage source={{uri: this.state.topImageUrl}} style={styles.headerImgStyle}/>*/}
                    {/*<View style={{flexDirection: 'row',marginBottom:10}}>*/}
                        {/*{this.topItems.map((item, i) => {*/}
                            {/*return (*/}
                                {/*<TouchableOpacity key={i} activeOpacity={0.8} style={styles.headItemStyle} onPress={*/}
                                    {/*this.clickHeaderBtn.bind(this,item[1])*/}
                                {/*}>*/}
                                    {/*<Image source={{uri: item[0]}} style={{width: 22, height: 22}}/>*/}
                                    {/*<Text*/}
                                        {/*style={{marginTop: 13, color: '#4a4a4a', fontSize: 14}}>{item[1]}</Text>*/}
                                {/*</TouchableOpacity>*/}
                            {/*)*/}
                        {/*})}*/}
                    {/*</View>*/}
                    {/*<View>*/}
                        {/*{*/}
                            {/*this.state.listSectionItem.map((sectionItem, i) => {*/}
                                {/*return (*/}
                                    {/*<View key={i} style={styles.sectionViewStyle}>*/}
                                        {/*<Text style={styles.sectionTitleStyle}>{sectionItem.title}</Text>*/}

                                        {/*<View style={styles.contentItemsStyle}>*/}
                                            {/*{*/}
                                                {/*sectionItem.items.map((item, i) => {*/}
                                                    {/*if(item.iconUrl.length > 0){*/}
                                                        {/*return (*/}
                                                            {/*<TouchableOpacity key={i} activeOpacity={0.8}*/}
                                                                              {/*style={styles.mainListItemStyle}*/}
                                                                              {/*onPress={this.selectItem.bind(this,item)}*/}
                                                            {/*>*/}
                                                                {/*<CachedImage source={{uri: item.iconUrl}}*/}
                                                                             {/*style={styles.mainListImageStyle}/>*/}
                                                                {/*<Text style={styles.mainListTitleStyle}>{item.name}</Text>*/}
                                                            {/*</TouchableOpacity>*/}
                                                        {/*)*/}
                                                    {/*}else {*/}
                                                        {/*return (*/}
                                                            {/*<View key={i} style={styles.mainListItemStyle} >*/}
                                                            {/*</View>*/}
                                                        {/*)*/}
                                                    {/*}*/}
                                                {/*})*/}
                                            {/*}*/}
                                        {/*</View>*/}
                                    {/*</View>*/}
                                {/*)*/}
                            {/*})*/}
                        {/*}*/}
                    {/*</View>*/}
                {/*</ScrollView>*/}
            </View>
        )
    }
}

const styles = StyleSheet.create({

    headerImgStyle: {
        width: width,
        height: width * 0.5,
        backgroundColor: '#f5f5f5',
        resizeMode: 'stretch'
    },
    headItemStyle: {
        width: width / 3,
        height: 74,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRightWidth: 1,
        borderRightColor: '#f5f5f5'
    },
    sectionViewStyle: {
        width: width,
        justifyContent: 'center',
        backgroundColor:'white',
    },

    contentItemsStyle: {
        borderTopWidth:1,
        borderTopColor:'#f5f5f5',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },

    sectionTitleStyle: {
        color: '#2a2a2a',
        fontSize: 15,
        marginLeft: 14,
        marginTop: 14,
        marginBottom: 12,
    },
    mainListItemStyle: {
        width: width / 3,
        height: 96,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRightWidth: 1,
        borderRightColor: 'rgb(244,244,244)',
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5'
    },
    mainListImageStyle: {
        width: 48,
        height: 48,
    },
    mainListTitleStyle: {
        marginTop: 8,
        color: '#4a4a4a',
        fontSize: 13,
    }

})