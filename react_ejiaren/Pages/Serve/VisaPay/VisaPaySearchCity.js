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
    SectionList,

} from 'react-native'

import NavBar from '../../Componnet/NavBar'

var ServeApi = require('../ServeApi/ServeApi')
let {width} = Dimensions.get('window')
import { SearchBar } from 'react-native-elements'
import VisaFillCurrency from './VisaFillCurrency'
import VisaNoInfo from './VisaNoInfo'

export default class VisaPaySearchCity extends Component {
    constructor(props) {
        super(props)
        this.state = {
            topImageUrl: 'visa_headerimg',
            headTitle: 'STEP1 选择学校',
            sections: [],
        }
    }

    back() {
        this.props.navigator.pop();
    }

    componentWillMount() {
        let item = this.props.item;
        let headTitle = this.state.headTitle;
        if (item.id <= 752) {
            headTitle = 'STEP1 选择学校';
        }else if (item.id === 753 || item.id === 754 ) {
            headTitle = 'STEP1 选择国家';
        }else  {
            headTitle = 'STEP1 选择学校/国家';
        }

        this.setState({headTitle:headTitle})
    }

    componentDidMount() {
        // InteractionManager.runAfterInteractions(()=>
        //     this.getCityResults()
        // )
    }


    getCityResults(inputText){
        ServeApi.visaPaySearchCity(inputText).then(res=>{
            let countrys = res.countries;
            let schools = res.schools;
            countrys.push({countryid:0,name:'没有找到国家?',countryName:''});
            schools.push({countryid:0,name:'没有找到学校?'});
            
            let source = [];
            let item = this.props.item;
            if (item.id <= 752) {
                source.push({key:'学校',data:schools});
            }else if (item.id === 753 || item.id === 754 ) {
                source.push({key:'国家',data:countrys});
            }else  {
                source.push({key:'学校',data:schools});
                source.push({key:'国家',data:countrys});
            }
            this.setState({
                sections: source,
            })
        }).catch(error=>{
            console.log('error:  '+ error);
        })
    }


    didSelect(rowData) {
        
        let subObj = {};
        subObj['id'] = this.props.item.id;
        subObj['school'] = rowData.name;
        if (rowData.countryName){
            subObj['countryid'] = rowData.countryid;
        }else{
            subObj['countryid'] = rowData.id;
        }
        // console.log(rowData);
        console.log(subObj);
        
        if (subObj['countryid'] > 0){
            this.props.navigator.push({
                component: VisaFillCurrency,
                params: {item: subObj},
            })
        }else {
            console.log('没有学校');
            this.props.navigator.push({
                component: VisaNoInfo,
                params: {item: {id:subObj['id']}},
            })
        }
    }

    _extraUniqueKey(item ,index){
        return "index"+index+item;
    }

    _renderItem(info) {
        
        let itemname = info.item.name;
        if (info.item.countryName && info.item.countryName.length >0){
            itemname = info.item.countryName + '  ' + info.item.name;
        }
        
        return (
            <TouchableOpacity activeOpacity={0.7} style={styles.itemViewStyle} onPress={
                this.didSelect.bind(this,info.item)
            }>
                <Text style={styles.itemTextStyle}>{itemname}</Text>
                <Text style={styles.itemSubtextStyle}>{info.item.eng_name}</Text>
            </TouchableOpacity>
        )
    }

    _sectionComp(info) {
        return (
            <View style={styles.secitonViewStyle}>
                <Text
                    style={styles.sectionTextStyle}>{info.section.key}</Text>
            </View>
        )
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f5f5f5"}}>
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
                <View style={styles.headTitleStyle}>
                    <Text style={{marginLeft:14,fontSize:15,color:'black',fontWeight:'bold'}}>{this.state.headTitle}</Text>
                </View>
                <SearchBar
                    lightTheme
                    onChangeText={(text)=>{
                        this.getCityResults(text);
                    }}
                    onClearText={()=>{}}
                    icon={{ type: 'font-awesome', name: 'search' }}
                    placeholder='请输入学校名或国家'
                    inputStyle={{fontSize:14,color:'black'}}
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

const styles = StyleSheet.create({

    headTitleStyle:{
        height:46,
        backgroundColor:'white',
        justifyContent:'center',
    },
    itemViewStyle:{
        height:50,
        justifyContent:'center',
        borderBottomWidth:1,
        borderBottomColor:'#f5f5f5'
    },
    itemTextStyle:{
        color:'rgb(88,88,88)',
        fontSize:14,
        marginLeft:15,
    },
    itemSubtextStyle:{
        color:'rgb(177,177,177)',
        fontSize:11,
        marginLeft:15,
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

})