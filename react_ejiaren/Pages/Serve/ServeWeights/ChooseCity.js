import React, {Component} from 'react'
import {
    View,
    StatusBar,
    StyleSheet,
    Text,
    SectionList,
    TouchableOpacity,
    DeviceEventEmitter,
    InteractionManager
} from 'react-native'

import NavBar from '../../Componnet/NavBar'

var ServeApi = require('../ServeApi/ServeApi')
import Spinner from 'react-native-loading-spinner-overlay';
import {SearchBar} from 'react-native-elements'
import JiejiError from '../ServeJieji/JiejiError'

export default class ChooseCity extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sections: [],
            visible: false
        }
    }

    componentWillMount() {
        this.setState({
            visible: true
        });
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.getSource();
        });
    }

    getSource(searchKey) {
        ServeApi.getCityList(searchKey).then(res => {
            // console.log(res.data);

            let section = [];
            if (res.data.city.length > 0) {
                section.push({
                    key: "城市", data: res.data.city.filter(item => {
                        return item.despname !== null ;
                    })
                });
            }

            res.data.school.push({despname: '没有找到学校或城市？【点我继续】', rid: '999999'})
            if (res.data.school.length > 0) {
                section.push({key: "学校", data: res.data.school});
            }

            this.setState({
                visible: false,
                sections: section
            })
        }).catch(err => {
            this.setState({
                visible: false
            });
            console.log('err  ' + err);
        })
    }


    back() {
        this.props.navigator.pop()
    }

    back_emit(rowData) {

        if (rowData.rid === '999999') {
            this.props.navigator.push({
                component: JiejiError,
            });
        } else {
            DeviceEventEmitter.emit('zufang_one', rowData);
            this.props.navigator.pop()
        }
    }


    _extraUniqueKey(item, index) {
        return "index" + index + item;
    }

    _renderItem(info) {
        return (
            <TouchableOpacity activeOpacity={0.7} style={styles.itemViewStyle} onPress={
                this.back_emit.bind(this, info.item)
            }>
                <Text style={styles.itemTextStyle}>{info.item.despname}</Text>
                {this.despaname(info.item.despname_en)}
            </TouchableOpacity>
        )
    }

    despaname(desname) {
        if (desname) {
            return (
                <Text style={styles.itemSubtextStyle}>{desname}</Text>
            )
        } else {
            return (<View/>)
        }
    }

    _sectionComp(info) {
        return (
            <View style={styles.secitonViewStyle}>
                <Text
                    style={styles.sectionTextStyle}>{info.section.key}</Text>
            </View>
        )
    }

    getCityResults(inputText) {
        this.getSource(inputText);
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
                    title=''
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />

                <SearchBar
                    lightTheme
                    onChangeText={(text) => {
                        this.getCityResults(text);
                    }}
                    onClearText={() => {
                    }}
                    icon={{type: 'font-awesome', name: 'search'}}
                    placeholder='请输入国家或城市名'
                    inputStyle={{fontSize: 14, color: 'black'}}
                />

                <SectionList
                    renderSectionHeader={this._sectionComp}
                    renderItem={this._renderItem.bind(this)}
                    sections={this.state.sections}
                    keyExtractor={this._extraUniqueKey} // 每个item的key
                />
                <Spinner visible={this.state.visible} size={"small"}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    itemViewStyle: {
        height: 50,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5'
    },
    itemTextStyle: {
        color: 'rgb(88,88,88)',
        fontSize: 14,
        marginLeft: 15,
    },
    itemSubtextStyle: {
        color: 'rgb(177,177,177)',
        fontSize: 11,
        marginLeft: 15,
    },
    secitonViewStyle: {
        height: 36,
        justifyContent: 'center',
        backgroundColor: 'rgb(244,244,244)',
    },
    sectionTextStyle: {
        color: global.params.backgroundColor,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 15,
        marginTop: 3
    },
});