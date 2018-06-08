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
import ChooseCity from './ChooseCity'
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ChooseAddress extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataSource: ds.cloneWithRows([]),
            searchSource:[]
        };
    }

    back() {
        this.props.navigator.pop();

    }

    componentDidMount() {
        this.ChooseAddressBack = DeviceEventEmitter.addListener('ChooseAddressBack', () => {
            this.props.navigator.pop();
        });
    }

    componentWillUnmount() {
        this.ChooseAddressBack.remove();
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(()=>{
            this.loadAllCitys();
        });

    }

    async loadAllCitys() {
        UserInfoServes.getAllAddress().then(rep => {
            this.setState({
                dataSource: ds.cloneWithRows(rep.res),
                searchSource:rep.res
            })
        }).catch(err => {
            console.log('error:    ' + err);
        })
    }

    selectRowAndGoback(source){
        if (source.citys.length < 1){
            this.props.navigator.pop();
            DeviceEventEmitter.emit('chooseCitys', source);
        }else  {
            this.props.navigator.push({
                component: ChooseCity,
                params: {citys:source.citys},
            })
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

        this.setState({
            dataSource: newArr.length > 0 ? ds.cloneWithRows(newArr) : ds.cloneWithRows(sourceAry),
        })
    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity  onPress={this.selectRowAndGoback.bind(this,rowData)}>
                <ListItem
                    rightIcon={ rowData.citys.length < 1 ? <View/> : {name: 'chevron-right'} }
                    title={rowData.name}
                    subtitle={rowData.secondName}
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
                    placeholder='请输入国家名称'
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
