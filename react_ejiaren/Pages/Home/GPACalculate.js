import React, {Component} from 'react'
import {
    View,
    ListView,
    StyleSheet,
    Dimensions,
    StatusBar,
    PixelRatio,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    DeviceEventEmitter
} from 'react-native'


var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import NavBar from '../Componnet/NavBar'

let {width} = Dimensions.get('window')
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import GPAResult from './GPACalculateResults'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


export default class GPACalculate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currData: [{name: '科目1', score: '', xuefen: ''},
                {name: '科目2', score: '', xuefen: ''},
                {name: '科目3', score: '', xuefen: ''},
                {name: '科目4', score: '', xuefen: ''},
                {name: '科目5', score: '', xuefen: ''},
            ]
        }
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        this.resetGpa = DeviceEventEmitter.addListener('resetGpa', ()=>{

            let currData = this.state.currData;
            for (var i = 0; i < currData.length; i++) {
                let item = currData[i];
                item.score = '';
                item.xuefen = '';
            }
            this.setState({currData:currData })
        });
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
        this.resetGpa.remove();
    }

    back() {
        this.props.navigator.pop()
    }


    updateRow(col, text, index) {
        let currData = this.state.currData;
        for (var i = 0; i < currData.length; i++) {
            let item = currData[i];
            if (i === index) {
                if (col === 'name') {
                    item.name = text;
                } else if (col === 'score') {
                    item.score = text;
                } else if (col === 'xuefen') {
                    item.xuefen = text;
                }
            }
        }
        this.setState({currData: currData});
    }

    showErrorAlert() {
        MessageBarManager.showAlert({
            alertType: 'error',
            message: '请检查行数据输入是否正确',
            messageStyle: {
                color: 'white',
                fontSize: 13,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
            },
        })
    }

    getData() {
        var ar = this.state.currData.filter((item, i) => {
            if (item.name !== '' && item.score !== '' && item.xuefen !== '') {
                return item;
            }
        })
        console.log(ar);
        if (ar.length < 1) {
            this.showErrorAlert();
            return;
        }

        let fmu = 0.00;
        let fz = 0.00;
        for (var i = 0; i < ar.length; i++) {
            let item = ar[i];
            if (parseFloat(item.score) > this.props.item.type ){
                this.showErrorAlert();
                return;
            }
            let d = parseFloat(item.score) * parseFloat(item.xuefen);
            fmu += d;
            fz += parseFloat(item.xuefen);
        }
        let fourResult = fmu * 4.00 / (fz * this.props.item.type);
        let hundResult = fmu * 100.00 / (fz * this.props.item.type);
        console.log(fourResult + '  :  ' + hundResult);

        this.props.navigator.push({
            component: GPAResult,
            params: {fourResult:fourResult.toFixed(2),hundResult:hundResult.toFixed(2)},
        })

    }


    addRow() {
        var len = this.state.currData.length;
        var arr = this.state.currData;
        arr.push({
            name: '科目' + (len + 1),
            score: '',
            xuefen: ''
        })
        this.setState({currData: arr});
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
                    title={this.props.item.title}
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <KeyboardAwareScrollView>
                    <View style={styles.topTitleViewStyle}>
                        <Text allowFontScaling={false} style={styles.topTitleStyle}>科目</Text>
                        <Text allowFontScaling={false} style={styles.topTitleStyle}>成绩</Text>
                        <Text allowFontScaling={false} style={styles.topTitleStyle}>学分</Text>
                    </View>
                    <View>
                        {this.state.currData.map((item, i) => {
                            return (
                                <View key={i} style={styles.contentRowStyle}>

                                    <TextInput allowFontScaling={false} placeholder='请输入科目' placeholderTextColor='#727272'
                                               defaultValue={item.name}
                                               onChangeText={(textVal) => this.updateRow('name', textVal, i)}
                                               underlineColorAndroid='transparent'
                                               style={styles.textInputStyle}
                                    >
                                    </TextInput>

                                    <TextInput allowFontScaling={false} placeholder='请输入成绩' placeholderTextColor='#727272'
                                               onChangeText={(textVal) => this.updateRow('score', textVal, i)}
                                               underlineColorAndroid='transparent'
                                               style={styles.textInputStyle}
                                               keyboardType='numeric'
                                               returnKeyType='done'
                                    >
                                    </TextInput>

                                    <TextInput allowFontScaling={false} placeholder='请输入学分' placeholderTextColor='#727272'
                                               onChangeText={(textVal) => this.updateRow('xuefen', textVal, i)}
                                               underlineColorAndroid='transparent'
                                               style={styles.textInputStyle}
                                               keyboardType='numeric'
                                               returnKeyType='done'
                                    >
                                    </TextInput>
                                </View>
                            )
                        })}
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 30}}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.addBtnStyle}
                                          onPress={this.addRow.bind(this)}>
                            <Text allowFontScaling={false} style={{color: 'white', fontSize: 17}}>添加一行</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={styles.calculateBtnStyle}
                                          onPress={this.getData.bind(this)}>
                            <Text allowFontScaling={false} style={{color: 'white', fontSize: 17}}>计算</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
                <MessageBarAlert ref="alert"/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    topTitleViewStyle: {
        flexDirection: 'row',
        height: 44,
        alignItems: 'center',
    },
    topTitleStyle: {
        width: width / 3,
        fontSize: 17,
        textAlign: 'center'
    },
    contentRowStyle: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    textInputStyle: {
        padding:0,
        width: (width - 60) / 3,
        height: 32,
        borderRadius: 4,
        borderWidth: Platform.OS === 'ios' ? 0.5 : 1,
        borderColor: global.params.backgroundColor,
        color: global.params.backgroundColor,
        marginLeft: 15,
        paddingLeft: 10,

    },

    addBtnStyle: {
        width: (width - 60) / 3,
        marginLeft: 15,
        height: 44,
        backgroundColor: global.params.backgroundColor,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calculateBtnStyle: {
        width: (width - 60) / 3 * 2 + 15,
        marginLeft: 15,
        height: 44,
        backgroundColor: global.params.backgroundColor,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    }

})