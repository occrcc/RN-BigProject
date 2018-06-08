import React, {Component} from 'react'
import {
    View,
    ListView,
    StyleSheet,
    Dimensions,
    Text,
    StatusBar,
    TouchableOpacity,
    DeviceEventEmitter

} from 'react-native'


import NavBar from '../../Componnet/NavBar'

var ds = new ListView.DataSource(
    {rowHasChanged: (r1, r2) => r1 !== r2});

export default class ChooseCountries_kuaidi extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: ds.cloneWithRows([]),
        }
    }

    back() {
        this.props.navigator.pop();
    }


    componentWillMount() {
        this.setState({dataSource:ds.cloneWithRows(this.props.items)})
    }

    renderRow(rowData, rowID) {
        return (
            <TouchableOpacity key={rowID} activeOpacity={0.8} style={styles.rowContainer} onPress={()=>{
                DeviceEventEmitter.emit('choose_kuaidi',rowData);
                this.props.navigator.pop();
            }}>
                <Text style={{marginLeft:14,fontSize: 15,
                    color: '#2a2a2a',}}>{rowData.value}</Text>
                <Text style={{marginRight:14,color: global.params.backgroundColor,fontSize:14,textAlign: 'right'}}>{rowData.notes}</Text>
            </TouchableOpacity>
        );
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
                    title='选择国家'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                />
            </View>
        )
    }
}

var styles = StyleSheet.create({

    rowContainer: {
        flexDirection: 'row',
        height: 44,
        alignItems: 'center',
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent:'space-between'
    },
});