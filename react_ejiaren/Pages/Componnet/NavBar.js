/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
    Component
} from 'react';


import {
    StyleSheet,
    View,
    Text,
    Animated,
    TouchableOpacity,
    TouchableNativeFeedback,
    Platform,
    Image,
    Dimensions
} from 'react-native';

import px2dp from '../../Util'
import Icon from 'react-native-vector-icons/Ionicons'
import '../../common/GlobalContants'

let {width} = Dimensions.get('window');


var PropTypes = require('prop-types');

export default class NavBar extends Component {
    static propTypes = {
        title: PropTypes.string,
        leftIcon: PropTypes.string,
        rightIcon: PropTypes.string,
        leftTitle: PropTypes.string,
        rightTitle: PropTypes.string,
        leftPress: PropTypes.func,
        rightPress: PropTypes.func,
        rightIconOther: PropTypes.string,
        rightOtherPress: PropTypes.func,
        sytle: PropTypes.object,
        titleStyle:PropTypes.object,
    }
    static topbarHeight = (Platform.OS === 'ios' ? 64 : 42)

    render() {
        return (
            <View style={[styles.topbar, this.props.style]}>
                {this.renderBtn("left")}

                <View style={{width: width - 170,}}>
                    <Animated.Text numberOfLines={1}
                                   style={[styles.title, this.props.titleStyle]}>{this.props.title}</Animated.Text>
                </View>
                {this.renderBtn("right")}
            </View>
        )
    }

    rightOtherBtn() {
        if (this.props.rightIconOther && this.props.rightOtherPress) {
            return (
                <TouchableOpacity activeOpacity={0.7} onPress={this.props.rightOtherPress} style={styles.btn}>
                    <Image source={{uri: this.props.rightIconOther}} style={{width: px2dp(18), height: px2dp(18)}}/>
                </TouchableOpacity>
            )
        }
    }

    renderBtn(pos) {
        let render = (obj) => {
            const {name, onPress} = obj;
            if (Platform.OS === 'android') {
                return (
                    <TouchableOpacity onPress={onPress} style={styles.btn}>
                        <Icon name={name} size={px2dp(26)} color="#fff"/>
                    </TouchableOpacity>
                )
            } else {
                return (
                    <TouchableOpacity onPress={onPress} style={styles.btn}>
                        <Icon name={name} size={px2dp(26)} color="#fff"/>
                    </TouchableOpacity>
                )
            }
        }

        if (pos === 'left') {
            if (this.props.leftIcon) {
                return render({
                    name: this.props.leftIcon,
                    onPress: this.props.leftPress
                })
            } else if (this.props.leftTitle) {
                return (
                    <TouchableOpacity activeOpacity={0.7} onPress={this.props.leftPress}
                                      style={[styles.righTitleStyle, {width: 50}]}>
                        <Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>{this.props.leftTitle}</Text>
                    </TouchableOpacity>
                )
            } else {
                return (
                    <View style={styles.btn}></View>
                )
            }
        } else if (pos === 'right') {
            if (this.props.rightIcon) {
                return (
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity activeOpacity={0.7} onPress={this.props.rightPress} style={styles.btn}>
                            <Image source={{uri: this.props.rightIcon}} style={{width: px2dp(18), height: px2dp(18)}}/>
                        </TouchableOpacity>
                        {this.rightOtherBtn()}
                    </View>
                )
            } else if (this.props.rightTitle) {
                return (
                    <TouchableOpacity activeOpacity={0.7} onPress={this.props.rightPress} style={styles.righTitleStyle}>
                        <Text style={{color: 'white', fontSize: 16}}>{this.props.rightTitle}</Text>
                    </TouchableOpacity>
                )
            } else {
                return (
                    <View style={styles.btn}></View>
                )
            }
        }
    }
}

const styles = StyleSheet.create({
    topbar: {
        height: NavBar.topbarHeight + global.params.iPhoneXHeight,
        backgroundColor: global.params.backgroundColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        paddingHorizontal: px2dp(10)
    },

    righTitleStyle: {
        width: 90,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -global.params.iPhoneXHeight,
    },

    btn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -global.params.iPhoneXHeight,

    },
    title: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: px2dp(16),
        marginLeft: px2dp(5),
        marginBottom: -global.params.iPhoneXHeight,
        textAlign: 'center'


    }
});