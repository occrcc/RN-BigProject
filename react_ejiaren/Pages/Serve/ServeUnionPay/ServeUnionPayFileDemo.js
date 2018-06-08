import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    StatusBar,
    TouchableOpacity,
    Image,
    ScrollView,
    InteractionManager,
    Platform,
    Linking
} from 'react-native'

let {width, height} = Dimensions.get('window')
import NavBar from '../../Componnet/NavBar'


export default class ServeUnionPayFileDemo extends Component {
    constructor(props) {
        super(props)
        this.source = [
            {title:'护照',imgurl:'huzhao'},
            {title:'缴费证明',imgurl:'jiaofei'},
            {title:'i20',imgurl:'i20'},
            {title:'offer',imgurl:'offer'}
        ]
    }

    back() {
        this.props.navigator.pop();
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
                    title='上传文件示例'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <ScrollView>
                    {this.source.map((item,i)=>{
                        return (
                            <View key={i}>
                                <View style={{height:36,backgroundColor:'#f5f5f5',justifyContent:'center'}}>
                                    <Text style={{marginLeft:15,color:'rgb(144,144,144)',fontSize:15}}>{item.title}</Text>
                                </View>
                                <Image source={{uri:item.imgurl}} style={{margin:20,width:width-40,height:300,resizeMode:'stretch'}}/>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        )
    }
}

var styles = StyleSheet.create({

});