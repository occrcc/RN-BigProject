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
    Platform
} from 'react-native'


import {CachedImage} from 'react-native-img-cache';
var HomeServe = require('../HomeServers')
let {width, height} = Dimensions.get('window')
import storage from '../../RNAsyncStorage'
import Swiper from 'react-native-swiper';

import * as Animatable from 'react-native-animatable';
import ParallaxScrollView from 'react-native-parallax-scroll-view';

export default class Home289 extends Component {

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

    navBarView() {
        let navBarHeight = (Platform.OS === 'ios' ? 64 : 44) + global.params.iPhoneXHeight;
        return (
            <View style={{
                width: width,
                height: navBarHeight,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    width: width,
                    height: 44,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: global.params.backgroundColor,
                        fontSize: 14
                    }}>莘远国际教育</Text>
                </View>
            </View>
        )
    }


    renderItem() {
        // 数组
        var itemAry = [];
        // 颜色数组
        var colorAry = this.props.headImageArr;
        // 遍历
        for (var i = 0; i < colorAry.length; i++) {
            let obj = colorAry[i];
            itemAry.push(
                <TouchableOpacity key={i} activeOpacity={1} style={{flex: 1,}} onPress={() => {
                    DeviceEventEmitter.emit('didSelectHeadImage', obj);
                }}>
                    <CachedImage source={{uri: obj.bannerUrl}}
                                 style={styles.img}/>
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
                                 style={styles.activitieImageStyle} />
                </TouchableOpacity>
            );
        }
        return itemAry;
    }

