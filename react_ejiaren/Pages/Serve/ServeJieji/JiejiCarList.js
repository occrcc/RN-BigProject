import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    Image,
    StatusBar,
    TouchableOpacity,
    ScrollView

} from 'react-native'

let {width, height} = Dimensions.get('window')
import NavBar from '../../Componnet/NavBar'
var JiejiApi = require('./JiejiServe/JiejiApi');
import JiejiSubmit from './JiejiSubmitOrder'
import Alert from 'rnkit-alert-view';

var submitObj = {};
export default class JiejiCarList extends Component {
    constructor(props) {
        super(props)
    }

    back() {
        this.props.navigator.pop()
    }

    componentWillUnmount() {
        submitObj={};
    }

    selectRow(item){
        submitObj = this.props.submitObj;
        submitObj['carSize'] = item.type;
        submitObj['carModelId'] = item.id;

        console.log(submitObj);

        JiejiApi.jiejiSubmit(submitObj).then(res=>{
            if(res.state){
            }else {
                this.props.navigator.push({
                    component: JiejiSubmit,
                    params: {res:res},
                })
            }
        }).catch(error=>{
            console.log('err: ' + error);
        })
    }


    items(){
        return(
            <View>
                {this.props.carList.map((item,i)=>{
                    return(
                        <TouchableOpacity activeOpacity={0.8} key={i} style={styles.rowItemStyle}
                                          onPress={this.selectRow.bind(this,item)}
                        >
                            <Text style={{fontSize:17,marginTop:8,marginBottom:4}}>{item.car_comfort_level}</Text>
                            <Text style={{fontSize:14,color:'rgb(188,188,188)',marginBottom:4}}>{item.car_models}</Text>
                            <Image source={{uri:item.car_image}} style={styles.rowImageStyle}/>
                            <View style={styles.footViewStyle} >
                                <Image source={{uri:'renzuo'}} style={{marginBottom:4,resizeMode:'stretch',marginRight:4,width:14,height:16}}/>
                                <Text style={{marginBottom:4,fontSize:14,color:'rgb(188,188,188)',marginRight:14 }}>{item.people + '人'}</Text>
                                <Image source={{uri:'baobao'}} style={{resizeMode:'stretch',marginBottom:4,marginRight:4,width:14,height:14}}/>
                                <Text style={{marginBottom:4,fontSize:14,color:'rgb(188,188,188)',marginRight:14 }}>{item.luggage_desc}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                    backgroundColor={global.params.backgroundColor}
                />
                <NavBar
                    title='选择车型'
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                    rightTitle='行李说明'
                    rightPress={()=>{
                        Alert.alert(
                            '人数行李说明', '\n1、目前页面显示人数均为可乘坐人数的最高上限，儿童婴儿同样占座； \n2、每减少一位乘客，可相应增加1件行李。', [
                                {text: '确定'},
                            ],
                        );
                    }}
                />
                <ScrollView>
                    {this.items()}
                    <View style={{marginBottom:20,marginTop:20,width:width,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{textAlign:'center',fontSize:14, color:'rgb(188,188,188)'}}>以上图片仅供参考</Text>
                    </View>
                </ScrollView>

            </View>
        )
    }
}

var styles = StyleSheet.create({

    rowItemStyle:{
        marginLeft:14,
        marginRight:14,
    },

    rowImageStyle:{
        width:width - 28,
        height:140,
        marginBottom:4
    },
    footViewStyle:{
        flexDirection:'row',
        marginTop:4,
        alignItems:'center',
        borderBottomColor:'rgb(222,222,222)',
        borderBottomWidth:10,
    }

});