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
    Text,
    StatusBar,
    InteractionManager
} from 'react-native'

import NavBar from '../../Componnet/NavBar'
import {ListItem} from 'react-native-elements'

var UserInfoServes = require('../Servers/UserInfoServes')

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ChooseCity extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: ds.cloneWithRows([]),
        };
    }

    back() {
        this.props.navigator.pop();

    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.getMyWalletDetailList();
        });
    }

    getMyWalletDetailList() {
        UserInfoServes.getMyWalletDetailList(this.props.userInfo.token).then((res) => {
            this.setState({
                dataSource: ds.cloneWithRows(res),
            })
        }).catch(error => {

        })
    }


    renderRow(rowData) {

        let amount = parseFloat(rowData.amount);

        return (
            <ListItem
                rightIcon={<View >
                    <Text style={{
                        color: amount > 0 ? 'rgb(22, 160, 93)' : 'rgb(216, 12, 11)',
                        marginTop:8
                    }}>
                        {rowData.amount.toFixed(2)}
                    </Text>
                </View>}
                title={rowData.desc}
                subtitle={rowData.createtimeFormat}
                containerStyle={styles.containerStyle}
                titleStyle={styles.titleStyle}
                subtitleStyle={styles.subtitleStyle}
            />
        )
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />

                <NavBar
                    title="钱包明细"
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


const styles = StyleSheet.create({
    containerStyle: {
        height: 50
    },

    titleStyle: {
        fontSize: global.params.CellTitleFontSize,
    },

    subtitleStyle: {
        fontSize: global.params.CellRightTitleFontSize,
        fontStyle:'normal',
        fontWeight:'normal',
    }
})
