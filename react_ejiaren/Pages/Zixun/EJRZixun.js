import React, {Component} from 'react'
import {
    View,
    ListView,
    StyleSheet,
    Dimensions,
    StatusBar,
    PixelRatio
} from 'react-native'

import ScrollableTabView, {ScrollableTabBar} from "react-native-scrollable-tab-view"

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import NavBar from '../Componnet/NavBar'
var ZixunServers = require('./ZixunServers/ZixunServers')
import ZixunListView from './ZixunListView'

//import * as WeChat from 'react-native-wechat';

export default class EJRZixun extends Component {
    constructor(props) {
        super(props)
        this.state = {
            headerArr: [],
            dataSource: ds.cloneWithRows([
                {'name': 'nam1', 'eng_name': 'eng_name1'}, {'name': 'nam2', 'eng_name': 'eng_name2'}
            ]),
        }
    }

    componentWillMount() {
        ZixunServers.getHeadItems().then(res => {
            var sour = [];
            for (var i = 0;i <res.length; i++){
                var obj = res[i];
                if (parseInt(obj.id) === 107){
                    continue;
                }
                sour.push(obj);
            }
            this.setState({
                headerArr: sour
            })
        }).catch(err => {
        })
    }



    headerItems() {
        const {navigator} = this.props;
        if (this.state.headerArr.length > 0) {
            return (
                <ScrollableTabView
                    initialPage={0}
                    // scrollWithoutAnimation={true}
                    renderTabBar={()=>< ScrollableTabBar
                        underlineStyle={{backgroundColor:global.params.backgroundColor,height:0}}
                        activeTextColor='white'
                        textStyle={{ fontSize: 12, paddingTop:global.params.iPhoneXHeight ? 54 : 20}}
                        allowFontScaling={false}
                        backgroundColor={global.params.backgroundColor}
                        tabStyle={{paddingLeft:12,paddingRight:12,paddingBottom: 0}}
                        inactiveTextColor='#f5f5f5'

                    />}
                >
                    {
                        this.state.headerArr.map((item,i)=>{
                            return (
                                <View key={i} tabLabel={item.value} style={styles.itemLayout}>
                                    <ZixunListView  categraryId={item.id} navigator={navigator}/>
                                </View>
                            );
                        })
                    }
                </ScrollableTabView>
            )
        }
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white",}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                    backgroundColor={global.params.backgroundColor}

                />
                {/*<NavBar*/}
                    {/*title="资讯"*/}
                {/*/>*/}
                {this.headerItems()}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        height: 50
    },
    titleStyle: {
        fontSize: global.params.CellTitleFontSize,
    },
    subtitleStyle: {
        fontSize: global.params.CellRightTitleFontSize,
    },
    itemLayout:{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:global.params.iPhoneXHeight}
})