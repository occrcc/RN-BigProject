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
} from 'react-native'

import SearchBar from 'react-native-searchbar'
import {ListItem} from 'react-native-elements'
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ChooseCity extends Component {
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

    componentWillMount() {
        this.setState({
            dataSource: ds.cloneWithRows(this.props.citys),
            searchSource:this.props.citys
        })
    }

    selectRowAndGoback(source){
        DeviceEventEmitter.emit('chooseCitys', source);
        DeviceEventEmitter.emit('ChooseAddressBack', source);
        this.props.navigator.pop();
    }


    searchBarText(text){
        console.log(text);
        var arr = this.state.searchSource;
        var newArr = [];
        for (var i = 0; i<arr.length; i++){
            let obj = arr[i];
            if (obj.cityname.indexOf(text) >= 0){
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

    renderRow(rowData) {
        return (
            <TouchableOpacity  onPress={this.selectRowAndGoback.bind(this,rowData)}>
                <ListItem
                    rightIcon={<View/>}
                    title={rowData.cityname}
                    subtitle={rowData.citysecondName}
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
                    placeholder='请输入城市名称'
                    handleChangeText={this.searchBarText.bind(this)}
                />
                <View style={{marginTop:70}}>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)}
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
