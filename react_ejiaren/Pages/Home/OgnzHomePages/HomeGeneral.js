import React, {Component} from 'react'
import {
    View,
    ListView,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
    RefreshControl,
    InteractionManager,
    StatusBar
} from 'react-native'


import ZixunWeb from '../../Zixun/ZixunHtmlView'

var ZixunServers = require('../../Zixun/ZixunServers/ZixunServers')
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let {width} = Dimensions.get('window')
import {CachedImage} from 'react-native-img-cache';
import NavBar from '../../Componnet/NavBar'

export default class HomeGeneral extends Component {
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

    componentWillMount() {
        this.getSource();
    }

    async getSource() {
        var source = await ZixunServers.getArticleListById(this.props.categraryId, this.state.index, this.state.size);
        let newArr = source.list.list;
        console.log(newArr);
        this.setState({
            index: 1,
            totalPage: source.list.totalpage,
            loaded:true,
            source:newArr,
            dataSource: newArr.length > 0 ? ds.cloneWithRows(newArr) : ds.cloneWithRows([]),
        })
    }

    selectRow(soure) {
        this.props.navigator.push({
            component: ZixunWeb,
            params: {sorce: soure},
        })
    }

    renderRow(rowData, sectionID, rowID) {
        var rowDesc = rowData.desc.replace(/^[\s\n\t]+/g, "");
        return (
            <TouchableOpacity key={rowID} activeOpacity={0.9} style={{
                flexDirection: 'row', backgroundColor: 'white',
                borderBottomWidth: 1,
                borderBottomColor: 'rgb(244,244,244)'
            }}
                              onPress={this.selectRow.bind(this, rowData)}>
                <CachedImage source={{uri: rowData.pic1}}
                             style={{marginTop: 14, marginLeft: 14, width: 110, height: 73, marginBottom: 14}}/>
                <View style={{marginTop: 14, marginRight: 14, marginLeft: 14, width: width - 160, height: 73}}>
                    <View style={{height: 55}}>
                        <Text allowFontScaling={false} numberOfLines={2} style={{color: '#282828', fontSize: 16}}>{rowData.title}</Text>
                    </View>
                    <View style={{height: 18,}}>
                        <Text allowFontScaling={false} numberOfLines={1}
                              style={{marginBottom: 0, color: 'rgb(177,177,177)', fontSize: 13}}>{rowDesc}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    back() {
        this.props.navigator.pop()
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
                    title={this.props.title}
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                {this.loadD()}
            </View>
        )
    }

    _loadMoreData() {
        this.setState({
            isLoadingMore: true
        }, () => {
            let index = this.state.index;
            index++;
            ZixunServers.getArticleListById(this.props.categraryId, index, this.state.size).then(res => {
                let newArr = res.list.list;
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
                console.log('this.source.length:    ' + source.length);
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
            console.log("触发加载更多 toEnd() --> ");
            this._loadMoreData();
        });
    }

    _renderFooter() {
        if (this.state.totalPage === this.state.index  ) {
            if (this.state.source.length >= this.state.size){
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

    loadD(){
        if (this.state.loaded){
            if(this.state.source.length > 0){
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
            }else {
                return (
                    <View style={{flex:1,alignItems:'center'}}>
                        <Image source={{uri:'huojintou'}} style={{marginTop:120,width:120,height:120}}/>
                        <Text style={{marginTop:20,textAlign:'center',color:'rgb(111,111,111)',fontSize:15}}>暂无干货，敬请期待。  </Text>
                    </View>
                )
            }
        }else{
            return (
                <Image source={{uri: 'scr_zixun'}} style={{width:width,height:width*1.6}}/>
            );
        }
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        height: 100,
        width: width,
        borderBottomWidth: global.params.CellLineViewHight,
        borderBottomColor: global.params.CellRightTitleColor
    },
    titleStyle: {
        marginBottom: 5,
        fontSize: 12,
        color: '#343434'
    },
    subtitleStyle: {
        marginTop: 3,
        fontSize: 11,
        fontStyle: 'normal',
        fontWeight: 'normal',
        color: '#727272',
    },
    avatarStyle: {
        flex: 1,
        width: 100,
        height: 80,
        borderRadius: 5,
        backgroundColor: 'rgb(244,244,244)'

    },
    avatarContainerStyle: {
        width: 100,
        height: 80,
    }
})