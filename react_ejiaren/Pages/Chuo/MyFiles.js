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
    Image
} from 'react-native'

import NavBar from '../Componnet/NavBar'
import OpenFile from 'react-native-doc-viewer';

var ChuoServers = require('./Servers/ChuoServers')
import {ListItem} from 'react-native-elements'

let {width} = Dimensions.get('window')

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class MyFiles extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: ds.cloneWithRows([]),
            data: {},
            animating: false,
            loaded: true,
            source:[]

        }
    }

    back() {
        this.props.navigator.pop()
    }


    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.getMyFiles();
        });
    }

    async getMyFiles() {
        let subList = await ChuoServers.getMyfiles(this.props.source.token, this.props.source.user.id);
        var newkey = Object.keys(subList).sort().reverse();
        this.setState({
            source:newkey,
            dataSource: newkey.length > 0 ? ds.cloneWithRows(newkey) : ds.cloneWithRows([]),
            data: subList,
        })
    }

    didSelectFile(file) {
        var fileType = file.type.replace('.', '');
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
                fileName: file.name,
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


    renderRow(rowData) {
        let subList = this.state.data[rowData];
        return (
            <View>
                <Text allowFontScaling={false} style={{
                    marginLeft: 15,
                    fontSize: 14,
                    marginTop: 10,
                    marginBottom: 10,
                    backgroundColor: 'rgb(244,244,244)'
                }}>{rowData}</Text>
                {subList.map((item, i) => {
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
                            key={i}
                            avatar={{uri: imgUrl}}
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
                                height: 44,
                                backgroundColor: 'white',
                                borderBottomWidth: global.params.CellLineViewHight,
                                borderBottomColor: global.params.CellRightTitleColor,
                            }}
                            titleStyle={{
                                fontSize: 11,
                            }}
                            rightIcon={<View/>}
                            onPress={this.didSelectFile.bind(this, item)}
                        />
                    )
                })}
            </View>
        )
    }

    loadD() {
        if (this.state.loaded) {
            if (this.state.source.length > 0) {
                return (
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)}
                        enableEmptySections={true}
                    />
                );
            } else {
                return (
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Image source={{uri: 'huojintou'}} style={{marginTop: 120, width: 120, height: 120}}/>
                        <Text allowFontScaling={false} style={{marginTop: 20, textAlign: 'center', color: 'rgb(111,111,111)', fontSize: 15}}>暂无记录 </Text>
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
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                <NavBar
                    title="所有资料"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                {this.loadD()}

            </View>
        )
    }
}

const styles = StyleSheet.create({

    cellStyle: {
        width: width,
        backgroundColor: 'white',

    },
    section: {
        height: 30,
        backgroundColor: 'green',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }

})
