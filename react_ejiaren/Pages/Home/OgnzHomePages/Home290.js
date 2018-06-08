import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    Image,
    Switch,
    TouchableOpacity,
    ScrollView,
    DeviceEventEmitter,
    Platform,
    StatusBar
} from 'react-native'


import {CachedImage} from 'react-native-img-cache';

var HomeServe = require('../HomeServers')
let {width, height} = Dimensions.get('window')
import storage from '../../RNAsyncStorage'
import Swiper from 'react-native-swiper';

import * as Animatable from 'react-native-animatable';
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import NavBar from '../../Componnet/NavBar'

export default class Home290 extends Component {

    constructor(props) {
        super(props)
        this.state = {
            middleListAry: [],
            userInfo: null,
            loaded: false,
            dataAry: [],
            showHeadImg: true,
        }

        this.topItems = [
            ['留学申请', 'shenqing_289', 0],
            ['语言申请', 'yuyan_289', -1],
            ['课程申请', 'kecheng_289', -1],
            ['GPA计算', 'gpa_289', 0],
        ]
    }

    componentWillMount() {
        this.getSource();
        this.getUserInfo();
        this.getServeMiddleList();
    }

    getUserInfo() {
        storage.load({
            key: 'userInfo'
        }).then(res => {
            this.setState({userInfo: res});
        }).catch(err => {
            this.setState({userInfo: null});
            console.log('未检查到用户 ' + err);
        })
    }

    getServeMiddleList() {
        HomeServe.getHomeArticleList().then(res => {
            console.log(res);
            this.setState({middleListAry: res, loaded: true});
        }).catch(error => {
            console.log('error:  ' + error);
        })
    }

    async getSource() {
        var source = await HomeServe.getHomeData();
        let newArr = source;
        this.setState({
            dataAry: newArr,
        })
    }


    renderItem() {


        var itemAry = [];

        var colorAry  = [
            ['留学申请', 'one_290', 0],
            ['精品课程', 'tow_290', 106],
            ['词汇量测试', 'three_290', -1],
        ]



        // 遍历
        for (var i = 0; i < colorAry.length; i++) {
            let obj = colorAry[i];
            itemAry.push(
                <TouchableOpacity key={i} activeOpacity={1} style={{marginRight: i === 2 ? 10 : 0}} onPress={() => {
                    DeviceEventEmitter.emit('homeDidSelectTopItem', obj);
                }}>
                    <Image source={{uri: obj[1]}}
                           style={styles.headScrollImageStyle}/>
                </TouchableOpacity>
            );
        }
        return itemAry;


    }

    renderActivitieItem() {
        // 数组
        var itemAry = [];
        // 颜色数组
        var colorAry = this.props.activities;
        // 遍历
        for (var i = 0; i < colorAry.length; i++) {
            let obj = colorAry[i];
            itemAry.push(
                <TouchableOpacity key={i} activeOpacity={1} style={{flex: 1,}} onPress={() => {
                    DeviceEventEmitter.emit('didSelectActivitieItem', obj);

                }}>
                    <CachedImage source={{uri: obj.banner}}
                                 style={styles.activitieImageStyle}/>
                </TouchableOpacity>
            );
        }
        return itemAry;
    }



    headImageView() {
        var obj = this.props.headImageArr[0];
        var imgurl = 'first_head_290';
        if (obj && obj.bannerUrl.length > 0) {
            imgurl = obj.bannerUrl;
        }
        return ( <CachedImage source={{uri: imgurl}} style={[styles.headImageStyle,]}/>)
    }

    scrollImageView() {
        return (
            <ScrollView style={{width: width, paddingLeft: 5, paddingRight: 10,}}
                        horizontal={true}   // 水平方向
                        showsHorizontalScrollIndicator={false}  // 隐藏水平指示器
                        showsVerticalScrollIndicator={false}    // 隐藏垂直指示器
            >
                {this.renderItem()}
            </ScrollView>
        )
    }


