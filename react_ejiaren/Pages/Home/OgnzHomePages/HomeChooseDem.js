import React, {Component} from 'react'
import {
    View,
    Dimensions,
    StatusBar,
    ScrollView,
    Text,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native'


import NavBar from '../../Componnet/NavBar'
var HomeServe = require('../HomeServers')

let {width, height} = Dimensions.get('window')
var section1Data = [''];
var selectedValue = [['']];

export default class HomeChooseDem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectRow: 0,

            selectedValue: selectedValue[0],
            leftValue: section1Data[0],
            rightValue: selectedValue[0][0],
        }
    }

    componentWillMount() {
        HomeServe.getSubmitZixun(true).then(res => {
            section1Data = [];
            selectedValue = [];
            for (let i = 0; i<res.length; i++){
                let obj = res[i];
                section1Data.push(obj.name);
                selectedValue.push(obj.dict);
            }
            this.setState({
                selectedValue: selectedValue[0],
                leftValue: section1Data[0],
                rightValue: selectedValue[0][0],
            })

        }).catch(error => {
            console.log('error:  ' + error);
        })
    }

    back() {
        this.props.navigator.pop();
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
                    title='类目选择'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <View style={{flexDirection: 'row'}}>
                    <ScrollView style={{
                        width: width * 0.4,
                        backgroundColor: '#F4F4F4',
                        height: height - 44 - global.params.iPhoneXHeight,
                    }}>
                        {section1Data.map((item, i) => {
                            return (
                                <TouchableOpacity activeOpacity={1} key={i} style={{
                                    justifyContent: 'center', flex: 1, height: 44, paddingLeft: 12,
                                    borderBottomColor: '#DEDEDE',
                                    borderBottomWidth: 0.5,
                                    backgroundColor: this.state.selectRow === i ? 'white' : '#F4F4F4'
                                }} onPress={() => {
                                    this.setState({leftValue: item, selectRow: i, selectedValue: selectedValue[i]});
                                }}>
                                    <Text style={{
                                        color: this.state.selectRow === i ? '#585858' : '#585858',
                                        fontSize: 15
                                    }}>{item}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                    <ScrollView style={{width: width * 0.6, height: height - global.params.iPhoneXHeight * 2 - 64,}}>
                        {this.state.selectedValue.map((item, i) => {
                            return (
                                <TouchableOpacity activeOpacity={1} key={i} style={{
                                    justifyContent: 'center', flex: 1, height: 44, paddingLeft: 12,
                                    borderBottomColor: '#DEDEDE',
                                    borderBottomWidth: 0.5,
                                    backgroundColor: 'white'
                                }} onPress={() => {
                                    console.log(item);
                                    DeviceEventEmitter.emit('getDem', [this.state.leftValue, item]);
                                    this.props.navigator.pop();
                                }}>
                                    <Text style={{color: '#858585', fontSize: 14}}>{item}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>
            </View>
        )
    }
}
