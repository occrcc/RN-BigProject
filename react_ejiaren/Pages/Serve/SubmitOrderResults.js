import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    Image,
    StatusBar,
    TouchableOpacity,
    Linking
} from 'react-native'

let {width} = Dimensions.get('window')
import NavBar from '../Componnet/NavBar'


export default class SubmitOrderResults extends Component {
    constructor(props) {
        super(props)
    }

    back() {
        this.props.popToTop ? this.props.navigator.popToTop() : this.props.navigator.pop();
    }

    keFu() {
        let url = 'tel: ' + global.kefuInfo.kefuPhone;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    kefuView(){
        if (this.props.notice) {
            return (
                <View style={styles.kefuViewStyle}>
                    <View style={styles.kefuInfoViewStyle}>
                        <Image source={{uri:'chengling'}} style={styles.kefuImageStyle}/>
                        <View>
                            <Text style={{marginTop:26,marginBottom:8,color:'#4a4a4a',fontSize:16}}>{global.kefuInfo.kefuName}</Text>
                            <Text style={{color:'#969696',fontSize:13}}>您的专属客服</Text>
                        </View>
                    </View>
                    <Text style={{marginLeft:15,marginRight:15,marginTop:23,color:'#727272',fontSize:15,marginBottom:20}}>{this.props.notice}</Text>
                    <TouchableOpacity activeOpacity={0.8} style={styles.phoneBtnStyle} onPress={this.keFu.bind(this)}>
                        <Image source={{uri:'icon_kefuphone'}} style={{width:16,height:18}}/>
                        <Text style={{color:'white',fontSize:15,marginLeft:8}}>{global.kefuInfo.kefuPhone}</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "rgb(245,245,245)"}}>
                <StatusBar
                    barStyle='light-content'
                    animated={true}
                    hidden={false}
                    backgroundColor={global.params.backgroundColor}
                />
                <NavBar
                    leftIcon={this.props.popToTop ? null : 'ios-arrow-back'}
                    leftTitle={this.props.popToTop ? '完成' : null}
                    leftPress={this.back.bind(this)}
                />
                <View style={styles.headViewStyle}>
                    <Image source={{uri: this.props.isOk ? 'icon_ok' : 'icon_dingwei'}} style={styles.headIconStyle}/>
                    <Text style={styles.titleStyle}>{this.props.title}</Text>
                    <Text style={styles.contentStyle}>{this.props.content}</Text>
                </View>

                {this.kefuView()}
            </View>
        )
    }
}

var styles = StyleSheet.create({
    headViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headIconStyle:{
        width:80,
        height:80,
        marginTop:30,
        marginBottom:28,
        resizeMode:'stretch'

    },
    titleStyle:{
        fontSize:15,
        color:'#b2b2b2',
        marginBottom:5,

    },
    contentStyle:{
        fontSize:13,
        color:'#969696',
        marginBottom:18,
        marginRight:15,
        marginLeft:15,
    },
    kefuViewStyle:{
      backgroundColor:'white',
      marginLeft:14,
      marginRight:14,
      borderRadius:4
    },
    kefuInfoViewStyle:{
        marginLeft:15,
        borderBottomWidth:0.5,
        borderColor:'#969696',
        flexDirection:'row',
    },
    kefuImageStyle:{
        marginTop:23,
        marginRight:15,
        width:48,
        height:48,
        borderRadius:24,
        marginBottom:23,
    },
    phoneBtnStyle:{
        marginLeft:15,
        marginRight:15,
        marginBottom:23,
        borderRadius:4,
        height:44,
        backgroundColor:global.params.backgroundColor,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    }
});