import React, {Component} from 'react'
import {
    Text,
    View,
    ListView,
    StatusBar,
    StyleSheet,
    InteractionManager,
    Dimensions,
    Image,
    TouchableOpacity,
    Platform,
    DeviceEventEmitter,
    RefreshControl,
    Animated,
    Easing
} from 'react-native'


var ChuoServers = require('./Servers/ChuoServers')
import storage from "../RNAsyncStorage";
import NavBar from '../Componnet/NavBar'
import {CachedImage} from 'react-native-img-cache'
import ChuoHtm from './ChuoHtml'
import _ from 'lodash'
import {ListItem, Button} from 'react-native-elements'
import OpenFile from 'react-native-doc-viewer';
import OftenInfo from '../Mine/MineOtherPages/OftenInfoVC'
// var RNFS = require('react-native-fs');
// var SavePath = Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath;
import ChuoDetail from './ChuoDetail'
import ChuoNote from './ChuoNote'
import Myfiles from './MyFiles'
import Alert from 'rnkit-alert-view'
import LoginVC from '../Main/LoginVC'
import {Navigator} from 'react-native-deprecated-custom-components'


let {width} = Dimensions.get('window')
var ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => {
        return r1 !== r2
    }
});

export default class EJRChuo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datas: [],
            index: 1,
            size: 20,
            dataSource: ds.cloneWithRows([]),
            isLoad: false,
            openContentView: false,
            rowId: -1,
            openRow: [],
            selectRowData: null,
            isLoadMoreView: false,
            userInfo: null,
            isShowTopTag: true,
            isShowMenu: 0,
            animationMenuWidth: new Animated.Value(),
            springValue: new Animated.Value(1),
            animationRowId: 0,
            isLoadingMore: false,
            totalPage: 0,
            notesImgName:'chuo_rig'
        }
    }

    componentWillMount() {
        this.getUserInfo();
        InteractionManager.runAfterInteractions(() => {
            storage.load({key: 'firstStart'}).then(() => {
                this.setState({isShowTopTag: false})
            }).catch(err => {
                this.setState({isShowTopTag: true})
            })
        });
    }


    componentDidMount() {
        this.ChuoUpLoadList = DeviceEventEmitter.addListener('ChuoUpLoadList', (isExit) => {
            InteractionManager.runAfterInteractions(() => {
                this.getUserInfo(isExit);
            });
        });
        this.RefreshBadge = DeviceEventEmitter.addListener('refreshBadge', () => {
            this.refreshBadge();
        });

        this.notesUnReadCount = DeviceEventEmitter.addListener('notesUnReadCount', (res) => {
            this.getNotesUnReadCount(res);
        });


        this.isShowTopTips = DeviceEventEmitter.addListener('isShowTopTips', () => {
            storage.load({key: 'firstStart'}).then(() => {
                this.setState({isShowTopTag: false})
            }).catch(err => {
                // console.log('第一次启动')
                this.setState({isShowTopTag: true})
            })
        })

        this.ChuoIndexReplyChange = DeviceEventEmitter.addListener('ChuoIndexReplyChange', (rowData) => {

            //判断原先的消息是否是没有reply的，如果没有，需要增加一条，让他出现展开效果
            var newArr = this.state.datas.filter((item) => {
                return item.id == rowData.parentId
            });

            let size = 1;
            if (newArr.length > 0) {
                size = newArr[0].replyInfo.length;
            }

            if (this.inArr(this.state.openRow, rowData.parentId) || size == 0) {
                //如果当前id是展开的,查找list，更新 replyMessageList数据
                var messages = _.cloneDeep(this.state.datas);
                messages.map(item => {
                    if (item.id == rowData.parentId) {
                        item.replyInfo.splice(0, 0, rowData);
                        item.readedTimeFormat = '111';
                        this.setState({
                            datas: messages,
                            dataSource: ds.cloneWithRows(messages),

                        })

                    }
                })
            }
        })
    }

    componentWillUnmount() {
        this.RefreshBadge.remove();
        this.ChuoUpLoadList.remove();
        this.isShowTopTips.remove();
        this.ChuoIndexReplyChange.remove();
        this.notesUnReadCount.remove();
    }


    //刷新badge
    async refreshBadge() {
        let userInfo = await storage.load({key: 'userInfo'});
        ChuoServers.getNavigatorBadge(userInfo.token).then(res => {
            DeviceEventEmitter.emit('upLoadNavigator', res);
        }).catch(err => {
        });
    }

    getNotesUnReadCount(userInfo){
        if (!userInfo) return;
        ChuoServers.getNotesUnReadCount(userInfo.token).then(res => {

            console.log('rererererer',res)

            if (parseInt(res.t) > 0){
                this.setState({notesImgName:'chuo_rig_note'})
            }else {
                this.setState({notesImgName:'chuo_rig'})
            }
        }).catch(err => {
            console.log('error :' + err);
        })
    }

    async getUserInfo(isExit) {
        if (isExit) {
            // console.log("退出登陆   " + JSON.stringify(this.state.userInfo));
            this.setState({
                datas: [],
                dataSource: ds.cloneWithRows([]),
                isLoad: true,
                userInfo: null,
                isShowMenu: 0,
            })
            return;
        }
        let userInfo = await storage.load({key: 'userInfo'});
        if (userInfo) {
            this.getNotesUnReadCount(userInfo);
            let resout = await ChuoServers.getChuoList(userInfo.token, userInfo.user.id, 1, 20);
            // console.log(resout);
            ChuoServers.getNavigatorBadge(userInfo.token).then(res => {
                DeviceEventEmitter.emit('upLoadNavigator', res);
            }).catch(err => {
                // console.log(err);
            });
            this.setState({
                datas: resout.messages.list,
                dataSource: ds.cloneWithRows(resout.messages.list),
                isLoad: true,
                userInfo: userInfo,
                isShowMenu: 0,
                totalPage: resout.messages.totalpage,
                index: 1,
            })
        }
    }

    didSelectLinkBtn(rowData) {
        this.props.navigator.push({
            component: ChuoHtm,
            params: {webUrl: rowData.link, title: rowData.urlTitle},
        })
    }

    pushChuoDetail(rowData) {
        this.props.navigator.push({
            component: ChuoDetail,
            params: {rowData: rowData},
        })
    }

    pushOftenInfo() {
        this.props.navigator.push({
            component: OftenInfo,
            params: {userInfo: this.state.userInfo}
        })
    }


    isShowMoreBtn(rowData) {
        if (rowData.replyInfo.length > 0 || rowData.attachmentList.length > 0) {
            if (this.inArr(this.state.openRow, rowData.id)) {
                return <View style={{
                    backgroundColor: 'transparent',
                    flex: 1
                }}/>
            } else {
                return (
                    <TouchableOpacity style={styles.showBtnStyle} onPress={this.loadMore.bind(this, rowData)}>
                        <Text allowFontScaling={false} style={{
                            color: global.params.backgroundColor,
                            fontSize: 13,
                            flex: 1
                        }}>
                            显示更多</Text>
                    </TouchableOpacity>);
            }

        } else {
            return (
                <View style={{
                    backgroundColor: 'transparent',
                    flex: 1
                }}/>
            )
        }
    }

    isShowMoreSqBtn(rowData) {
        if (rowData.replyInfo.length > 0 || rowData.attachmentList.length > 0) {
            if (this.inArr(this.state.openRow, rowData.id)) {
                return (
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <TouchableOpacity style={styles.showBtnStyle} onPress={this.closeMore.bind(this, rowData)}>
                            <Text allowFontScaling={false} style={{
                                color: global.params.backgroundColor,
                                fontSize: 13,
                                flex: 1
                            }}>
                                收起^</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
        }
    }

    loadMore(rowData) {
        this.getMessagesReply(rowData);
    }

    async getMessagesReply(rowData) {
        let userInfo = await storage.load({key: 'userInfo'});
        let subList = await ChuoServers.getMyFileList(rowData.id, userInfo.token);
        let newData = _.cloneDeep(this.state.datas);
        newData.map((item) => {
            if (item.id == rowData.id) {
                item.replyInfo = subList.list;
            }
        })

        let openRowNew = this.state.openRow;
        openRowNew.push(rowData.id);
        this.setState({
            openRow: openRowNew,
            datas: newData,
            dataSource: ds.cloneWithRows(newData),
        })
    }

    closeMore(rowData) {
        let newData = _.cloneDeep(this.state.datas);
        let openRowNew = this.state.openRow;
        this.removeByValue(openRowNew, rowData.id);
        this.setState({
            openRow: openRowNew,
            dataSource: ds.cloneWithRows(newData),
        })
    }

    inArr(arr, val) {
        let found = false;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === val) {
                found = true;
                break;
            }
        }
        return found;
    }

    removeByValue(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === val) {
                arr.splice(i, 1);
                break;
            }
        }
    }

    isShowNewImg(rowData) {
        // if ((rowData.readedTimeFormat.length < 1 && rowData.canReply === false) || (rowData.canReply && rowData.replyTimeFormat.length < 1)) {
        //     return (<Image source={{uri: 'noti_new'}} style={styles.newImageStyle}/>)
        // }
        if (rowData.readedTimeFormat.length < 1) {
            return (<Image source={{uri: 'noti_new'}} style={styles.newImageStyle}/>)
        }
    }

    isShowContentLabOrLinkBtn(rowData) {
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
                <Text allowFontScaling={false} style={styles.contentBodyStyle} numberOfLines={0}>{rowData.body}</Text>)
        }
    }

    curDateFormat() {
        var date = new Date();
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    showMenuBtns(rowData) {
        if (rowData.id === this.state.isShowMenu || rowData.id === this.state.animationRowId) {
            return (
                <Animated.View style={{
                    width: this.state.animationMenuWidth,
                    height: 32,
                    borderRadius: 17,
                    backgroundColor: 'rgb(222,222,222)',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginRight: 5,
                    overflow: 'hidden'
                }}>
                    <Button
                        icon={{name: 'do-not-disturb-on', color: 'rgb(190,57,161)'}}
                        title='再等等'
                        buttonStyle={{width: 60, height: 32, marginLeft: -15, backgroundColor: 'rgba(1,1,1,0)'}}
                        textStyle={{fontSize: 10, marginLeft: -7, color: 'rgb(190,57,161)'}}
                        onPress={() => {
                            // console.log('再等等');
                            this.setState({animationRowId: rowData.id});
                            this.state.animationMenuWidth.setValue(115); //Step 3
                            Animated.timing(
                                this.state.animationMenuWidth,
                                {
                                    toValue: 0,
                                    duration: 280,
                                    easing: Easing.linear,// 线性的渐变函数
                                }
                            ).start(() => this.setState({isShowMenu: 0, animationRowId: 0}));
                        }}
                    />
                    <Button
                        icon={{name: 'check-circle', color: 'rgb(0,177,251)'}}
                        title='收到'
                        buttonStyle={{width: 60, height: 32, marginLeft: -35, backgroundColor: 'rgba(1,1,1,0)'}}
                        textStyle={{fontSize: 10, marginLeft: -7, color: 'rgb(0,177,251)'}}
                        onPress={
                            () => {
                                // console.log('收到' +new Date());
                                ChuoServers.readMessage(this.state.userInfo.token, rowData.id).then(res => {
                                    let newData = this.state.datas;
                                    newData.map((item) => {
                                        if (item.id == rowData.id) {
                                            item.readedTimeFormat = this.curDateFormat()
                                        }
                                    })

                                    this.setState({
                                        isShowMenu: 0,
                                        animationRowId: rowData.id,
                                        dataSource: ds.cloneWithRows(_.cloneDeep(newData)),
                                        datas: newData
                                    })
                                    DeviceEventEmitter.emit('refreshBadge');
                                    this.state.springValue.setValue(0.3)
                                    Animated.spring(
                                        this.state.springValue,
                                        {
                                            toValue: 1,
                                            friction: 3
                                        }
                                    ).start()
                                }).catch(err => {
                                })
                            }
                        }
                    />
                </Animated.View>
            )
        }
    }


    renderBtnImage(rowData) {
        if (rowData.id === this.state.animationRowId) {
            // console.log('this.state.animationRowId:'+this.state.animationRowId)
            return (
                <Animated.Image source={{uri: 'shure_noti'}} style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    transform: [{scale: this.state.springValue}]
                }}/>
            )
        } else {
            return (
                <Image source={{uri: 'shure_noti'}} style={{width: 20, height: 20, borderRadius: 10}}/>
            )

        }
    }

    footBtnStyle(rowData) {
        if (rowData.canReply === false && rowData.shouldFeeback === false && rowData.readedTimeFormat.length < 1) {
            return (
                <View style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginRight: 15,
                    height: 50,
                    width: width,
                    justifyContent: 'flex-end',
                }}>
                    {this.showMenuBtns(rowData)}
                    <TouchableOpacity style={{
                        width: 60,
                        marginRight: 15,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }} onPress={() => {
                        let newData = _.cloneDeep(this.state.datas);
                        this.setState({
                            isShowMenu: rowData.id,
                            dataSource: ds.cloneWithRows(newData),
                        })

                        this.state.animationMenuWidth.setValue(0); //Step 3
                        Animated.spring( //Step 4
                            this.state.animationMenuWidth,
                            {
                                toValue: 115
                            }
                        ).start();

                    }}>
                        <Text allowFontScaling={false} style={{marginRight: 5}}>{'请点'}</Text>
                        <Image source={{uri: 'ds'}} style={{width: 20, height: 20, borderRadius: 10}}/>
                    </TouchableOpacity>


                </View>

            )
        } else if (rowData.canReply === false && rowData.shouldFeeback === false && rowData.readedTimeFormat.length > 0) {
            return (
                <View style={{
                    justifyContent: 'flex-end',
                    marginLeft: 15, height: 50,
                    width: width - 34,
                    alignItems: 'center',
                    flexDirection: 'row',
                }}>
                    <Text allowFontScaling={false} style={{marginRight: 5, color: 'rgb(111,111,111)'}}>{'已阅'}</Text>
                    {this.renderBtnImage(rowData)}
                    {/*<Image source={{uri: 'shure_noti'}} style={{width: 20, height: 20, borderRadius: 10}}/>*/}
                </View>
            )
        } else if (rowData.canReply || rowData.shouldFeeback) {
            return (
                <TouchableOpacity style={{
                    justifyContent: 'center',
                    marginTop: 15,
                    marginLeft: width - 100,
                    height: 32,
                    width: 80,
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: global.params.backgroundColor,
                    borderRadius: 4
                }} onPress={this.pushChuoDetail.bind(this, rowData)}>
                    <Text allowFontScaling={false}
                          style={{marginLeft: 5, marginRight: 5, color: 'white', fontSize: 13}}>{'去反馈'}</Text>
                </TouchableOpacity>
            )
        }
    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <View style={styles.chuoCellStyle} key={sectionID}>
                <View style={styles.userStyle}>
                    <CachedImage source={{uri: rowData.posterAvar}} style={styles.iconImgStyle}/>
                    <View style={styles.teacherNameStyle}>
                        <Text allowFontScaling={false}>{rowData.posterNickName} </Text>
                    </View>
                </View>
                <Image source={{uri: 'sanjiao'}} style={{marginTop: -10, marginLeft: 70, width: 18, height: 18}}/>
                <View style={styles.contentViewStyle}>
                    <Text numberOfLines={0} allowFontScaling={false}
                          style={styles.contentTitleStyle}>{rowData.title}</Text>
                    {this.isShowContentLabOrLinkBtn(rowData)}
                    {this.isShowNewImg(rowData)}
                    {this.showTeacherItems(rowData)}
                    {/*{this.subItems(rowData)}*/}
                    <View style={styles.createTimeStyle}>
                        {this.isShowMoreBtn(rowData)}
                        <Text allowFontScaling={false} style={{
                            height: 22,
                            color: 'rgb(188,188,188)',
                            fontSize: 11
                        }}>{rowData.createTimeFormat}</Text>

                    </View>
                </View>
                {this.subItems(rowData)}
                {this.isShowMoreSqBtn(rowData)}
                {this.footBtnStyle(rowData)}
            </View>
        )
    }

    showTeacherItems(rowData) {
        if (this.inArr(this.state.openRow, rowData.id) && rowData.attachmentList.length > 0) {
            return (
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
                    // console.log(url)
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
                    // console.error(error);
                } else {
                    // console.log(url)
                }
            })
        }
    }


    filterReplyInfo(arr, type) {
        return arr.filter((item) => {
            return item.type == type
        })
    }

    myFilesTitle(myFilesAry) {
        if (myFilesAry.length > 0) {
            return (
                <Text allowFontScaling={false}
                      style={{height: 24, paddingLeft: 5, marginTop: 15}}>我上传的资料({myFilesAry.length})</Text>
            )
        }
    }

    myMessageTitle(myMessageAry) {
        if (myMessageAry.length > 0) {
            return (
                <Text allowFontScaling={false}
                      style={{height: 24, marginTop: 15, paddingLeft: 5}}>我的留言({myMessageAry.length})</Text>
            )
        }
    }

    subItems(rowData) {
        if (this.inArr(this.state.openRow, rowData.id)) {
            return (
                <View style={{marginBottom: 10, marginLeft: 15, flex: 1, marginRight: 15}}>
                    {this.myFilesTitle(this.filterReplyInfo(rowData.replyInfo, 1))}
                    {this.filterReplyInfo(rowData.replyInfo, 1).map((item, i) => {
                        let imgType = item.fileType.toLowerCase().replace('.', '');
                        let imgUrl = '';
                        if (imgType === 'xlsx' || imgType === 'xls' || imgType === '.xlsx') {
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
                                    marginLeft: 15,
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

    showTopTips() {
        if (this.state.isShowTopTag && this.state.userInfo) {
            return (
                <TouchableOpacity activeOpacity={0.8} style={styles.tipsStyle}
                                  onPress={
                                      this.pushOftenInfo.bind(this)
                                  }
                >
                    <Image source={{uri: 'volume'}} style={{height: 18, width: 18, marginLeft: 15}}/>
                    <Text allowFontScaling={false} style={{color: 'white', marginLeft: 8, fontSize: 12,}}>请完善您的真实信息，以便能正常接收老师发的通知
                        >></Text>

                </TouchableOpacity>
            )
        }
    }


    _loadMoreData() {
        this.setState({
            isLoadingMore: true
        }, () => {
            let index = this.state.index;
            index++;
            ChuoServers.getChuoListPages(this.state.userInfo.token, this.state.userInfo.user.id, index, this.state.size).then(res => {


                let datas = this.state.datas;
                for (var i = 0; i < res.list.length; i++) {
                    datas.push(res.list[i])
                }

                this.setState({
                    index: index,
                    datas: datas,
                    dataSource: ds.cloneWithRows(datas),
                    isLoadingMore: false
                })
            }).catch(err => {
                console.log('err: ' + err);
            })
        })
    }

    _toEnd() {
        //ListView滚动到底部，根据是否正在加载更多 是否正在刷新 是否已加载全部来判断是否执行加载更多
        if (this.state.isLoadingMore || this.state.totalPage <= this.state.index) {
            return;
        }

        InteractionManager.runAfterInteractions(() => {
            console.log("触发加载更多 toEnd() --> ");
            this._loadMoreData();
        });
    }

    _renderFooter() {
        if (this.state.totalPage == this.state.index) {
            return (
                <View style={{width: width, height: 30, justifyContent: 'center', alignItems: 'center'}}>
                    <Text allowFontScaling={false} style={{fontSize: 12, color: 'rgb(188,188,188)'}}>我是有底线的</Text>
                </View>
            )
        } else {
            return (
                <View style={{width: width, height: 30, justifyContent: 'center', alignItems: 'center'}}>
                    <Text allowFontScaling={false} style={{fontSize: 12, color: 'rgb(188,188,188)'}}>加载更多</Text>
                </View>
            )
        }
    }


    listItems() {
        let source = this.state.datas;
        if (source.length > 0) {
            return (
                <View style={{flex: 1}}>
                    {this.showTopTips()}
                    <ListView
                        style={{marginBottom: global.params.iPhoneXHeight}}
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={this.getUserInfo.bind(this, false)}
                            />}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)}
                        enableEmptySections={true}
                        onEndReached={this._toEnd.bind(this)}
                        renderFooter={this._renderFooter.bind(this)}
                        onEndReachedThreshold={10}
                    />
                </View>
            )
        } else {
            return (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    {this.showTopTips()}
                    <Image source={{uri: 'chuo'}} style={{width: 325, height: 225, marginTop: 60}}/>
                    <Image source={{uri: 'chuo_text'}} style={{width: 243, height: 24, marginTop: 20}}/>
                    <Text allowFontScaling={false} style={{color: 'rgb(177,177,177)', fontSize: 13, marginTop: 15}}>(老师发的通知都在这里显示)</Text>
                    {this.showLoginBtn()}
                </View>
            )
        }
    }

    showLoginBtn() {
        if (this.state.userInfo === null) {
            return (
                <Button
                    icon={{name: 'send', type: 'font-awesome'}}
                    title='去登录'
                    buttonStyle={{
                        marginTop: 60,
                        width: 120,
                        height: 40,
                        borderRadius: 4,
                        backgroundColor: global.params.backgroundColor
                    }}
                    textStyle={{fontSize: 14}}
                    onPress={() => {
                        this.goLogin(LoginVC);
                    }}
                />
            )
        }
    }

    goLogin(name) {
        this.props.navigator.push({
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            component: name,
            title: ''
        });
    }

    rightPress(name) {
        if (this.state.userInfo) {
            this.props.navigator.push({
                component: name,
                params: {source: this.state.userInfo},
            })
        } else {
            Alert.alert(
                '提示', '没有检测到您的账号', [
                    {text: '以后再说', onPress: () => console.log('以后再说')},
                    {
                        text: '去登陆', onPress: () => {
                        this.goLogin(LoginVC)
                    }
                    },
                ],
            );
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f4f4f4",}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                    backgroundColor={global.params.backgroundColor}
                />

                <NavBar
                    title="Chuo"
                    rightIcon="fileicon"
                    rightPress={this.rightPress.bind(this, Myfiles)}
                    rightIconOther={this.state.notesImgName}
                    rightOtherPress={this.rightPress.bind(this, ChuoNote)}
                />
                {this.listItems()}
            </View>
        )
    }
}


const styles = StyleSheet.create({

    chuoCellStyle: {
        width: width,
        backgroundColor: 'white',
        marginBottom: 10,
        paddingBottom: 10,
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
        borderRadius: 8
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
        height: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,

    },

    showBtnStyle: {
        marginLeft: 15,
        width: 100,
        justifyContent: 'center'
    },

    newImageStyle: {
        position: 'absolute',
        width: 22,
        height: 22,
        right: 0,
        top: 0,
        borderRadius: 8
    },

    tipsStyle: {
        flexDirection: 'row',
        width: width,
        height: 34,
        backgroundColor: 'rgb(248,188,73)',
        alignItems: 'center',

    }
})