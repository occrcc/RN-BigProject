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

} from 'react-native'

import NavBar from '../../Componnet/NavBar'

let {width} = Dimensions.get('window')
import SearchCity from './VisaPaySearchCity'
import VisaHtml from './VisaHtml'
import Alert from 'rnkit-alert-view';

export default class VisaPay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            topImageUrl: 'visa_headerimg',
            title: 'VISA支付',
        }

        this.listSectionItem = [
            {
                title: '付费类型',
                items: [
                    {iconUrl: 'visa_zhengke', name: '正课押金', id: 747},
                    {iconUrl: 'visa_yuyan', name: '语言课押金', id: 748},
                    {iconUrl: 'visa_xuefei', name: '语言课学费', id: 749},
                    {iconUrl: 'visa_zhusuya', name: '住宿费押金', id: 751},
                    {iconUrl: 'visa_zhusu', name: '住宿费', id: 752},
                    {iconUrl: 'visa_qianzheng', name: '签证费', id: 753},
                    {iconUrl: 'visa_yiliao', name: '医疗附加费', id: 754},
                    {iconUrl: 'visa_qita', name: '其它', id: 755},
                ]
            }
        ]

    }

    componentWillMount() {
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            if (this.props.item.alertMessage.length > 0) {
                setTimeout(()=>this.showAlertTips(),1500);
            }
        });
    }

    showAlertTips() {
        Alert.alert(
            '提示', this.props.item.alertMessage, [
                {text: '知道了' },
            ],
        );
    }

    componentWillUnmount() {
    }


    selectItem(item) {
        console.log(item);
        this.props.navigator.push({
            component: SearchCity,
            params: {item: item, userInfo: this.props.userInfo},
        })
    }

    back() {
        this.props.navigator.pop();
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
                    title='VISA支付'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <ScrollView style={{backgroundColor: '#f5f5f5'}}>
                    <TouchableOpacity activeOpacity={1} onPress={()=>{
                        this.props.navigator.push({
                            component: VisaHtml,
                        })}}
                    >
                        <Image source={{uri: this.state.topImageUrl}} style={styles.headerImgStyle}/>
                    </TouchableOpacity>
                    <View>
                        {
                            this.listSectionItem.map((sectionItem, i) => {
                                return (
                                    <View key={i} style={styles.sectionViewStyle}>
                                        <Text allowFontScaling={false} style={styles.sectionTitleStyle}>{sectionItem.title}</Text>
                                        <View style={styles.contentItemsStyle}>
                                            {
                                                sectionItem.items.map((item, i) => {
                                                    return (
                                                        <TouchableOpacity key={i} activeOpacity={0.8}
                                                                          style={styles.mainListItemStyle}
                                                                          onPress={this.selectItem.bind(this, item)}
                                                        >
                                                            <Image source={{uri: item.iconUrl}}
                                                                   style={styles.mainListImageStyle}/>
                                                            <Text allowFontScaling={false}
                                                                style={styles.mainListTitleStyle}>{item.name}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </ScrollView>
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
        backgroundColor: 'white',
    },

    contentItemsStyle: {
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
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
        width: 42,
        height: 42,
        resizeMode: 'stretch'

    },
    mainListTitleStyle: {
        marginTop: 8,
        color: '#4a4a4a',
        fontSize: 13,
    }

})