    renderRow() {
        let rowData = this.state.dataAry;
        return (
            <View style={{marginBottom:15}}>
                {
                    rowData.map((rowData, i) => {
                        return (
                            <View key={i}>
                                <View style={{
                                    flexDirection: 'row',
                                    backgroundColor: 'white',
                                    alignItems: 'center'
                                }}>
                                    <Text allowFontScaling={false} style={{
                                        marginTop: 15,
                                        marginLeft: 15,
                                        fontSize: 15,
                                        fontWeight: 'bold'
                                    }}>{rowData.title}</Text>
                                </View>
                                {this.mainView(rowData, i)}
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    loadTeachers(rowData) {
        return (
            <View style={{flexDirection: 'row', backgroundColor: 'white'}}>
                {rowData.list.map((item, i) => {
                        return (
                            <TouchableOpacity activeOpacity={0.9} key={i} style={{
                                justifyContent: 'center',
                                marginTop: 15,
                                alignItems: 'center',
                                backgroundColor: 'white',
                            }} onPress={()=>{
                                DeviceEventEmitter.emit('homeDidSelectRow', item);
                            }}>
                                <CachedImage source={{uri: item.pic1}}
                                             style={[styles.teacherItemStyle, {
                                                 marginRight: i === rowData.list.length - 1 ? 10 : 0
                                             }]}/>
                                <View style={{width: 125, alignItems: 'center'}}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: '#414141',
                                        fontWeight: 'bold',
                                        marginTop: 12,
                                    }}>{item.title}</Text>
                                    <Text style={{
                                        fontSize: 11,
                                        color: '#929292',
                                        marginTop: 6,
                                        marginBottom: 12,

                                    }}>{item.desc}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                )}
            </View>
        )
    }

    mainView(rowData) {
        if (rowData.title === '名师风采') {
            return (
                <ScrollView style={{width: width, paddingRight: 10,}}
                            horizontal={true}   // 水平方向
                            showsHorizontalScrollIndicator={false}  // 隐藏水平指示器
                            showsVerticalScrollIndicator={false}    // 隐藏垂直指示器
                >
                    {this.loadTeachers(rowData)}
                </ScrollView>
            )

        } else {
            return (
                <View>
                    {rowData.list.map((item, i) => {
                        if (i === 0) {
                            return (
                                <TouchableOpacity activeOpacity={0.9} key={i} style={{
                                    backgroundColor: 'white',
                                }} onPress={() => {
                                    DeviceEventEmitter.emit('homeDidSelectRow', item);
                                }}>
                                    <CachedImage source={{uri: item.pic1}}
                                                 style={[styles.headImageStyle, {height: 180, marginBottom: 6}]}/>
                                    <View style={{width: width - 30, marginLeft: 15}}>
                                        <Text style={styles.contentTitleStyle}>{item.title}</Text>
                                        <Text numberOfLines={2} style={styles.contentDescStyle}>{item.desc}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        } else {
                            return (
                                <TouchableOpacity key={i} activeOpacity={0.9}
                                                  style={{flexDirection: 'row',
                                                      backgroundColor: 'white',
                                                  }}
                                                  onPress={() => {
                                                      DeviceEventEmitter.emit('homeDidSelectRow', item);
                                                  }}>

                                    <View>
                                        <View style={{marginTop:14,width: width - 30, marginLeft: 15, height:0.5,backgroundColor:'#EEEEEE'}} />
                                        <View style={{flexDirection:'row'}}>
                                            <CachedImage source={{uri: item.pic1}} style={{
                                                width: 130,
                                                height: 75,
                                                margin: 14,
                                                marginBottom:0,
                                            }}/>
                                            <View style={{
                                                marginRight: 14,
                                                width: width - 180,
                                                height: 75
                                            }}>
                                                <Text allowFontScaling={false}
                                                      numberOfLines={1}
                                                      style={[styles.contentTitleStyle,{marginTop:18}]}>{item.title}
                                                </Text>
                                                <Text allowFontScaling={false} numberOfLines={2}
                                                      style={[styles.contentDescStyle,{lineHeight:14}]}>
                                                    {item.desc}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    })}
                </View>
            )
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                {/*{this.navBarView()}*/}
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                <NavBar
                    title='首页'

                />
                {this.loadD()}

            </View>
        )
    }

    loadActivities() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={()=>{
                DeviceEventEmitter.emit('homeDidSelectRow', {id:'1169',title:'雅思保分计划"'});
            }}>
                <Image source={{uri: 'jihua_290'}} style={[styles.headImageStyle, {height: 125, marginTop: 5, marginBottom:8}]}/>

            </TouchableOpacity>
        )
    }


    loadD() {
        let navBarHeight = (Platform.OS === 'ios' ? 64 : (44 + global.params.StatusBarHight)) + (global.params.iPhoneXHeight * 2) + 49;
        if (this.state.loaded) {
            return (
                <View style={{width: width, height: height - navBarHeight}}>
                    <ParallaxScrollView
                        backgroundColor="transparent"
                        contentBackgroundColor="transparent"
                        parallaxHeaderHeight={0.1}
                        renderForeground={() => (
                            <View/>
                        )}
                        scrollEvent={(event) => {
                            // this._scroll(event);
                        }}
                    >
                        {this.headImageView()}
                        {this.scrollImageView()}
                        {this.loadActivities()}
                        {this.renderRow()}
                    </ParallaxScrollView>
                </View>
            );
        } else {
            return (
                <Image source={{uri: 'scr_index'}} style={{
                    width: width,
                    height: width * 2.7,
                    marginTop: 0,
                    marginBottom: global.params.iPhoneXHeight
                }}/>
            );
        }
    }
}

var styles = StyleSheet.create({
    headImageStyle: {
        width: width - 26,
        height: width * 0.485,
        marginLeft: 13,
        marginTop: 15,
        marginBottom: 15,
        borderRadius: 3,
    },

    headScrollImageStyle: {
        width: 165,
        height: 101,
    },
    wrapper: {},
    middleImageStyle: {},
    teacherItemStyle: {
        width: 125,
        height: 156,
        marginLeft: 10,
        borderRadius: 4,
    },
    contentTitleStyle: {
        marginBottom: 8,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#414141'
    },
    contentDescStyle: {
        fontSize: 11,
        color: '#929292'
    }

});