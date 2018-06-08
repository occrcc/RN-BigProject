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
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let {width} = Dimensions.get('window')
import storage from '../../RNAsyncStorage'
import Swiper from 'react-native-swiper';

export default class Home287 extends Component {
    constructor(props) {
        super(props)
        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: dataSource.cloneWithRows([]),
            middleListAry: [],
            userInfo: null,
            loaded: false,
        };
        this.topItems = [
            ['留学荟', 'icon_lxh', 93],
            ['留学申请', 'icon_lxsq', 0],
            ['特色服务', 'icon_tsfw', 94],
            ['行业培训', 'icon_hypx', 95],
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
        console.log('list:', newArr);
        newArr.unshift({});
        newArr.splice(2, 0, {});
        this.setState({
            dataSource: newArr.length > 0 ? ds.cloneWithRows(newArr) : ds.cloneWithRows([]),
        })
    }

    navBarView() {
        let navBarHeight = (Platform.OS === 'ios' ? 64 : 44) + global.params.iPhoneXHeight;
        return (
            <View style={{
                width: width,
                height: navBarHeight,
                backgroundColor: global.params.backgroundColor,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 20,
                shadowOffset: {width: 0, height: 0},
                shadowColor: 'black',
                shadowOpacity: 1,
                shadowRadius: 5,
            }}>
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    width: width,
                    height: 44,
                    justifyContent: 'center',
                    alignItems: 'center',

                }}>
                    <Image source={{uri: 'home_nav_287',}}
                           style={{resizeMode: 'stretch', width: width * 0.23, height: width * 0.23 * 0.28,}}/>
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
                    <Image source={{uri: obj.bannerUrl}}
                           style={styles.img} />
                </TouchableOpacity>
            );
        }
        return itemAry;
    }


    headImageView() {
        if (this.props.headImageArr.length > 0) {
            return (
                <Swiper style={styles.wrapper} width={width} height={width * 0.485}   autoplay
                        onMomentumScrollEnd={(e, state, context) => console.log('index:', state.index)}
                        dot={<View style={{backgroundColor:'rgba(222,222,222,1)', width: 8, height: 8,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
                        activeDot={<View style={{backgroundColor: global.params.backgroundColor, width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                        paginationStyle={{
                            bottom:  10, left: null, right: 15
                        }}
                        loop>
                    {this.renderItem()}
                </Swiper>
            )
        }else {
            return ( <CachedImage source={{uri: this.props.headImageUrl}} style={styles.headImageStyle} />)
        }
    }


    renderRow(rowData, sectionID, rowID) {
        if (rowID === '0') {
            return (
                <View>
                    {this.headImageView()}
                    <View style={{flexDirection: 'row'}}>
                        {
                            this.topItems.map((item, i) => {
                                return (
                                    <TouchableOpacity activeOpacity={0.8} key={i} style={styles.topBtnStyle}
                                                      onPress={()=>{
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
                </View>
            )
        } else if (rowID === '2') {
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

        return (
            <View>
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

    loadD() {
        if (this.state.loaded) {
            return (
                <ListView
                    style={{
                        marginTop: 0,
                        marginBottom: global.params.iPhoneXHeight
                    }}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    enableEmptySections={true}
                    removeClippedSubviews={false}
                />
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
    wrapper:{
    },

    img: {
        width: width,
        height: width * 0.485,
        resizeMode: Image.resizeMode.stretch,
    }
});