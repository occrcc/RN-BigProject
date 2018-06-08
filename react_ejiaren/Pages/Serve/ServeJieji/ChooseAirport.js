import React, {Component} from 'react'
import {
    View,
    SectionList,
    StyleSheet,
    Dimensions,
    Text,
    Image,
    StatusBar,
    TouchableOpacity,
    DeviceEventEmitter,
    InteractionManager

} from 'react-native'

var JiejiApi = require('./JiejiServe/JiejiApi')
let {width} = Dimensions.get('window')
import NavBar from '../../Componnet/NavBar'



export default class ChooseAirport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sections: [],
            userInfo:null,
        }
    }

    back() {
        this.props.navigator.pop()
    }

    back_emit(rowData) {
        DeviceEventEmitter.emit('chooseAirport', rowData);
        this.props.navigator.pop()
    }


    componentDidMount() {
        InteractionManager.runAfterInteractions(()=>{
            this.getSource();
        })
    }


    filterReplyInfo(arr, countryName) {
        return arr.filter((item) => {
            return item.countryName === countryName
        })
    }


    contains(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    }



    getSource() {

        var arr = Array.prototype.contains = function (needle) {
            for (let i in this) {
                if (this[i] === needle) return true;
            }
            return false;
        }

        JiejiApi.getJiejiAirports().then(res=>{
            var countryNames = [];
            var allData = [];
            for (let i = 0;i<res.length;i++){
                let item = res[i];
                if (this.contains(countryNames,item.countryName) === false){
                    countryNames.push(item.countryName);
                }
            }

            for (let i = 0;i < countryNames.length;i++){
                let keys = countryNames[i];
                let valeu = this.filterReplyInfo(res,keys);
                let data = {};
                data['key'] = keys;
                data['data'] = valeu;
                allData.push(data);
            }
            this.setState({
                sections: allData
            })
            console.log(allData);

        }).catch(err=>{

        })
    }

    _sectionComp(info) {
        return (
            <View style={styles.secitonViewStyle}>
                <Text
                    style={styles.sectionTextStyle}>{info.section.key}</Text>
            </View>
        )
    }

    _renderItem(info) {
        return (
            <TouchableOpacity activeOpacity={0.7} style={styles.itemViewStyle} onPress={
                this.back_emit.bind(this,info.item)
            }>
                <Text style={styles.itemTextStyle}>{info.item.airport}</Text>
            </TouchableOpacity>
        )
    }

    _extraUniqueKey(item ,index){
        return "index"+index+item;
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                    backgroundColor={global.params.backgroundColor}
                />
                <NavBar
                    title='选择机场'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <SectionList
                    renderSectionHeader={this._sectionComp}
                    renderItem={this._renderItem.bind(this)}
                    sections={this.state.sections}
                    keyExtractor = {this._extraUniqueKey} // 每个item的key
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
    },
    itemViewStyle:{
        height:50,
        justifyContent:'center',
        borderBottomWidth:1,
        borderBottomColor:'#f5f5f5'
    },
    secitonViewStyle:{
        height:36,
        justifyContent:'center',
        backgroundColor:'rgb(244,244,244)',
    },
    sectionTextStyle:{
        color:global.params.backgroundColor,
        fontSize:16,
        fontWeight:'bold',
        marginLeft:15,
        marginTop:3
    },
    itemTextStyle:{
        color:'rgb(88,88,88)',
        fontSize:14,
        marginLeft:15,
    },
});