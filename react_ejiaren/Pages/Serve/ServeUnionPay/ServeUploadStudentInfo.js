import React, {Component} from 'react'
import {
    View,
    ListView,
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
    Linking
} from 'react-native'

var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
let {width, height} = Dimensions.get('window')
import NavBar from '../../Componnet/NavBar'
import {Navigator} from 'react-native-deprecated-custom-components'
import SchoolCardInfo from './SchoolCardInfo'
import storage from "../../RNAsyncStorage";
import OrderPay from '../OrderPay'
import ServeUnionPayFileDemo from './ServeUnionPayFileDemo'
var GetDataApi = require('../../Service/getData');
import Coupon from '../../Mine/MineOtherPages/MyCoupons'


var ImagePicker = require('react-native-image-picker')
var ServeApi = require('../ServeApi/ServeApi')
var submitObj = {}

var options = {
    title: '请选择图片来源',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '相册图片',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};


export default class ServeUploadStudentInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imgs: ['', '', '', ''],
            userInfo:null,
        }
    }

    back() {
        this.props.navigator.pop();
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.getUserInfo();
        })
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        submitObj = this.props.submitObj;
        this.getConpone = DeviceEventEmitter.addListener('getConpone', (conponeCode) => {
            setTimeout(()=>this.orderPayInfo(conponeCode),500);
        });

    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
        this.getConpone.remove();
    }


    getUserInfo() {
        storage.load({
            key: 'userInfo'
        }).then(res => {
            this.setState({userInfo: res});
        }).catch(err => {
            this.setState({userInfo: null});
            console.log('未检查到用户 ' + err)
        })
    }

    showAlert(message) {
        MessageBarManager.showAlert({
            alertType: 'error',
            message: message,
            messageStyle: {
                color: 'white',
                fontSize: 13,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
            },
        });
    }

    next() {
        console.log('submitObj1: ',submitObj);

        GetDataApi.getCheckUserCode(3, parseFloat(submitObj['pre_amount']), this.state.userInfo.token).then(res => {
            console.log(res);
            if (res.length < 1) {
                this.orderPayInfo();
            } else {
                console.log('你有优惠券可以使用,跳转到优惠券界面');
                this.props.navigator.push({
                    sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                    component: Coupon,
                    params: {sourceList:res},
                })
            }
        }).catch(err => {
            console.log('err   ' + err);
        })
    }

    orderPayInfo(code){
        if (code) {
            submitObj['code'] = code;
        }
        submitObj['from'] = Platform.OS === 'ios' ? 0 : 3;
        submitObj['access_token'] = this.state.userInfo.token;
        console.log('submitObj2: ',submitObj);

        ServeApi.submitUNionPayOrler(submitObj).then(res=>{
            console.log('res: ' , res);
            this.props.navigator.push({
                sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                component: OrderPay,
                params: {orderInfo: res,userInfo:this.state.userInfo},
            })
        }).catch(error=>{
            console.log('error  ' + error);
            MessageBarManager.showAlert({
                message: error,
                messageStyle: {
                    color: 'white',
                    fontSize: 13,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
                },
                alertType: 'error',
            });
        })

    }

    keFu() {
        let url = 'tel: ' + '021-61984772';
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    selectImage() {
        let imgAr = ['yl_offer', 'yl_zhangdan', 'yl_i20', 'yl_huzhao'];
        return (
            <View style={{flexDirection: 'row', marginTop: 30}}>
                {imgAr.map((imgName, i) => {
                    return (
                        <TouchableOpacity activeOpacity={0.8} key={i}
                                          style={{width: (width - 50) / 4, marginLeft: 10, height: (width - 50) / 4}}
                                          onPress={this.chooseImage.bind(this, i)}
                        >
                            <Image source={{
                                uri: this.state.imgs[i].length > 0 ? this.state.imgs[i] : imgName
                            }}
                                   style={{flex: 1, resizeMode: 'stretch'}}/>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }

    chooseImage(i) {

        console.log(i);

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('用户取消了选择！');
            }
            else if (response.error) {
                alert("ImagePicker发生错误：" + response.error);
            }
            else if (response.customButton) {
                alert("自定义按钮点击：" + response.customButton);
            }
            else {
                let imgArr = this.state.imgs;
                imgArr[i] = response.uri;
                this.setState({
                    imgs:imgArr,
                })

                let imgKey = 'payment_cert_pic3';
                switch (i) {
                    case 0: {
                        imgKey = 'payment_cert_pic3'
                    }
                        break;
                    case 1: {
                        imgKey = 'payment_cert_pic1'
                    }
                        break;
                    case 2: {
                        imgKey = 'payment_cert_pic2'
                    }
                        break;
                    default: {
                        imgKey = 'passport_pic1'
                    }
                        break;
                }
                ServeApi.getPicType({pic: response.data}).then(res => {
                    console.log(res);
                    submitObj[imgKey] = res.t;
                }).catch(error => {
                    console.log('error  ' + error);
                })
            }
        });
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
                    rightIcon="icon_kefu"
                    rightPress={this.keFu.bind(this)}
                />
                <Image source={{uri: 'unionpay3'}} style={styles.headerImageStyle}/>
                <ScrollView>
                    <View>
                        <View style={{marginTop: 15, marginBottom: 8, marginLeft: 15, marginRight: 15}}>
                            <Text style={{color: '#969696', fontSize: 12, letterSpacing: 1, lineHeight: 18}}>
                                {'\n'}✼ 因外管局备案要求，请上传您的留学缴费证明：
                                {'\n'}1、录取通知书截图。
                                {'\n'}2、学校的缴费通知（有详细信息包含学校收款账户信息）
                                {'\n'}、其它：如美国20表格、护照。
                                {'\n'}✼ 上传的图片要求字迹清晰可辨，必须包含学校的名称、学生英文名、缴费金额。
                                {'\n'}✼ 如暂时无法提供材料，请联系您的专属客服或直接提交订单，我们会在您提交需求后2个工作日内与你联系，请保持电话畅通。
                            </Text>
                        </View>

                        <View style={{width: width, height: 15, backgroundColor: 'rgb(244,244,244)'}}/>
                        <View style={{
                            borderBottomColor: 'rgb(222,222,222)',
                            borderBottomWidth: 0.5,
                            height: 40,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <View style={{marginLeft: 15, flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={{uri: 'icon_zhengming'}}
                                       style={{width: 18, height: 18, resizeMode: 'stretch'}}/>
                                <Text style={{marginLeft: 8, color: '#727272', fontSize: 13}}>上传存款证明</Text>
                            </View>
                            <TouchableOpacity activeOpacity={0.8} style={styles.fileBtnStyle}
                                              onPress={()=>{
                                                  this.props.navigator.push({
                                                      component: ServeUnionPayFileDemo,
                                                  })
                                              }}
                            >
                                <Text style={{textAlign: 'center', color: global.params.backgroundColor, fontSize: 13}}>示例文件</Text>
                            </TouchableOpacity>
                        </View>
                        {this.selectImage()}

                    </View>
                </ScrollView>
                <MessageBarAlert ref="alert"/>

                <TouchableOpacity activeOpacity={0.8} style={[styles.footerBtnStyle]}
                                  onPress={this.next.bind(this)}
                >
                    <Text style={{fontSize: 17, color: 'white'}}>下一步</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    headerImageStyle: {
        width: width,
        height: 34,
    },

    footerBtnStyle: {
        position: 'absolute',
        bottom: 20 + global.params.iPhoneXHeight,
        height: 40,
        left: 14,
        right: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: global.params.backgroundColor
    },
    fileBtnStyle: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: global.params.backgroundColor,
        width: 80,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14
    }
});