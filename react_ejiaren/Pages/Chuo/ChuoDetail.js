import React, {Component} from 'react'
import {
    View,
    ScrollView,
    StyleSheet,
    RefreshControl,
    Platform,
    StatusBar,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    TextInput,
    PixelRatio,
    Keyboard,
    DeviceEventEmitter,
    InteractionManager

} from 'react-native'

import NavBar from '../Componnet/NavBar'
import storage from "../RNAsyncStorage"
import Alert from 'rnkit-alert-view';

import _ from 'lodash'

var ChuoServers = require('./Servers/ChuoServers')
import {CachedImage} from 'react-native-img-cache'

let {width, height} = Dimensions.get('window')
import {List, ListItem, Icon, Button} from 'react-native-elements'
import OpenFile from 'react-native-doc-viewer';
import CropImagePicker from 'react-native-image-crop-picker';

// var ImagePicker = require('react-native-image-picker');

var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

var onePT = 1 / PixelRatio.get(); //一个像素
//import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

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

export default class ChuoDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rowData: {},
            replyMessage: '',
            KeyboardShown: false,
            toImages: [],
            userInfo: null
        }
        this.keyboardWillShowListener = null;
        this.keyboardWillHideListener = null;
    }

    back() {
        this.props.navigator.pop()
    }

    componentWillMount() {
        //监听键盘弹出事件
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow',
            this.keyboardWillShowHandler.bind(this));
        //监听键盘隐藏事件
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide',
            this.keyboardWillHideHandler.bind(this));
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.getMessagesReply(this.props.rowData);
        });
        MessageBarManager.registerMessageBar(this.refs.alert);

    }

    //键盘弹出事件响应
    keyboardWillShowHandler(event) {
        if (this.refs.footView) {
            this.refs.footView.setNativeProps({
                style: {
                    bottom: event.endCoordinates.height
                }
            })
            this.setState({KeyboardShown: true});
        }
    }

    //键盘隐藏事件响应
    keyboardWillHideHandler(event) {
        if (this.refs.footView) {
            this.setState({KeyboardShown: false});
            this.refs.footView.setNativeProps({
                style: {
                    bottom: 0
                }
            })
        }
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
        //卸载键盘弹出事件监听
        if (this.keyboardWillShowListener != null) {
            this.keyboardWillShowListener.remove();
        }
    }

    async getMessagesReply(rowData) {
        let userInfo = await storage.load({key: 'userInfo'});
        let subList = await ChuoServers.getMyFileList(rowData.id, userInfo.token);
        let newData = rowData;
        newData.replyInfo = subList.list;
        // console.log(subList);
        this.setState({
            userInfo: userInfo,
            rowData: newData
        })
    }

    getMoreView(rowData) {
        return (
            <ScrollView style={styles.chuoCellStyle}>
                <View style={styles.userStyle}>
                    <CachedImage source={{uri: rowData.posterAvar}} style={styles.iconImgStyle}/>
                    <View style={styles.teacherNameStyle}>
                        <Text allowFontScaling={false}>{rowData.posterNickName} </Text>
                    </View>
                </View>
                <Image source={{uri: 'sanjiao'}} style={{marginTop: -10, marginLeft: 70, width: 18, height: 18}}/>
                <View style={styles.contentViewStyle}>
                    <Text allowFontScaling={false} style={styles.contentTitleStyle}>{rowData.title}</Text>
                    {this.isShowContentLabOrLinkBtn()}
                    {this.showTeacherItems()}
                    <View style={styles.createTimeStyle}>
                        <View/>
                        <Text allowFontScaling={false} style={{
                            height: 22,
                            color: 'rgb(188,188,188)',
                            fontSize: 11
                        }}>{rowData.createTimeFormat}</Text>
                    </View>
                </View>
                {this.subItems()}
            </ScrollView>
        )
    }

    showTeacherItems() {

        let rowData = this.state.rowData;
        if (rowData.hasOwnProperty('attachmentList')) {
            if (rowData.attachmentList.length < 1) {
                return <View/>
            } else return (
                <View style={{marginBottom: 10, marginLeft: 15}}>
                    <Text allowFontScaling={false} style={{height: 30}}>附件({rowData.attachmentList.length})</Text>
                    {rowData.attachmentList.map((item, i) => {
                        let imgType = item.type.toLowerCase().replace('.', '');

                        let imgUrl = '';
                        if (imgType === 'xlsx' || imgType === 'xls') {
                            imgUrl = 'excel';
                        } else if (imgType === 'jpg' || imgType === 'png' || imgType === 'jpeg' || imgType === 'jepg') {
                            imgUrl = 'jpg'
                        } else if (imgType === 'docx' || imgType === 'doc') {
                            imgUrl = 'wrold'
                        } else if (imgType === 'pdf') {
                            imgUrl = 'pdf'
                        } else if (imgType === 'pptx') {
                            imgUrl = 'ppt'
                        } else if (imgType === 'rar') {
                            imgUrl = 'rar'
                        }
                        return (
                            <ListItem
                                avatar={{uri: imgUrl}}
                                key={i}
                                title={item.originalName}
                                avatarContainerStyle={{
                                    width: 18,
                                    height: 18,
                                }}
                                avatarOverlayContainerStyle={{
                                    width: 18,
                                    height: 18,
                                    backgroundColor: 'rgba(255,255,255,0)'
                                }}
                                avatarStyle={{
                                    width: 20,
                                    height: 20,
                                }}
                                containerStyle={{
                                    height: 36,
                                    borderBottomWidth: global.params.CellLineViewHight,
                                    borderBottomColor: global.params.CellRightTitleColor,
                                }}
                                titleStyle={{
                                    fontSize: 11,
                                }}
                                rightIcon={<View/>}
                                onPress={this.didSelectFile.bind(this, item, true)}
                            />
                        )
                    })}
                </View>
            )
        }
    }


    subItems() {

        let rowData = this.state.rowData;
        if (rowData.hasOwnProperty('replyInfo')) {
            if (rowData.replyInfo.length < 1) {
                return <View/>
            } else return (
                <View style={{marginLeft: 15, marginBottom: 69 + global.params.iPhoneXHeight}}>
                    {this.myFilesTitle(this.filterReplyInfo(rowData.replyInfo, 1))}
                    {this.filterReplyInfo(rowData.replyInfo, 1).map((item, i) => {
                        let imgType = item.fileType.toLowerCase().replace('.', '');
                        let imgUrl = '';
                        if (imgType === 'xlsx' || imgType === 'xls') {
                            imgUrl = 'excel';
                        } else if (imgType === 'jpg' || imgType === 'png' || imgType === 'jpeg' || imgType === 'jepg') {
                            imgUrl = 'jpg'
                        } else if (imgType === 'docx' || imgType === 'doc') {
                            imgUrl = 'wrold'
                        } else if (imgType === 'pdf') {
                            imgUrl = 'pdf'
                        } else if (imgType === 'pptx') {
                            imgUrl = 'ppt'
                        } else if (imgType === 'rar') {
                            imgUrl = 'rar'
                        }
                        return (
                            <ListItem
                                avatar={{uri: imgUrl}}
                                key={i}
                                title={item.fileName}
                                avatarContainerStyle={{
                                    width: 18,
                                    height: 18,
                                }}
                                avatarOverlayContainerStyle={{
                                    width: 18,
                                    height: 18,
                                    backgroundColor: 'rgba(255,255,255,0)'
                                }}

                                avatarStyle={{
                                    width: 20,
                                    height: 20,
                                }}
                                containerStyle={{
                                    height: 36,
                                    borderBottomWidth: global.params.CellLineViewHight,
                                    borderBottomColor: global.params.CellRightTitleColor,
                                }}
                                titleStyle={{
                                    fontSize: 11,
                                }}
                                rightIcon={<View/>}
                                onPress={this.didSelectFile.bind(this, item, false)}
                            />
                        )
                    })}
                    {this.myMessageTitle(this.filterReplyInfo(rowData.replyInfo, 0))}
                    {this.filterReplyInfo(rowData.replyInfo, 0).map((item, i) => {
                        return (
                            <View key={i} style={{
                                width: width - 30,
                                borderBottomColor: global.params.CellRightTitleColor,
                                borderBottomWidth: global.params.CellLineViewHight,

                            }}>
                                <Text allowFontScaling={false} style={{
                                    marginTop: 8, marginBottom: 8,
                                    fontSize: 12,
                                    lineHeight: 15,
                                    color: 'rgb(111,111,111)'
                                }}
                                >
                                    {item.body}
                                </Text>
                            </View>
                        )
                    })}
                </View>
            )
        }
    }

    didSelectFile(file, isTeacher) {

        var fileType = isTeacher ? file.type : file.fileType;
        var fileName = isTeacher ? file.name : file.fileName;
        fileType = fileType.replace('.', '');

        if (Platform.OS === 'ios') {
            OpenFile.openDoc([{
                url: file.url,
                fileNameOptional: "sample",
                cache: true
            }], (error, url) => {
                if (error) {
                    this.setState({animating: false});
                } else {
                    this.setState({animating: false});
                }
            })
        } else {
            OpenFile.openDoc([{
                url: file.url,
                fileName: fileName,
                cache: true,
                fileType: fileType,
            }], (error, url) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log(url)
                }
            })
        }
    }

    myFilesTitle(myFilesAry) {
        if (myFilesAry.length > 0) {
            return (
                <Text allowFontScaling={false} style={{height: 24}}>我上传的资料({myFilesAry.length})</Text>
            )
        }
    }

    myMessageTitle(myMessageAry) {
        if (myMessageAry.length > 0) {
            return (
                <Text allowFontScaling={false} style={{height: 24, marginTop: 20}}>我的留言({myMessageAry.length})</Text>
            )
        }
    }

    filterReplyInfo(arr, type) {
        return arr.filter((item) => {
            return item.type == type
        })
    }

    isShowContentLabOrLinkBtn() {

        let rowData = this.state.rowData;

        if (rowData.messageType === 1) {
            return (
                <TouchableOpacity style={{
                    backgroundColor: 'white',
                    marginLeft: 15,
                    marginRight: 15,
                    height: 24,
                    borderRadius: 4,
                    marginTop: 8,
                    flexDirection: 'row',
                    alignItems: 'center'
                }} onPress={
                    this.didSelectLinkBtn.bind(this, rowData)
                }>
                    <CachedImage source={{uri: rowData.thumb.length > 1 ? rowData.thumb : 'icon_tabbar_mine'}}
                                 style={{marginLeft: 15, width: 18, height: 18}}/>
                    <Text allowFontScaling={false} numberOfLines={1} style={{
                        color: 'rgb(188,188,188)',
                        fontSize: 11,
                        marginLeft: 15,
                        width: width - 160
                    }}>{rowData.urlTitle}</Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <Text allowFontScaling={false} style={styles.contentBodyStyle} >{rowData.body}</Text>)
        }
    }

    async chooseImages() {

        let images = await CropImagePicker.openPicker({
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 400,
            multiple: true,
            includeBase64: true
        });
        var imgAr = this.state.toImages;
        images.map((item) => {
            let imgBase64Str = item.data;
            (async () => {
                let imgStyle = await ChuoServers.getImgType(imgBase64Str);
                imgAr.push(imgStyle.t);
                this.setState({toImages: imgAr});
                // console.log(this.state.toImages);
            })()
        })

        /*
        if (Platform.OS === 'ios') {

            let images = await CropImagePicker.openPicker({multiple: true, includeBase64: true});
            var imgAr = this.state.toImages;
            images.map((item) => {
                let imgBase64Str = item.data;
                (async () => {
                    let imgStyle = await ChuoServers.getImgType(imgBase64Str);
                    imgAr.push(imgStyle.t);
                    this.setState({toImages: imgAr});
                    console.log(this.state.toImages);
                })()
            })

        } else {
            console.log('草泥马');
            ImagePicker.showImagePicker(options, (response) => {
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
                    ChuoServers.getImgType(response.data).then(rep => {
                        this.state.toImages.push(rep.t);
                    })
                }
            });
        }*/
    }

    footInputView() {
        return (
            <View style={styles.footRowStyle} ref='footView'>
                <View style={styles.footMindViewStyle}>
                    <Icon
                        name='ios-add-circle-outline'
                        type='ionicon'
                        color='black'
                        size={26}
                        containerStyle={{
                            flex: 1,
                            marginTop: 7,
                            width: 26,
                            height: 26,
                            backgroundColor: 'rgba(255,255,255,0)'
                        }}
                        iconStyle={{width: 26, height: 26}}
                        underlayColor='rgba(255,255,255,0)'
                        onPress={this.chooseImages.bind(this)}/>
                    {this.isInput()}
                    <Button
                        buttonStyle={{flex: 1, height: 34, backgroundColor: 'white', marginTop: 6}}
                        textStyle={{fontSize: 15, color: 'black'}}
                        title='发送'
                        onPress={this.senderReplyMessage.bind(this)}
                    />
                </View>
            </View>
        )
    }

    deleteImage(i) {
        // console.log(i);

        Alert.alert(
            '提示', '您正在删除将要上传的照片', [
                {text: '以后再说', onPress: () => console.log('再想想')},
                {
                    text: '删除', onPress: () => {
                    let imgs = this.state.toImages;
                    imgs.splice(i, 1);
                    this.setState({
                        toImages: imgs
                    });
                }
                },
            ],
        );
    }

    isInput() {
        if (this.state.toImages.length > 0) {
            return (
                <View style={styles.imgShowView}>
                    {
                        this.state.toImages.map((item, i) => {
                            return (
                                <TouchableOpacity key={i}
                                                  onPress={this.deleteImage.bind(this, i)}
                                >
                                    <Image style={{width: 24, height: 24, margin: 5}} source={{uri: item.url}}/>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            )
        } else {
            return (
                <TextInput allowFontScaling={false} style={styles.inputs}
                           underlineColorAndroid='transparent'
                           returnKeyType="done"
                           placeholder="请输入回复内容"

                    // onEndEditing = {this.hide.bind(this,this.state.value)}
                           value={this.state.replyMessage}
                           onChangeText={(value) => this.setState({replyMessage: value})}/>
            )
        }
    }

    showAlertMessage(yes, errorMessage) {

        ChuoServers.getNavigatorBadge(this.state.userInfo.token).then(res => {
            DeviceEventEmitter.emit('upLoadNavigator', res);
        }).catch(err => {
            console.log(err);
        });

        if (yes) {
            MessageBarManager.showAlert({
                // title: "OK!", // Title of the alert
                message: "发送成功", // Message of the alert
                titleStyle: {
                    color: 'white',
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginTop: global.params.iPhoneXHeight
                },
                messageStyle: {
                    color: 'white',
                    fontSize: 13,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
                },
                alertType: 'success',
            });
        } else {
            MessageBarManager.showAlert({
                // title: "Error！", // Title of the alert
                message: errorMessage, // Message of the alert
                titleStyle: {
                    color: 'white',
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginTop: 40
                },
                messageStyle: {
                    color: 'white',
                    fontSize: 13,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: Platform.OS === 'ios' ? 29 + global.params.iPhoneXHeight : 0,
                },
                alertType: 'error',
            });
        }
    }

    // 转为unicode 编码
    // encodeUnicode(str) {
    //     var res = [];
    //     for ( var i=0; i<str.length; i++ ) {
    //         res[i] = ( "00" + str.charCodeAt(i).toString(16) ).slice(-4);
    //     }
    //     return "\\u" + res.join("\\u");
    // }

    filteremoji(emojireg) {
        var ranges = [
            '\ud83c[\udf00-\udfff]',
            '\ud83d[\udc00-\ude4f]',
            '\ud83d[\ude80-\udeff]'
        ];
        emojireg = emojireg.replace(new RegExp(ranges.join('|'), 'g'), '');
        return emojireg;
    }



    async senderReplyMessage() {
        if (this.state.replyMessage.length < 1 && this.state.toImages.length < 1) {
            this.showAlertMessage(false, '发送内容不能为空');
            return;
        }
        let userInfo = await storage.load({key: 'userInfo'});
        let senderImageAry = this.state.toImages;
        if (senderImageAry.length > 0) {
            senderImageAry.map((item, i) => {
                ChuoServers.saveImgs(item, this.props.rowData.id, userInfo.token).then(res => {
                    if (i === senderImageAry.length - 1) {
                        let source = this.getMessagesReply(this.props.rowData);
                        if (source) {
                            this.showAlertMessage(true);
                            this.setState({toImages: []})
                            DeviceEventEmitter.emit('refreshBadge');
                            DeviceEventEmitter.emit('ChuoIndexReplyChange', res.t);
                        }
                    }
                })
            })
        } else {
            Keyboard.dismiss();

            // console.log('replyMessage:  '  + this.filteremoji(this.state.replyMessage));
            let message = this.filteremoji(this.state.replyMessage);
            ChuoServers.replyMessage(userInfo.token, this.props.rowData.id, message)
                .then(res => {

                    DeviceEventEmitter.emit('refreshBadge');
                    DeviceEventEmitter.emit('ChuoIndexReplyChange', res.t);
                    this.getMessagesReply(this.props.rowData);
                    this.showAlertMessage(true);
                    this.setState({
                        replyMessage: ''
                    })
                }).catch(error => {
                this.showAlertMessage(false, error);
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                <NavBar
                    title="通知"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                {this.getMoreView(this.state.rowData)}
                {this.footInputView()}
                <MessageBarAlert ref="alert"/>
            </View>
        )
    }
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    chuoCellStyle: {
        width: width,
        backgroundColor: 'white',
    },

    userStyle: {
        height: 50,
        width: width,
        flexDirection: 'row',
        marginTop: 20
    },
    iconImgStyle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        marginLeft: 20,
        marginTop: 8,
    },

    teacherNameStyle: {
        height: 50,
        width: 200,
        justifyContent: 'center',
        marginLeft: 10
    },
    contentViewStyle: {
        marginLeft: 15,
        width: width - 30,
        backgroundColor: 'rgb(241,241,241)',
        marginTop: -9,
        borderRadius: 8,
        marginBottom: 23,
    },
    contentTitleStyle: {
        fontSize: 15,
        marginTop: 15,
        marginLeft: 12,
    },
    contentBodyStyle: {
        fontSize: 13,
        marginTop: 8,
        marginLeft: 12,
        marginRight: 12,
        color: 'rgb(188,188,188)',
        marginBottom: 20
    },
    createTimeStyle: {
        width: width - 40,
        height: 22,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15
    },

    footRowStyle: {
        position: 'absolute',
        width: width,
        height: 49 + global.params.iPhoneXHeight,
        backgroundColor: 'white',
        bottom: 0,
        borderTopWidth: 1,
        borderTopColor: 'rgb(244,244,244)'
    },
    footMindViewStyle: {
        flexDirection: 'row',
        height: 40,
        backgroundColor: 'white',
        marginTop: 5
    },
    inputs: {
        flex: 4,
        height: 34,
        borderWidth: 1,
        paddingLeft: 5,
        borderColor: 'rgb(222,222,222)',
        borderRadius: 4,
        marginTop: 3,
        justifyContent: 'center',
        paddingTop: 0,
        paddingBottom: 0
    },

    imgShowView: {
        flex: 4,
        height: 34,
        borderWidth: 1,
        paddingLeft: 5,
        borderColor: 'rgb(222,222,222)',
        borderRadius: 4,
        marginTop: 3,
        paddingTop: 0,
        paddingBottom: 0,
        flexDirection: 'row'
    },


})
