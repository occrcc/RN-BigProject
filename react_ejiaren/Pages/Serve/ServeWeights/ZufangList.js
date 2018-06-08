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
    InteractionManager,
    Linking
} from 'react-native'

//加载指示器
import Spinner from 'react-native-loading-spinner-overlay';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import NavBar from '../../Componnet/NavBar'

var ServeApi = require('../ServeApi/ServeApi')
import {CachedImage} from 'react-native-img-cache'

let {width} = Dimensions.get('window')
import ZufangDetail from './ZufangDetail'

export default class ZufangList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            headerArr: [],
            dataSource: ds.cloneWithRows([]),
        }
    }

    back() {
        this.props.navigator.pop();
    }


    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({dataSource: ds.cloneWithRows(this.props.sourceDic.list)});
        });

    }

    timeView(rowData) {
        let distance = parseFloat(rowData.distance) * 1000;
        let list = [
            ['icon_qiche', parseInt(distance / 800) + ''],
            ['icon_danche', parseInt(distance / 280) + ''],
            ['icon_buxing', parseInt(distance / 90) + '']
        ];
        return (
            <View style={{flexDirection: 'row', marginBottom: 8,}}>
                {list.map((item, i) => {
                    return (
                        <View key={i}
                              style={{marginRight: 14, flexDirection: 'row', alignItems: 'center', marginTop: 6}}>
                            <Image source={{uri: item[0]}} style={{width: 14, height: 14, marginRight: 4}}/>
                            <Text style={{color: '#acacac', fontSize: 11}}>{item[1]}分钟</Text>
                        </View>
                    )
                })}
            </View>
        )
    }

    didSelectRow(rowData) {
        this.setState({
            visible: true
        });
        ServeApi.zuFangDidSelectList(rowData.id, rowData.schoolid).then(res => {
            console.log(res);
            this.setState({
                visible: false
            }, () => {
                this.props.navigator.push({
                    component: ZufangDetail,
                    params: {houseDetail: res.data,dateStart:this.props.dateStart,dateEnd:this.props.dateEnd,schoolName:this.props.schoolName},
                });
            });
        }).catch(error => {
            console.log('error  ' + error);
            this.setState({
                visible: false
            });
        })
    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity key={rowID} activeOpacity={0.8} onPress={this.didSelectRow.bind(this, rowData)}>
                <View style={styles.cellViewStyle}>
                    <CachedImage source={{uri: rowData.thumburl}} style={styles.listImageStyle}/>
                    <Text style={[styles.tcStyle]}>参考价格：{rowData.sign}
                        <Text style={{fontSize:17}} >{rowData.price}</Text>
                    </Text>
                </View>
                <View style={styles.listBodyStyle}>
                    <Text style={{fontSize: 15, marginTop: 8, marginBottom: 4}}>{rowData.title}</Text>
                    {this.tag(rowData.housetag)}
                    <Text style={{fontSize: 13, color: '#acacac'}}>去往{rowData.schoolname}的时间:</Text>
                    {this.timeView(rowData)}
                </View>
            </TouchableOpacity>
        );
    }


    tag(houseTags){
        console.log(houseTags)
        if (houseTags && houseTags.length>0){
            return (
                <View style={{flex:1,flexDirection:'row'}}>
                    {
                        houseTags.map((item, i)=>{
                            return <Text key={i} style={{color:item.tag_color,marginRight:10,fontSize:12}}>{item.tagname}</Text>
                        })
                    }
                </View>
            );
        }

    }

    keFu() {
        let url = 'tel: ' + global.kefuInfo.kefuPhone;
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
            <View style={{flex: 1, backgroundColor: "white"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                <NavBar
                    title="房源信息"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                    rightIcon="icon_kefu"
                    rightPress={this.keFu.bind(this)}
                />

                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    enableEmptySections={true}
                />
                <Spinner visible={this.state.visible} size={"small"}/>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    cellViewStyle: {},
    listImageStyle: {
        width: width,
        height: width * 0.6,
    },
    listBodyStyle: {
        marginLeft: 14,
        borderBottomColor: '#acacac',
        borderBottomWidth: 0.5,
    },
    tcStyle:{
        position:"absolute",
        bottom:15,
        left:0,
        height:40,
        backgroundColor:'rgba(0, 0, 0, 0.70)',
        color:'white',
        padding:10,
        fontSize:12
    }

})