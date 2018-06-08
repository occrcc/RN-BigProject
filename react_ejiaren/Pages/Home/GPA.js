import React, {Component} from 'react'
import {
    View,
    ListView,
    StyleSheet,
    Dimensions,
    StatusBar,
    PixelRatio,
    TouchableOpacity,
    Text
} from 'react-native'
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import NavBar from '../Componnet/NavBar'
let {width} = Dimensions.get('window')
import GPACalculate from './GPACalculate'

export default class GPA extends Component {
    constructor(props) {
        super(props)
        this.arr = [{title:'百分制',type:100},{title:'五分制',type:5},{title:'四分制',type:4}];
    }

    back() {
        this.props.navigator.pop()
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f5f5f5"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                />
                <NavBar
                    title='GPA计算'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                {this.arr.map((item,i)=>{
                    return (
                        <TouchableOpacity key={i} activeOpacity={0.8} style={styles.itemStyle} onPress={()=>{
                            this.props.navigator.push({
                                component: GPACalculate,
                                params:{item:item}
                            });
                        }}>
                            <Text allowFontScaling={false} style={{fontSize:17}}>{item.title}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemStyle:{
        width:width - 40,
        height:90,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:20,
        backgroundColor:'white',
        borderRadius:4,
        marginTop:44,
    }
})