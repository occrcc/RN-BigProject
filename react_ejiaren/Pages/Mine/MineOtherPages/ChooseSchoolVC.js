/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */


'use strict';

import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    ListView,
    TouchableOpacity,
    DeviceEventEmitter,
    InteractionManager,
    Platform
} from 'react-native'

import SearchBar from 'react-native-searchbar'
import {List, ListItem} from 'react-native-elements'
var UserInfoServes = require('../Servers/UserInfoServes')
import ServeUnionDemand from '../../Serve/ServeUnionPay/ServeUnionDemand'
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ChooseSchoolVC extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataSource: ds.cloneWithRows([

            ]),
            searchSource:[]
        };
    }

    back() {
        this.props.navigator.pop();

    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(()=>{
            this.loadSchool();
        });

    }

    async loadSchool() {

        if (this.props.country_id ){
            UserInfoServes.getSchools(this.props.country_id).then(rep => {
                this.setState({
                    dataSource: ds.cloneWithRows(rep),
                    searchSource:rep
                })
            }).catch(err => {
                console.log(err);
            })
        }else  {
            UserInfoServes.getSchools().then(rep => {
                this.setState({
                    dataSource: ds.cloneWithRows(rep),
                    searchSource:rep
                })
            }).catch(err => {
                console.log(err);
            })
        }
    }

    selectRowAndGoback(source){
        
        if (source.id === '9999999'){
            console.log(source);
            
            this.props.navigator.push({
                component: ServeUnionDemand,
            })
            
            
        }else {
            this.props.navigator.pop();
            DeviceEventEmitter.emit('chooseSchool', source); 
        }
    }


    searchBarText(text){
        console.log(text);
        var arr = this.state.searchSource;
        var newArr = [];
        for (var i = 0; i<arr.length; i++){
            let obj = arr[i];
            if (obj.name.indexOf(text) >= 0){
                newArr.push(obj);
            }
        }

        let sourceAry = arr;
        if(text.length > 0 && newArr.length < 1) {
            sourceAry = [];
        }

        if (newArr.length < 1 && this.props.isUniopay){
            newArr.push({name:'没有找到学校？',eng_name:'No school',id:'9999999'});
        }
        

        this.setState({
            dataSource: newArr.length > 0 ? ds.cloneWithRows(newArr) : ds.cloneWithRows(sourceAry),
        })
    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity  onPress={this.selectRowAndGoback.bind(this,rowData)}>
                <ListItem
                    rightIcon={ <View/> }
                    title={rowData.name}
                    subtitle={rowData.eng_name}
                    containerStyle={styles.containerStyle}
                    titleStyle={styles.titleStyle}
                    subtitleStyle={styles.subtitleStyle}
                />
            </TouchableOpacity>
        )
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <SearchBar
                    data={this.state.searchSource}
                    fontSize={15}
                    showOnLoad
                    onBack={this.back.bind(this)}
                    placeholder='请输入学校名称'
                    handleChangeText={this.searchBarText.bind(this)}
                />
                <View style={{marginTop:70}}>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)}
                        enableEmptySections={true}
                    />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    containerStyle:{
        height:50
    },
    titleStyle:{
        fontSize:global.params.CellTitleFontSize,
    },
    subtitleStyle:{
        fontSize:global.params.CellRightTitleFontSize,
    }
})
