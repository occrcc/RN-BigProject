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

export default class FillPrice extends Component {
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

    }

    componentWillMount() {
        this.getSource();
    }



    getSource() {
        ServeApi.getFillPrice().then(res=>{

            console.log('补差价',res);
            this.setState({
                dataSource: res.length > 0 ? ds.cloneWithRows(res) : ds.cloneWithRows([]),
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
                        <Text style={{textAlign:'right',fontSize:16,color:global.params.backgroundColor}}>{rowData.currency}{rowData.price}</Text>
                        <Text style={{textAlign:'left',fontSize:11}}> </Text>
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
                    title='补差价'
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