    addMindListScroView(i){
        if (i === 0 && this.state.middleListAry.length > 0) {
            return (
                <View style={{backgroundColor: 'white', marginTop: 10, marginBottom: 10}}>

                    <View style={{marginTop: 16, flexDirection: 'row', backgroundColor: 'white', alignItems: 'center'}}>
                        <Text allowFontScaling={false}
                              style={{marginLeft: 15, fontSize: 15, fontWeight: 'bold'}}>留学好货</Text>
                    </View>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                        {this.state.middleListAry.map((item, i) => {
                            return (
                                <TouchableOpacity activeOpacity={0.9} key={i} style={{
                                    width: width / 4,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                                  onPress={() => {
                                                      DeviceEventEmitter.emit('homeDidSelectMiddleItem', item);
                                                  }}>
                                    <CachedImage source={{uri: item.iconUrl}}
                                                 style={{marginTop: 14, width: 50, height: 50, marginBottom: 8}}/>
                                    <View style={{width: width / 4, marginBottom: 14}}>
                                        <Text allowFontScaling={false} numberOfLines={1} style={{
                                            textAlign: 'center',
                                            lineHeight: 18,
                                            color: '#282828',
                                            fontSize: 14
                                        }}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>
            );
        }
    }


    headImageView() {
        if (this.props.headImageArr.length > 0) {
            return (
                <Swiper style={styles.wrapper} width={width} height={width * 0.485} autoplay
                        onMomentumScrollEnd={(e, state, context) => console.log('index:', state.index)}
                        dot={<View style={{
                            backgroundColor: 'rgba(222,222,222,1)',
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            marginLeft: 3,
                            marginRight: 3,
                            marginTop: 3,
                            marginBottom: 3,
                        }}/>}
                        activeDot={<View style={{
                            backgroundColor: global.params.backgroundColor,
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            marginLeft: 3,
                            marginRight: 3,
                            marginTop: 3,
                            marginBottom: 3
                        }}/>}
                        paginationStyle={{
                            bottom: 10, left: null, right: 15
                        }}
                        loop>
                    {this.renderItem()}
                </Swiper>
            )
        } else {
            return ( <CachedImage source={{uri: this.props.headImageUrl}} style={styles.headImageStyle}/>)
        }
    }


    renderRow() {
        let rowData = this.state.dataAry;
        return (
            <View>
                {
                    rowData.map((rowData,i)=>{
                        return (
                            <View key={i}>
                                <View style={{marginTop: i === 0 ? 0 : 8, flexDirection: 'row', backgroundColor: 'white', alignItems: 'center'}}>
                                    <Text allowFontScaling={false} style={{
                                        marginTop: 16,
                                        marginLeft: 15,
                                        fontSize: 15,
                                        fontWeight: 'bold'
                                    }}>{rowData.title}</Text>
                                </View>
                                {rowData.list.map((item, i) => {
                                    return (
                                        <TouchableOpacity key={i} activeOpacity={0.9}
                                                          style={{flexDirection: 'row', backgroundColor: 'white',}}
                                                          onPress={() => {
                                                              DeviceEventEmitter.emit('homeDidSelectRow', item);
                                                          }}>
                                            <CachedImage source={{uri: item.pic1}} style={{
                                                marginTop: 14,
                                                marginLeft: 14,
                                                width: 120,
                                                height: 73,
                                                marginBottom: 14
                                            }}/>
                                            <View style={{
                                                marginTop: 14,
                                                marginRight: 14,
                                                marginLeft: 14,
                                                width: width - 160,
                                                height: 73
                                            }}>
                                                <View style={{height: 55}}>
                                                    <Text allowFontScaling={false} numberOfLines={2}
                                                          style={{
                                                              color: '#282828', fontSize: 16
                                                          }}>{item.title}</Text>
                                                </View>
                                                <View style={{height: 18}}>
                                                    <Text allowFontScaling={false} numberOfLines={1} style={{
                                                        marginBottom: 0,
                                                        color: 'rgb(177,177,177)',
                                                        fontSize: 13
                                                    }}>{item.desc}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                                {this.addMindListScroView(i)}
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f5f5f5"}}>
                {this.navBarView()}
                {this.loadD()}

            </View>
        )
    }

    _scroll(event) {
        var scrollView = event.nativeEvent;

        if (Platform.OS === 'ios') {
            var y = parseFloat(scrollView.contentOffset.y) / 100;
            if (y <= 0) y = 0;
            let opacity = parseFloat(1 - y ).toFixed(2);
            if (opacity >= 1.0) {
                opacity = 1.0;
            } else if (opacity <= 0.0) {
                opacity = 0.0;
            }
            this.view.transitionTo({opacity: parseFloat(opacity)})
        }else {
            var y1 = scrollView.contentOffset.y;
            let showImg = true;
            if (y1 > 30) {
                showImg = false;
            } else {
                showImg = true;
            }
            this.setState({
                showHeadImg: showImg
            })
        }
    }

    handleViewRef = ref => this.view = ref;

    showHeadImage() {
        if (this.state.showHeadImg) {
            return (
                <Animatable.View ref={this.handleViewRef} style={{
                    position: 'absolute',
                    top: -48,
                    width: width,
                    height: 44,
                    // justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image source={{uri: 'home_nav_289',}}
                           style={{resizeMode: 'stretch', width: 105, height: 100,}}/>
                </Animatable.View>
            )
        }
    }

    loadHeadBtn() {
        return (
            <View style={{flexDirection: 'row'}}>
                {
                    this.topItems.map((item, i) => {
                        return (
                            <TouchableOpacity activeOpacity={0.8} key={i} style={styles.topBtnStyle}
                                              onPress={() => {
                                                  DeviceEventEmitter.emit('homeDidSelectTopItem', item);
                                              }}
                            >
                                <Image source={{uri: item[1]}}
                                       style={{height: 44, width: 44, resizeMode: 'stretch'}}/>
                                <View>
                                    <Text allowFontScaling={false}
                                          style={{
                                              textAlign: 'center',
                                              marginTop: 8,
                                              fontSize: 13,
                                              color: '#2a2a2a'
                                          }}>{item[0]}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }

    loadActivities() {
        if (this.props.activities.length > 0) {
            return (
                <Swiper style={styles.wrapper} width={width} height={width * 0.27} autoplay
                        onMomentumScrollEnd={(e, state, context) => console.log('index:', state.index)}
                        dot={<View style={{
                            backgroundColor: 'rgba(222,222,222,1)',
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            marginLeft: 3,
                            marginRight: 3,
                            marginTop: 3,
                            marginBottom: 3,
                        }}/>}
                        activeDot={<View style={{
                            backgroundColor: global.params.backgroundColor,
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            marginLeft: 3,
                            marginRight: 3,
                            marginTop: 3,
                            marginBottom: 3
                        }}/>}
                        paginationStyle={{
                            bottom: 10, left: null, right: 15
                        }}
                        loop>
                    {this.renderActivitieItem()}
                </Swiper>
            )
        }
    }

    loadFootView() {
        // return (
        //     <View style={styles.footViewStyle}>
        //         <Text style={{
        //             fontSize: 12,
        //             textAlign: 'center',
        //             lineHeight: 16,
        //             color: 'rgb(188,188,188)'
        //         }}>
        //             www.ayssen.com{'\n'}
        //             上海市静安区北京西路1701号静安中华大厦605室{'\n'}
        //             18501756508 18616776310
        //         </Text>
        //     </View>
        // )
    }

    loadD() {
        if (this.state.loaded) {
            let navBarHeight = (Platform.OS === 'ios' ? 64 : (44 + global.params.StatusBarHight)) + (global.params.iPhoneXHeight * 2) + 49;
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
                            this._scroll(event);
                        }}
                    >
                        {this.headImageView()}
                        {this.loadHeadBtn()}
                        {this.loadActivities()}
                        {this.renderRow()}
                        {this.loadFootView()}
                    </ParallaxScrollView>
                    {this.showHeadImage()}
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
    rowContainer: {
        flexDirection: 'row',
        height: 68,
        alignItems: 'center',
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        backgroundColor: 'rgba(255,255,255,0)',
    },

    headImgStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        resizeMode: 'stretch'
    },

    topBtnStyle: {
        width: width / 4,
        height: 80,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },

    cellTextAttributes: {
        fontSize: 19,
        color: '#333333',
        left: 30,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },

    separator: {
        height: 3,
        backgroundColor: '#000',
        marginLeft: 16
    },

    switchStyle: {
        marginRight: 30,
        alignItems: 'flex-end'
    },

    headImageStyle: {
        width: width,
        height: width * 0.485,
    },
    wrapper: {},

    img: {
        width: width,
        height: width * 0.485,
        resizeMode: Image.resizeMode.stretch,
    },

    activitieImageStyle: {
        width: width,
        height: width * 0.27,
        resizeMode: Image.resizeMode.stretch,
    },


    footViewStyle: {
        width: width,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    }
});