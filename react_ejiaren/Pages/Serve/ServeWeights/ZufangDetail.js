import React, {Component} from 'react'
import {
    View,
    ListView,
    StyleSheet,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    Image,
    ScrollView,
    Text,
    InteractionManager
} from 'react-native'

import Spinner from 'react-native-loading-spinner-overlay';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var ServeApi = require('../ServeApi/ServeApi')
import {CachedImage} from 'react-native-img-cache'
import ZufangMore from './ZufangHouseOtherMore'
import Zufangyy from './ZufangYuyue'

let {width} = Dimensions.get('window')
var ViewPager = require('react-native-viewpager');


import Alert from 'rnkit-alert-view';


var dataSource = new ViewPager.DataSource({
    pageHasChanged: (p1, p2) => p1 !== p2,
});
export default class ZufangDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: dataSource.cloneWithPages([]),
            currentPage: 0
        }
        this.yuyue_fun = this.yuyue_fun.bind(this);
    }

    backNav() {
        this.props.navigator.pop()
    }

    componentWillMount() {
        this.setState({
            dataSource: dataSource.cloneWithPages(this.props.houseDetail.headimglist)
        })
    }

    _renderPage(data, pageID) {
        return (
            <CachedImage
                source={{uri: data}}
                style={styles.page}/>
        );
    }

    timeView() {
        let distance = parseFloat(this.props.houseDetail.distance) * 1000;
        let list = [
            ['icon_qiche', parseInt(distance / 800) + ''],
            ['icon_danche', parseInt(distance / 280) + ''],
            ['icon_buxing', parseInt(distance / 90) + '']
        ];
        return (
            <View style={{flexDirection: 'row', marginBottom: 8}}>
                {list.map((item, i) => {
                    return (
                        <View key={i}
                              style={{marginRight: 14, flexDirection: 'row', alignItems: 'center', marginTop: 6}}>
                            <Image source={{uri: item[0]}} style={{width: 14, height: 14, marginRight: 4}}/>
                            <Text allowFontScaling={false} style={{color: '#acacac', fontSize: 11}}>{item[1]}分钟</Text>
                        </View>
                    )
                })}
            </View>
        )
    }

    headInfoView() {
        return (
            <View>
                <View style={styles.listBodyStyle}>
                    <Text allowFontScaling={false} style={{fontSize: 17, marginTop: 8, marginBottom: 4}}>{this.props.houseDetail.title}</Text>
                    <Text allowFontScaling={false} style={{
                        fontSize: 13,
                        color: '#acacac',
                        marginBottom: 4
                    }}>房源编号{this.props.houseDetail.sku}</Text>
                    <Text allowFontScaling={false} style={{fontSize: 13, color: '#acacac'}}>去往{this.props.houseDetail.schoolname}的时间:</Text>
                    {this.timeView()}
                    <Text allowFontScaling={false} style={{marginBottom: 8, fontSize: 11, color: '#acacac'}}>(以上数据仅供参考，以实际情况为准)</Text>
                </View>
            </View>
        )
    }

    houseListView() {

        var nearbyfacilities = this.props.houseDetail.nearbyfacilities;
        nearbyfacilities = nearbyfacilities.replace(/<br\/>/g, "\n");
        var facilities = this.props.houseDetail.facilities;

        return (
            <View>
                <View style={{height: 36, justifyContent: 'center', backgroundColor: 'rgb(244,244,244)'}}>
                    <Text allowFontScaling={false} style={{marginLeft: 14, fontSize: 14, color: 'black'}}>房间类型</Text>
                </View>
                {
                    this.props.houseDetail.rooms.map((item, i) => {
                        return (
                            <View key={i} style={[styles.listBodyStyle, {marginTop: 8}]}>
                                <View style={{flexDirection: 'row'}}>
                                    <CachedImage source={{uri: item.thumburl}}
                                                 style={{borderRadius: 4, width: 120, height: 80}}/>
                                    <View style={{marginLeft: 14, width: width - 160}}>
                                        <Text allowFontScaling={false} numberOfLines={2}
                                              style={{flex: 2, fontSize: 15, color: 'black'}}>{item.title}</Text>
                                        <Text allowFontScaling={false} numberOfLines={2} style={{
                                            flex: 2,
                                            fontSize: 13,
                                            color: 'rgb(188,188,188)'
                                        }}>{item.description}</Text>
                                        <Text allowFontScaling={false} style={{
                                            flex: 2,
                                            fontSize: 13,
                                            color: 'rgb(188,188,188)'
                                        }}>租期:{item.rent_time}{item.rentunit}</Text>
                                    </View>
                                </View>
                                <Text allowFontScaling={false}
                                    style={{margin: 8, marginLeft: 0, color: '#acacac', fontSize: 13}}>{item.sign}
                                    <Text allowFontScaling={false} style={{color: 'red', fontSize: 17}}>{item.amount}</Text> /{item.rentunit}</Text>
                            </View>
                        )
                    })
                }
                <View style={{flexDirection: 'row'}}>
                    {facilities.map((item, i) => {
                        if (facilities.length > 5 && i === 4) {
                            return (
                                <TouchableOpacity activeOpacity={0.8} key={i} style={{
                                    width: width / 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 80
                                }} onPress={()=>{
                                    this.props.navigator.push({
                                        component: ZufangMore,
                                        params: {houseMore: this.props.houseDetail.facilities},
                                    });
                                }}>
                                    <Text allowFontScaling={false} style={{
                                        textAlign: 'center',
                                        fontSize: 13,
                                        color: 'rgb(144,144,144)'
                                    }}>更多+</Text>
                                </TouchableOpacity>
                            )
                        } else {
                            return (
                                <View key={i} style={{
                                    width: width / 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 80
                                }}>
                                    <CachedImage source={{uri: item.url}} style={{width: 34, height: 34}}/>
                                    <Text allowFontScaling={false} style={{
                                        marginTop: 8,
                                        textAlign: 'center',
                                        fontSize: 13,
                                        color: 'rgb(144,144,144)'
                                    }}>{item.iconname}</Text>
                                </View>
                            )
                        }
                    })}
                </View>
                <View style={{height: 36, justifyContent: 'center', backgroundColor: 'rgb(244,244,244)'}}>
                    <Text allowFontScaling={false} style={{marginLeft: 14, fontSize: 14, color: 'black'}}>房源描述</Text>
                </View>
                <View style={{margin: 15}}>
                    <Text allowFontScaling={false} numberOfLines={0} style={{
                        letterSpacing: 1,
                        lineHeight: 18,
                        fontSize: 12,
                        color: 'rgb(122,122,122)'
                    }}>{this.props.houseDetail.about}</Text>
                </View>
                <View style={{height: 36, justifyContent: 'center', backgroundColor: 'rgb(244,244,244)'}}>
                    <Text allowFontScaling={false} style={{marginLeft: 14, fontSize: 14, color: 'black'}}>周边设施</Text>
                </View>
                <View style={{margin: 15}}>
                    <Text allowFontScaling={false} numberOfLines={0} style={{
                        letterSpacing: 1,
                        lineHeight: 18,
                        fontSize: 12,
                        color: 'rgb(122,122,122)'
                    }}>{nearbyfacilities}</Text>
                </View>
            </View>
        )
    }

    yuyue_fun(){
        this.props.navigator.push({
            component: Zufangyy,
            params: {houseTitle: this.props.houseDetail.title,dateStart:this.props.dateStart,dateEnd:this.props.dateEnd,sku:this.props.houseDetail.sku,schoolName:this.props.schoolName},
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
                <ScrollView >
                    <View style={styles.container}>
                        <ViewPager
                            style={{height: 220}}
                            dataSource={this.state.dataSource}
                            renderPage={this._renderPage}
                            isLoop={true}
                            autoPlay={true}
                        />
                    </View>
                    {this.headInfoView()}
                    {this.houseListView()}
                    <View style={{height:70}} />
                </ScrollView>
                <TouchableOpacity activeOpacity={0.8} style={styles.backButtonStyle} onPress={this.backNav.bind(this)}>
                    <Image source={{uri: 'icon_back_blue'}} style={{width: 24, height: 24}}/>
                </TouchableOpacity>
                <Spinner visible={this.state.visible} size={"small"}/>

                <TouchableOpacity activeOpacity={0.8} style={styles.footBtnStyle} onPress={this.yuyue_fun}>
                    <Text allowFontScaling={false} style={{fontSize:15,color:'white',fontWeight:'bold'}}>预约顾问</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 220,
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#999999',

    },
    page: {
        flex: 1,
        height: 220,
        resizeMode: 'stretch'
    },
    backButtonStyle: {
        position: 'absolute',
        left: 15, top: global.params.iPhoneXHeight + 20,
    },

    listBodyStyle: {
        marginLeft: 14,
        borderBottomColor: 'rgb(244,244,244)',
        borderBottomWidth: 1,
    },
    footBtnStyle:{
        position: 'absolute',
        bottom:global.params.iPhoneXHeight,
        left:0,
        right:0,
        height:50,
        backgroundColor:global.params.backgroundColor,
        justifyContent:'center',
        alignItems:'center'
    }
})