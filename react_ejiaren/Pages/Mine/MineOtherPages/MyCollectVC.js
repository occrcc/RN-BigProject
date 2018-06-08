import React, {Component} from 'react'
import {
    View,
    ListView,
    StyleSheet,
    Dimensions,
    StatusBar,
    Image,
    Text
} from 'react-native'


import { ListItem} from 'react-native-elements'
import ZixunWeb from '../../Zixun/ZixunHtmlView'
var UserInfoServes = require('../Servers/UserInfoServes')
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let {width} = Dimensions.get('window')
import NavBar from '../../Componnet/NavBar'

export default class MyCollectVC extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categraryId: null,
            index: 1,
            size: 10,
            sourceAry:[],
            dataSource: ds.cloneWithRows([
            ]),
        }
    }

    componentWillMount() {
        this.getSource();
    }

    getSource() {
        UserInfoServes.getMyCollectList(this.props.userInfo.token).then(res=>{
            let newArr = res.list;
            console.log(newArr);
            this.setState({
                sourceAry:newArr,
                dataSource: newArr.length > 0 ? ds.cloneWithRows(newArr) : ds.cloneWithRows([]),
            })
        }).catch(error=>{
            console.log(error);
        });
    }

    selectRow(soure){
        this.props.navigator.push({
            component: ZixunWeb,
            params: {sorce:soure},
        })
    }

    back(){
        this.props.navigator.pop()
    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <ListItem
                onPress={this.selectRow.bind(this,rowData)}
                subtitleNumberOfLines={2}
                avatarOverlayContainerStyle={{backgroundColor:'rgba(255,255,255,0)'}}
                avatar={{uri:rowData.pic}}
                avatarStyle={styles.avatarStyle}
                avatarContainerStyle={styles.avatarContainerStyle}
                key={rowID}
                rightIcon={ <View/> }
                title={rowData.title}
                containerStyle={styles.containerStyle}
                titleStyle={styles.titleStyle}
                subtitleStyle={styles.subtitleStyle}
                subtitle={rowData.desc}
            />
        )
    }

    mainView(){
        if (this.state.sourceAry.length > 0) {
            return (
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    enableEmptySections={true}
                />
            )
        }else {
            return (
                <View style={{flex:1,alignItems:'center'}}>
                    <Image source={{uri:'no_image'}} style={{marginTop:110,width:148,height:90}}/>
                    <Text style={{marginTop:20,textAlign:'center',color:'rgb(111,111,111)',fontSize:15}}>你还没有记录</Text>
                </View>
            )
        }
    }

    render(){
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>

                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                <NavBar
                    title="我的收藏"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />

                {this.mainView()}


            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerStyle:{
        height:100,
        width:width,
        borderBottomWidth: global.params.CellLineViewHight,
        borderBottomColor: global.params.CellRightTitleColor
    },
    titleStyle:{
        marginBottom:5,
        fontSize:12,
        color:'#343434'
    },
    subtitleStyle:{
        marginTop:3,
        fontSize:11,
        fontStyle:'normal',
        fontWeight:'normal',
        color:'#727272',
    },
    avatarStyle:{
        flex:1,
        width:100,
        height:80,
        borderRadius:5
    },
    avatarContainerStyle:{
        width:100,
        height:80,
    }
})