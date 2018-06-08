import React, {Component} from 'react'
import {
    View,
    ListView,
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
let {width} = Dimensions.get('window')
import storage from '../../RNAsyncStorage'
import Swiper from 'react-native-swiper';

export default class Home286 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            middleListAry: [],
            userInfo: null,
            loaded: false
        };
        this.topItems = [
            ['留学申请', 'Application for study abroad', 'icon_shenqing'],
            ['GPA计算', 'GPA Calculation', 'icon_gap'],
            ['语言测评', 'Languagen Assessment', 'icon_language'],
            ['背景提升', 'Background Lifting', 'icon_lift'],
        ];
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
            console.log('未检查到用户 ' + err)
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
            dataSource: newArr.length > 0 ? newArr : [],
        })
    }

    headView(){
        if (this.props.headImageUrl.length > 0) {
            return (
                <View style={styles.fistRowStyle1}>
                    <CachedImage source={{uri: this.props.headImageUrl}} style={styles.headImageStyle}/>
                    {
                        this.topItems.map((item, i) => {
                            return (
                                <TouchableOpacity activeOpacity={0.8} key={i} style={styles.topBtnStyle}
                                                  onPress={() => {
                                                      DeviceEventEmitter.emit('homeDidSelectTopItem', item);
                                                  }}
                                >
                                    <Image source={{uri: item[2]}}
                                           style={{marginLeft: 12, height: 22, width: 22, resizeMode: 'contain'}}/>
                                    <View style={{marginLeft: 12, width: (width - 45) / 2 - 50,}}>
                                        <Text allowFontScaling={false}
                                              style={{fontSize: 13, color: '#2a2a2a'}}>{item[0]}</Text>
                                        <Text allowFontScaling={false} numberOfLines={2} style={{
                                            marginTop: 2,
                                            fontSize: 11,
                                            color: '#cacaca'
                                        }}>{item[1]}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            );
        } else {
            return (
                <View style={styles.fistRowStyle}>
                    {
                        this.topItems.map((item, i) => {
                            return (
                                <TouchableOpacity activeOpacity={0.8} key={i} style={styles.topBtnStyle}
                                                  onPress={() => {
                                                      DeviceEventEmitter.emit('homeDidSelectTopItem', item);
                                                  }}
                                >
                                    <Image source={{uri: item[2]}}
                                           style={{marginLeft: 12, height: 22, width: 22, resizeMode: 'contain'}}/>
                                    <View style={{marginLeft: 12, width: (width - 45) / 2 - 50,}}>
                                        <Text allowFontScaling={false}
                                              style={{fontSize: 13, color: '#2a2a2a'}}>{item[0]}</Text>
                                        <Text allowFontScaling={false} numberOfLines={2} style={{
                                            marginTop: 2,
                                            fontSize: 11,
                                            color: '#cacaca'
                                        }}>{item[1]}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            );
        }
    }

    mindView(i){
       if (i === 0) {
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

    renderRow() {
        return (
            <View>
                {this.state.dataSource.map((rowData,i)=>{
                    return (
                        <View key={i}>
                            <View style={{marginTop: 8, flexDirection: 'row', backgroundColor: 'white', alignItems: 'center'}}>
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
                                                      style={{color: '#282828', fontSize: 16}}>{item.title}</Text>
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
                            {this.mindView(i)}
                        </View>

                    )
                })}
            </View>
        )
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f5f5f5"}}>
                {this.loadD()}
                {/*<ListView*/}
                {/*style={{marginTop: 44 + global.params.iPhoneXHeight ,marginBottom:global.params.iPhoneXHeight}}*/}
                {/*dataSource={this.state.dataSource}*/}
                {/*renderRow={this.renderRow.bind(this)}*/}
                {/*enableEmptySections={true}*/}
                {/*/>*/}
                {/*<Image source={{uri: 'scr_index'}} style={{width:width,height:width*2.7,marginTop: 80 + global.params.iPhoneXHeight ,marginBottom:global.params.iPhoneXHeight}}/>*/}
                <Image source={{uri: 'nav_top_286'}}
                       style={[styles.headImgStyle, {height: 78 + global.params.iPhoneXHeight}]}/>
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

    loadD() {
        if (this.state.loaded) {
            return (
                <ScrollView
                    style={{
                        marginTop: (this.props.headImageUrl.length > 0 ? 0 : 44) + global.params.iPhoneXHeight,
                        marginBottom: global.params.iPhoneXHeight
                    }}
                    // dataSource={this.state.dataSource}
                    // renderRow={this.renderRow.bind(this)}
                    // enableEmptySections={true}
                >
                    {this.headView()}
                    {this.loadActivities()}

                    {this.renderRow()}
                </ScrollView>
            );
        } else {
            return (
                <Image source={{uri: 'scr_index'}} style={{
                    width: width,
                    height: width * 2.7,
                    marginTop: 80 + global.params.iPhoneXHeight,
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

    fistRowStyle: {
        marginTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        // borderBottomColor: '#E0E0E0',
        // borderBottomWidth: 1,
        flexWrap: 'wrap',
    },

    fistRowStyle1: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        // borderBottomColor: '#E0E0E0',
        // borderBottomWidth: 1,
        flexWrap: 'wrap',
    },

    headImgStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        resizeMode: 'stretch'
    },

    topBtnStyle: {
        width: (width - 45) / 2,
        height: 60,
        borderRadius: 4,
        backgroundColor: 'white',
        marginLeft: 15,
        marginBottom: 10,
        flexDirection: 'row',
        //justifyContent:'space-between',
        alignItems: 'center'
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
        marginBottom: 20
    },
    wrapper: {},
    activitieImageStyle: {
        width: width,
        height: width * 0.27,
        resizeMode: Image.resizeMode.stretch,
    },
});