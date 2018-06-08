/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */


'use strict';

import React, {Component} from 'react'
import {
    View,
    ListView,
    StyleSheet,
    Dimensions,
    Text,
    Platform,
    InteractionManager,
    Image,
    RefreshControl,
    DeviceEventEmitter
} from 'react-native'

import NavBar from '../Componnet/NavBar'
import VisaNoInfo from "../Serve/VisaPay/VisaNoInfo";

var ChuoServers = require('./Servers/ChuoServers')
let {width} = Dimensions.get('window')

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ChuoNote extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 1,
            size: 10,
            loaded:false,
            dataSource: ds.cloneWithRows([]),
            source:[],
            totalPage: 0,
            isLoadingMore: false,
        }
    }

    back() {
        this.props.navigator.pop()
    }


    componentWillMount() {
        this.getSource();
    }

    async getSource() {
        var source = await ChuoServers.listNotesPageByGroupId(this.props.source.user.id, this.state.index, this.state.size,this.props.source.token);
        let newArr = source.list;
        console.log(newArr);
        this.setState({
            index: 1,
            totalPage: source.totalpage,
            loaded:true,
            source:newArr,
            dataSource: newArr.length > 0 ? ds.cloneWithRows(newArr) : ds.cloneWithRows([]),
        })
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(()=>{
            ChuoServers.updateNotesReadStatus(this.props.source.token).then(res => {
                DeviceEventEmitter.emit('notesUnReadCount',this.props.source);
            }).catch(err => {
                // console.log('error :' + err);
            })
        })
    }


    _loadMoreData() {
        this.setState({
            isLoadingMore: true
        }, () => {
            let index = this.state.index;
            index++;
            ChuoServers.listNotesPageByGroupId(this.props.source.user.id, index, this.state.size,this.props.source.token).then(res => {
                let newArr = res.list;
                let source = this.state.source;
                for (var i = 0; i < newArr.length; i++) {
                    source.push(newArr[i])
                }
                this.setState({
                    index: index,
                    source: source,
                    dataSource: ds.cloneWithRows(source),
                    isLoadingMore: false
                })
                // console.log('this.source.length:    ' + source.length);
            }).catch(err => {
                console.log('error :' + err);
            })
        })

    }

    _toEnd() {
        //ListView滚动到底部，根据是否正在加载更多 是否正在刷新 是否已加载全部来判断是否执行加载更多
        if (this.state.isLoadingMore || this.state.totalPage <= this.state.index) {
            return;
        }

        InteractionManager.runAfterInteractions(() => {
            // console.log("触发加载更多 toEnd() --> ");
            this._loadMoreData();
        });
    }

    _renderFooter() {
        if (this.state.totalPage === this.state.index) {
            if (this.state.source.length >= this.state.size) {
                return (
                    <View style={{width: width, height: 30, justifyContent: 'center', alignItems: 'center'}}>
                        <Text allowFontScaling={false} style={{fontSize: 12, color: 'rgb(188,188,188)'}}>我是有底线的</Text>
                    </View>
                )
            }
        } else {
            return (
                <View style={{width: width, height: 30, justifyContent: 'center', alignItems: 'center'}}>
                    <Text allowFontScaling={false} style={{fontSize: 12, color: 'rgb(188,188,188)'}}>加载更多</Text>
                </View>
            )
        }
    }

    renderRow(rowData) {
        return (
            <View style={styles.rowStye}>
                <View style={styles.contentStyle}>
                    <View style={styles.cellLeftViewStyle}>
                        <View>
                            <Text style={{lineHeight: 18, color: '#8A8A8A', fontSize: 14}}>{rowData.createTimeFormat}</Text>
                        </View>
                    </View>
                    <View style={styles.cellRightViewStyle}>
                        <View style={{width: width * 0.75 - 45,}}>
                            <View>
                                <Text style={{lineHeight: 18, color: '#414141', fontSize: 12}}>{rowData.content}</Text>
                            </View>
                            <View style={{backgroundColor: 'red', width: width * 0.75 - 45, marginTop: 8}}>
                                <Text style={{
                                    textAlign: 'right',
                                    backgroundColor: 'white',
                                    marginRight: 0,
                                    lineHeight: 18,
                                    color: '#adadad',
                                    fontSize: 12
                                }}>{rowData.posterNickName}</Text>
                            </View>
                            <View style={styles.verticalLineStyle}/>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    loadD() {
        if (this.state.loaded) {
            if (this.state.source.length > 0) {
                return (
                    <ListView
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={this.getSource.bind(this)}
                            />}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)}
                        enableEmptySections={true}
                        onEndReached={this._toEnd.bind(this)}
                        renderFooter={this._renderFooter.bind(this)}
                        onEndReachedThreshold={10}
                    />
                );
            } else {
                return (
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Image source={{uri: 'huojintou'}} style={{marginTop: 120, width: 120, height: 120}}/>
                        <Text allowFontScaling={false} style={{
                            marginTop: 20,
                            textAlign: 'center',
                            color: 'rgb(111,111,111)',
                            fontSize: 15
                        }}>暂无记录 </Text>
                    </View>
                )
            }
        } else {
            return (
                <Image source={{uri: 'scr_zixun'}} style={{width: width, height: width * 1.6}}/>
            );
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <NavBar
                    title="办理进度"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                {this.loadD()}
            </View>
        )
    }
}

const styles = StyleSheet.create({

    rowStye: {
        width: width,
    },
    contentStyle: {
        marginLeft: 15,
        width: width - 30,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        backgroundColor: 'white'
    },
    cellLeftViewStyle: {
        width: width * 0.25,
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },

    verticalLineStyle: {
        position: 'absolute',
        left: -14,
        width: 1,
        top: 0,
        bottom: 0,
        backgroundColor: '#f5f5f5'
    },

    cellRightViewStyle: {
        width: width * 0.75 - 30,
        marginTop: 20,
        marginBottom: 20,
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 15,

    }

})
