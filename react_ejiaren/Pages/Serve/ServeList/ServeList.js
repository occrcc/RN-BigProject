import React, {Component} from 'react'
import {
    View,
    ListView,
    StyleSheet,
    Dimensions,
    Text,
    Image,
    StatusBar,
    TouchableOpacity,
    InteractionManager

} from 'react-native'

var ServeApi = require('../ServeApi/ServeApi')
let {width} = Dimensions.get('window')
import NavBar from '../../Componnet/NavBar'
import {CachedImage} from 'react-native-img-cache'
import ServeHtml from '../ServeHtml/ServeHtml'
import Alert from 'rnkit-alert-view';

var ds = new ListView.DataSource(
    {rowHasChanged: (r1, r2) => r1 !== r2});

export default class ServeList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: ds.cloneWithRows([]),
            userInfo:null,
        }
    }

    back() {
        this.props.navigator.pop()
    }

    pushView(name,item){
        item.param = item.id;
        this.props.navigator.push({
            component: name,
            params: {item:item},
        })
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



    componentWillMount() {
        this.getSource();
    }



    getSource() {
        ServeApi.getServeListData(this.props.item.param).then(res=>{
            this.setState({
                dataSource: res.list.length > 0 ? ds.cloneWithRows(res.list) : ds.cloneWithRows([]),
            })
        }).catch(err=>{
        })
    }


    renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity activeOpacity={0.8} style={styles.rowContainer} onPress={()=>{
                this.pushView(ServeHtml,rowData);
            }}>
                <CachedImage source={{uri:rowData.thumb_pic}} style={styles.rowImageStyle}/>
                <View style={styles.contentTextStyle}>
                    <Text numberOfLines={1} style={{
                        fontSize:12,
                        color:'#343434',
                        marginBottom:3,
                        marginTop:10,
                    }}>{rowData.title}</Text>
                    <Text numberOfLines={2} style={{
                        marginTop:3,
                        fontSize:11,
                        color:'#727272',
                        letterSpacing:1,
                        marginBottom:10,
                    }}>{rowData.desc}</Text>
                    <View style={styles.priceViewStyle}>
                        <Text style={{textAlign:'right',fontSize:16,color:global.params.backgroundColor}}>{rowData.currency}{rowData.rmbPrice}</Text>
                        <Text style={{textAlign:'left',fontSize:11}}>/起</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}} >

                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                    backgroundColor={global.params.backgroundColor}
                />

                <NavBar
                    title={this.props.item.name}
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />

                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    enableEmptySections={true}
                />
            </View>
        )
    }
}

var styles = StyleSheet.create({

    rowContainer: {
        flexDirection: 'row',
        height: 100,
        alignItems: 'center',
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        backgroundColor: 'rgba(255,255,255,0)',
    },

    rowImageStyle:{
        width:120,
        height:80,
        margin:10,
        borderRadius:4
    },

    contentTextStyle:{
        width:width - 150,
    },

    priceViewStyle:{
        height:22,
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center'
    }
});