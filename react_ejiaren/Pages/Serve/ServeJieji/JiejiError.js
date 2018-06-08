import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    Image,
    StatusBar,
    TouchableOpacity,
    Linking
} from 'react-native'

let {width} = Dimensions.get('window')
import NavBar from '../../Componnet/NavBar'
import ZufangDemand from './ZufangDemand'


export default class JiejiError extends Component {
    constructor(props) {
        super(props)
    }

    back() {
        this.props.navigator.pop()
    }

    keFu() {

        let url = 'tel: ' + global.kefuInfo.kefuPhone;
        console.log('kefu'+url)
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "rgb(245,245,245)"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                    backgroundColor={global.params.backgroundColor}
                />
                <NavBar
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <View style={styles.headViewStyle}>
                    <Image source={{uri: this.props.isOk ? 'icon_ok' : 'icon_dingwei'}} style={styles.headIconStyle}/>
                    <Text style={styles.titleStyle}>没有找到你要的城市或学校</Text>
                    <Text style={styles.contentStyle}>没关系，我们已为你准备了如下方案</Text>
                </View>

                <View style={styles.kefuViewStyle}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.kefuInfoViewStyle} onPress={()=>{
                        this.props.navigator.push({
                            component: ZufangDemand,
                            params:{startDate:this.props.startDate,endDate:this.props.endDate}
                        })
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Image source={{uri: 'icon_zufangxuqiu'}} style={styles.leftImageStyle}/>
                            <View style={styles.textViewStyle}>
                                <Text style={{fontSize: 15, marginBottom: 8}}>直接提交租房需求</Text>
                                <Text numberOfLines={0} style={{fontSize: 13, color: 'rgb(166,166,166)'}}>提交租房需求，客服会为您寻找合适的房源，在1-2个工作日内与您联系。</Text>
                            </View>
                            <Image source={{uri: 'right_go'}} style={styles.rightRowStyle}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.kefuInfoViewStyle} onPress={this.keFu.bind(this)}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
                              >
                            <Image source={{uri: 'icon_phone'}} style={styles.leftImageStyle}/>
                            <View style={styles.textViewStyle}>
                                <Text style={{fontSize: 15, marginBottom: 8}}>直接电话与客服沟通</Text>
                                <Text numberOfLines={0} style={{fontSize: 13, color: 'rgb(166,166,166)'}}>找客服说一说你的需求：021-61984772</Text>
                            </View>
                            <Image source={{uri: 'right_go'}} style={styles.rightRowStyle}/>
                        </View>
                    </TouchableOpacity>
                    {/*<TouchableOpacity activeOpacity={0.8} style={styles.kefuInfoViewStyle}>*/}
                        {/*<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>*/}
                            {/*<Image source={{uri: 'icon_zaixian'}} style={styles.leftImageStyle}/>*/}
                            {/*<View style={styles.textViewStyle}>*/}
                                {/*<Text style={{fontSize: 15, marginBottom: 8}}>直接在线与客服沟通</Text>*/}
                                {/*<Text numberOfLines={0}*/}
                                      {/*style={{fontSize: 13, color: 'rgb(166,166,166)'}}>在线与客服沟通说明要求。</Text>*/}
                            {/*</View>*/}
                            {/*<Image source={{uri: 'right_go'}} style={styles.rightRowStyle}/>*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    headViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    headIconStyle: {
        width: 100,
        height: 80,
        marginTop: 30,
        marginBottom: 28,
        resizeMode: 'stretch'
    },
    titleStyle: {
        fontSize: 15,
        color: '#b2b2b2',
        marginBottom: 5,

    },
    contentStyle: {
        fontSize: 13,
        color: '#969696',
        marginBottom: 18,
        marginRight: 15,
        marginLeft: 15,
    },
    kefuViewStyle: {
        backgroundColor: 'white',
        marginLeft: 14,
        marginRight: 14,
        borderRadius: 4
    },
    kefuInfoViewStyle: {
        borderBottomWidth: 0.5,
        borderColor: 'rgb(222,222,222)',
        flexDirection: 'row',
    },
    leftImageStyle: {
        marginTop: 23,
        marginRight: 15,
        marginLeft: 15,
        width: 48,
        height: 48,
        borderRadius: 24,
        marginBottom: 23,
    },

    textViewStyle: {
        width: width - 135,
    },

    phoneBtnStyle: {
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 23,
        borderRadius: 4,
        height: 44,
        backgroundColor: global.params.backgroundColor,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightRowStyle: {
        width: 8,
        height: 14,
        marginLeft: 8,
        marginRight: 8,
    },
});