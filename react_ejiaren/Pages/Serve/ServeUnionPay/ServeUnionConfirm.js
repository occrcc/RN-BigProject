import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    StatusBar,
    TouchableOpacity,
    DeviceEventEmitter,
    Image,
    ScrollView,
    InteractionManager,
    Platform,
} from 'react-native'

let {width, height} = Dimensions.get('window')
import NavBar from '../../Componnet/NavBar'
import ServeUploadStudent from './ServeUploadStudentInfo'

import Alert from 'rnkit-alert-view';

var submitObj = {}

export default class ServeUnionConfirm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
        }
    }

    back() {
        this.props.navigator.pop();
    }

    componentWillUnmount() {
        submitObj = {}
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {

            console.log(this.props.submitObj);

            let country_name = '国家：' + this.props.submitObj["country_name"];
            let school_name = '学校名称：' + this.props.submitObj["school_name"];
            let pre_amount = '到账金额：' + this.props.submitObj["currency_icon"] + this.props.submitObj["input_amount"];
            let foreignCoin = '';
            if (parseInt(this.props.submitObj["use_full"]) === 0) {
                foreignCoin = '足额到账服务：未使用';
            } else {
                foreignCoin = '足额到账服务：' + this.props.submitObj["currency_icon"] + this.props.submitObj["foreignCoin"];
            }

            let fee_type = '费用类别：' + this.props.submitObj["fee_type"];
            let section0 = [country_name, school_name, pre_amount, foreignCoin, fee_type];

            let contact_name = '中文姓名：' + this.props.submitObj["contact_name"];
            let eng_name = '英文姓名：' + this.props.submitObj["eng_name"];
            let id_card = '身份证号：' + this.props.submitObj["id_card"];
            let student_id = '学号：' + this.props.submitObj["student_id"];
            let contact_phone = '联系电话：' + this.props.submitObj["contact_phone"];
            let contact_email = '邮箱：' + this.props.submitObj["contact_email"];

            let notice = '汇款附言：';
            let no = this.props.submitObj["reference"];
            if (no) {
                notice = notice + no;
            }

            let section1 = [contact_name, eng_name, id_card, student_id, contact_phone, contact_email, notice];

            let section2 = new Array;

            var bk = this.getBanksArr(this.props.submitObj.bank_info)
            var len = bk.length;
            console.log(bk);


            for (var i = 0; i < len; i++) {
                section2.push(bk[i].key + ':' + bk[i].value);
            }


            let sectionTitle = [
                ['money_card', '付款信息', section0],
                ['student_icon', '学生信息', section1],
            ];

            if (section2.length > 0) {
                sectionTitle.push(['backcard_icon', '收款账户信息', section2]);
            }

            this.setState({dataSource: sectionTitle});
        })
    }


    getBanksArr(str) {

        var arr = new Array;
        if (!str){
            return arr;
        }
        if (str == '') {
            return arr;
        }
        var jAr = str.split("||");

        jAr.forEach(function (val, index, a) {
            var pAr = val.split("##");
            arr.push({key: pAr[0], value: pAr[1]});
        });
        return arr;
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
                    title='银联汇款'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <ScrollView style={{marginBottom: (40 + global.params.iPhoneXHeight)}}>
                    <View>
                        <View style={{marginLeft: 14, flexDirection: 'row', height: 40, alignItems: 'center',}}>
                            <Image source={{uri: 'icon_comfirm'}}
                                   style={{resizeMode: 'stretch', width: 24, height: 20, marginRight: 8}}/>
                            <Text style={{fontSize: 15, color: 'black'}}>确认信息</Text>
                        </View>
                        <View style={{marginBottom: 8, marginLeft: 15, marginRight: 15}}>
                            <Text style={{
                                fontSize: 13,
                                color: 'rgb(186,53,46)'
                            }}>请仔细核对以下信息，如因信息不准确将延误到账时间，可能会带来不必要的损失。</Text>
                        </View>
                    </View>

                    {this.state.dataSource.map((item, i) => {
                        return (
                            <View key={i}>
                                <View style={styles.titleViewStyle}>
                                    <Image source={{uri: item[0]}}
                                           style={{resizeMode: 'stretch', marginLeft: 14, width: 22, height: 22}}/>
                                    <Text style={{marginLeft: 8, fontSize: 15, color: 'black'}}>{item[1]}</Text>
                                </View>
                                {item[2].map((rowData, j) => {
                                    return (
                                        <View key={j} style={{height: 38, justifyContent: 'center'}}>
                                            <Text style={{
                                                marginLeft: 14,
                                                fontSize: 13,
                                                color: 'rgb(144,144,144)'
                                            }}>{rowData}</Text>
                                        </View>
                                    )
                                })}
                            </View>
                        )
                    })}
                </ScrollView>

                <View style={styles.footerViewStyle}>
                    <TouchableOpacity activeOpacity={0.8} style={[styles.footerBtnStyle, {backgroundColor: 'white'}]}
                                      onPress={() => {
                                          this.props.navigator.pop();
                                      }}>
                        <Text style={styles.footerTextStyle}>返回修改</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.footerBtnStyle} onPress={() => {


                        console.log(this.props.submitObj);

                        this.props.navigator.push({
                            component: ServeUploadStudent,
                            params: {submitObj: this.props.submitObj},
                        })


                        // const routes = this.props.navigator.state.routeStack;
                        //
                        //
                        // let destinationRoute = null;
                        // for (var i = routes.length - 1; i >= 0; i--) {
                        //     console.log(routes[i].component.displayName);
                        //     if (routes[i].component.displayName === "ServeUnionStudentInfo") {
                        //         destinationRoute = this.props.navigator.getCurrentRoutes()[i];
                        //         break;
                        //     }
                        // }
                        // if (destinationRoute) {
                        //     this.props.navigator.popToRoute(destinationRoute);
                        //     DeviceEventEmitter.emit('serveUnion_push');
                        // }else {
                        //     Alert.alert(
                        //         '提示', 'destinationRoute为空', [
                        //             {text: '知道了', onPress: () => console.log('以后再说')},
                        //         ],
                        //     );
                        // }
                    }}>
                        <Text style={[styles.footerTextStyle, {color: 'white'}]}>确认无误</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({


    titleViewStyle: {
        flexDirection: 'row',
        height: 38,
        alignItems: 'center',
        backgroundColor: 'rgb(244,244,244)'
    },

    footerViewStyle: {
        position: 'absolute',
        bottom: 0,
        height: 44 + global.params.iPhoneXHeight,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        flexDirection: 'row',
        borderTopColor: 'rgb(222,222,222)',
        borderTopWidth: 1,
    },
    footerBtnStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
        flex: 3,
        backgroundColor: global.params.backgroundColor
    },
    footerTextStyle: {
        textAlign: 'center',
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold'
    },
});