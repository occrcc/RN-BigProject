/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */


'use strict';

import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    DeviceEventEmitter,
    Platform,
    Image,
    Dimensions,
    Text

} from 'react-native'


const CANCEL_INDEX = 0

import NavBar from '../../Componnet/NavBar'
import {List, ListItem} from 'react-native-elements'


import storage from '../../RNAsyncStorage'

import Prompt from 'react-native-prompt'

var UserInfoServes = require('../Servers/UserInfoServes')
var MessageBarAlert = require('react-native-message-bar').MessageBar
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
var ImagePicker = require('react-native-image-picker')


import ActionSheet from 'react-native-actionsheet'
import DatePicker from 'react-native-datepicker'
import ChooseSchool from './ChooseSchoolVC'
import ChooseAddress from './ChooseAddress'

let {width, height} = Dimensions.get('window')

var options = {
    title: '请选择图片来源',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '相册图片',
    maxWidth: 300,
    maxHeight: 400,
    quality: 0.8,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

var selectRow = 0;

export default class MyInfoVC extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: null,
            avatarSource: null,
            isShow: false,
            message: '',
            dateModalVisible: false,
            actionOptions: ['Cancel', '男', '女'],
            studentOptions: ['Cancel', '男', '女'],
            teacherOptions: null,
            gender: ' ',
        }
        this.handlePress = this.handlePress.bind(this);
        this.showActionSheet = this.showActionSheet.bind(this);

    }

    componentWillMount() {
        this.loadUserFromCache();
        if (parseInt(this.props.userInfo.user.teacher) > 0) {
            this.getTeacherType();
        }
    }

    getTeacherType() {
        UserInfoServes.getTeacherType(this.props.userInfo.token).then(res => {
            if (res.length > 0) {
                let newArr = new Array;
                newArr.push('取消');
                for (var i = 0; i < res.length; i++) {
                    newArr.push(res[i])
                }
                console.log(newArr);
                this.setState({teacherOptions: newArr});
            }

        }).catch(err => {

        })
    }

    async loadUserFromCache() {
        let userInfo = await storage.load({
            key: 'userInfo'
        });

        let gender = this.state.gender;
        if (userInfo.user.gender === 2) {
            gender = '女'
        } else if (userInfo.user.gender === 1) {
            gender = '男'
        }

        this.setState({
            userInfo: userInfo,
            gender: gender,

        });
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        this.chooseSchoolListener = DeviceEventEmitter.addListener('chooseSchool', (obj) => {
            UserInfoServes.uploadOtherInfo('educational', obj.name, this.state.userInfo.token).then(rep => {
                console.log(rep);
                let saveUserInfo = this.state.userInfo;
                saveUserInfo.user = rep;
                {
                    this.saveUserInfo(saveUserInfo)
                }
                this.setState({userInfo: saveUserInfo});
            }).catch(err => {
                {
                    this.saveUserInfo(null, err)
                }
            })
        });

        this.chooseCitys = DeviceEventEmitter.addListener('chooseCitys', (obj) => {
            let cityid = ''
            if (obj.cityid) {
                cityid = obj.cityid;
            } else {
                cityid = obj.id;
            }

            console.log(cityid);
            UserInfoServes.uploadOtherInfo('cityid', cityid, this.state.userInfo.token).then(rep => {
                console.log(rep);
                let saveUserInfo = this.state.userInfo;
                saveUserInfo.user = rep;
                {
                    this.saveUserInfo(saveUserInfo)
                }
                this.setState({userInfo: saveUserInfo});
            }).catch(err => {
                {
                    this.saveUserInfo(null, err)
                }
            })
        });
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
        this.chooseSchoolListener.remove();
        this.chooseCitys.remove();
    }

    saveUserInfo(userInfo, err) {
        if (userInfo) {
            storage.save({
                key: 'userInfo',  // 注意:请不要在key中使用_下划线符号!
                data: userInfo
            }).then(
                DeviceEventEmitter.emit('uploadUser'),
            )

            MessageBarManager.showAlert({
                // title: "恭喜您！", // Title of the alert
                message: "修改成功", // Message of the alert
                titleStyle: {
                    color: 'white',
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginTop: global.params.iPhoneXHeight + 9
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
                message: err, // Message of the alert
                titleStyle: {
                    color: 'white',
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginTop: global.params.iPhoneXHeight + 9
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

    chooseNickName() {
        this.setState({
            isShow: true,
        });
    }

    submitNickName(nickName) {
        this.setState({
            isShow: false,
            message: nickName
        })
        UserInfoServes.uploadOtherInfo('nickname', nickName, this.state.userInfo.token).then(rep => {
            console.log(rep);
            let saveUserInfo = this.state.userInfo;
            saveUserInfo.user = rep;

            {
                this.saveUserInfo(saveUserInfo)
            }
            this.setState({
                userInfo: saveUserInfo
            });
        }).catch(err => {
            {
                this.saveUserInfo(null, err)
            }
        })
    }


    chooseSchool(name) {
        if (this.props.userInfo.user.teacher) {
            console.log('当前角色', this.state.teacherOptions);
            if (this.state.teacherOptions) {
                this.showActionSheet(true);
            }
        } else {
            // console.log('选择学校');
            this.props.navigator.push({
                component: name,
                data: this.state.userInfo,
            })
        }
    }

    rightView() {
        return (
            <DatePicker
                style={{width: 200, marginTop: 14}}
                date={this.state.userInfo ? this.state.userInfo.user.birthday : '1900-01-01'}
                mode="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                minDate="1900-01-01"
                maxDate="2001-12-31"
                confirmBtnText="确定"
                cancelBtnText="取消"
                customStyles={{
                    dateIcon: {
                        width: 30,
                        height: 30,
                        marginBottom: 14
                    },
                    dateInput: {
                        height: 36,
                        marginBottom: 16,
                        borderWidth: 0,
                        alignItems: 'flex-end',
                    },
                    dateText: {
                        color: global.params.CellRightTitleColor
                    }
                }}
                onDateChange={(date) => this.changeBirs(date)}
                //onCloseModal = {this.chooseBirth.bind(this)}
            />
        )
    }

    changeBirs(date) {

        //this.setState({birthday:date});

        UserInfoServes.uploadOtherInfo('birthday', date, this.state.userInfo.token).then(rep => {
            console.log(rep);
            let saveUserInfo = this.state.userInfo;
            saveUserInfo.user = rep;
            {
                this.saveUserInfo(saveUserInfo)
            }
            this.setState({userInfo: saveUserInfo});
        }).catch(err => {
            {
                this.saveUserInfo(null, err)
            }
        })
    }

    chooseAvatar() {
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
                UserInfoServes.uploadProfileImg(response.data, this.state.userInfo.token).then(rep => {
                    console.log(rep);
                    let saveUserInfo = this.state.userInfo;
                    saveUserInfo.user = rep;
                    {
                        this.saveUserInfo(saveUserInfo)
                    }
                    this.setState({
                        userInfo: saveUserInfo,
                    });

                }).catch(err => {
                    {
                        this.saveUserInfo(null, err)
                    }
                })
            }
        });
    }

    chooseAddress(name) {
        console.log('选择学校');
        this.props.navigator.push({
            component: name,
        })
    }

    showActionSheet(isTeacher) {
        let options = isTeacher ? this.state.teacherOptions : this.state.studentOptions;
        selectRow = isTeacher ? 1 : 0;
        this.setState({actionOptions: options}, () => {
            this.ActionSheet.show();
        })
    }

    handlePress(i) {
        console.log(selectRow);
        if (i === 0) return;
        let par = '';
        let value = '';
        if (selectRow === 0) {
            par = 'gender';
            value = this.state.studentOptions[i];
            if (value === '男') {
                value = 1;
            } else value = 2;
        } else if (selectRow === 1) {
            par = 'educational';
            value = this.state.teacherOptions[i];
        }

        this.setState({
            gender:value === 1 ? '男' :'女'
        })

        UserInfoServes.uploadOtherInfo(par, value, this.state.userInfo.token).then(rep => {
            console.log(rep);
            let saveUserInfo = this.state.userInfo;
            saveUserInfo.user = rep;
            {
                this.saveUserInfo(saveUserInfo)
            }
            this.setState({
                userInfo: saveUserInfo,
            });
        }).catch(err => {
            {
                this.saveUserInfo(null, err)
            }
        })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <NavBar
                    title="我的资料"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <ScrollView>

                    <TouchableOpacity activeOpacity={0.8} onPress={this.chooseAvatar.bind(this)} style={{
                        height: 100,
                        width: width,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomWidth: global.params.CellLineViewHight,
                        borderBottomColor: global.params.CellRightTitleColor,
                        flexDirection: 'row',
                    }}>

                        <Image
                            source={{uri: this.state.userInfo ? this.state.userInfo.user.profile_image_url : 'defu_user'}}
                            style={{
                                width: 80, height: 80, marginLeft: 15,
                                borderRadius: 40
                            }}
                        />
                        <Image source={{uri: 'icon_cell_rightarrow'}}
                               style={{marginRight: 14, width: 8, height: 12}}/>

                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.chooseNickName.bind(this)} style={{
                        height: 44,
                        width: width,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomWidth: global.params.CellLineViewHight,
                        borderBottomColor: global.params.CellRightTitleColor,
                        flexDirection: 'row',
                    }}>
                        <Text style={{
                            fontSize: global.params.CellTitleFontSize,
                            color: global.params.CellTitleColor,
                            marginLeft: 15,
                        }}>昵称</Text>

                        <View style={{marginRight: 15, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{
                                fontSize: global.params.CellRightTitleFontSize,
                                color: global.params.CellRightTitleColor,
                            }}>{this.state.userInfo ? this.state.userInfo.user.nickname : ' '}</Text>
                            <Image source={{uri: 'icon_cell_rightarrow'}}
                                   style={{marginLeft: 14, width: 8, height: 12}}/>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} onPress={() => this.showActionSheet(false)} style={{
                        height: 44,
                        width: width,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomWidth: global.params.CellLineViewHight,
                        borderBottomColor: global.params.CellRightTitleColor,
                        flexDirection: 'row',
                    }}>
                        <Text style={{
                            fontSize: global.params.CellTitleFontSize,
                            color: global.params.CellTitleColor,
                            marginLeft: 15,
                        }}>性别</Text>

                        <View style={{marginRight: 15, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{
                                fontSize: global.params.CellRightTitleFontSize,
                                color: global.params.CellRightTitleColor,
                            }}>{this.state.gender}</Text>
                            <Image source={{uri: 'icon_cell_rightarrow'}}
                                   style={{marginLeft: 14, width: 8, height: 12}}/>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} style={{
                        height: 44,
                        width: width,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomWidth: global.params.CellLineViewHight,
                        borderBottomColor: global.params.CellRightTitleColor,
                        flexDirection: 'row',
                    }}>
                        <Text style={{
                            fontSize: global.params.CellTitleFontSize,
                            color: global.params.CellTitleColor,
                            marginLeft: 15,
                        }}>出生日期</Text>

                        <View style={{marginRight: 15, flexDirection: 'row', alignItems: 'center'}}>
                            {this.rightView()}
                            <Image source={{uri: 'icon_cell_rightarrow'}}
                                   style={{marginLeft: 14, width: 8, height: 12}}/>
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} onPress={this.chooseAddress.bind(this, ChooseAddress)}
                                      style={{
                                          height: 44,
                                          width: width,
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          borderBottomWidth: global.params.CellLineViewHight,
                                          borderBottomColor: global.params.CellRightTitleColor,
                                          flexDirection: 'row',
                                      }}>
                        <Text style={{
                            fontSize: global.params.CellTitleFontSize,
                            color: global.params.CellTitleColor,
                            marginLeft: 15,
                        }}>所在地</Text>

                        <View style={{marginRight: 15, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{
                                fontSize: global.params.CellRightTitleFontSize,
                                color: global.params.CellRightTitleColor,
                            }}>{this.state.userInfo ? this.state.userInfo.user.city.cityname : ' '}</Text>
                            <Image source={{uri: 'icon_cell_rightarrow'}}
                                   style={{marginLeft: 14, width: 8, height: 12}}/>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} onPress={this.chooseSchool.bind(this, ChooseSchool)} style={{
                        height: 44,
                        width: width,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomWidth: global.params.CellLineViewHight,
                        borderBottomColor: global.params.CellRightTitleColor,
                        flexDirection: 'row',
                    }}>
                        <Text style={{
                            fontSize: global.params.CellTitleFontSize,
                            color: global.params.CellTitleColor,
                            marginLeft: 15,
                        }}>{this.props.userInfo.user.teacher ? '当前角色' : '所在学校'}</Text>

                        <View style={{marginRight: 15, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{
                                fontSize: global.params.CellRightTitleFontSize,
                                color: global.params.CellRightTitleColor,
                            }}>{this.state.userInfo ? this.state.userInfo.user.educational : ' '}</Text>
                            <Image source={{uri: 'icon_cell_rightarrow'}}
                                   style={{marginLeft: 14, width: 8, height: 12}}/>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <MessageBarAlert ref="alert"/>
                <Prompt
                    title={'标题'}
                    visible={this.state.isShow}
                    placeholder="请输入昵称"
                    defaultValue=''
                    cancelText={'取消'}
                    submitText={'提交'}
                    onCancel={() => this.setState({
                        isShow: false,
                        message: "You cancelled"
                    })}
                    onSubmit={(value) => {
                        this.submitNickName(value + '')
                    }}
                />

                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={''}
                    options={this.state.actionOptions}
                    cancelButtonIndex={0}
                    // destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={this.handlePress}
                />
            </View>
        )
    }

    back() {
        this.props.navigator.pop()
    }
}


const styles = StyleSheet.create({})



