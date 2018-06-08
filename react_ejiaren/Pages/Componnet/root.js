/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';

import Navigation from './Navigator'
import storage from "../RNAsyncStorage";

let {width, height} = Dimensions.get('window')

var si = null;


export default class Root extends Component<{}> {

    constructor(props) {
        super(props)
        this.state = {
            isLaunchImg: true,
            appLaunchPic: '',
            secondNumber: 5,
            isNewFeature: true
        }
    }

    componentWillMount() {
        if (Platform.OS === 'ios') {
            this.setState({isLaunchImg: false})
        } else {
            storage.load({
                key: global.params.AppLaunchPic,
            }).then((res) => {
                this.setState({
                    appLaunchPic: res
                })
            });
        }

        storage.load({
            key: 'newFeature',
        }).then(() => {
            this.setState({
                isNewFeature: false
            })
        }).catch(err => {
            this.setState({
                isNewFeature: true
            })
        })
    }

    componentWillUnmount() {
        si && clearInterval(si);
    }

    componentDidMount() {
        si = setInterval(() => {
            let secondNumber = this.state.secondNumber;
            secondNumber--;
            this.setState({secondNumber: secondNumber,});
            if (secondNumber <= 0) {
                clearInterval(si);
                this.setState({secondNumber: 0, isLaunchImg: false});
            }
        }, 1000)
    }

    loadLaunchImage() {
        if (this.state.appLaunchPic.length > 0) {
            return (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'transparent'
                }}>
                    <Image source={{uri: this.state.appLaunchPic}}
                           style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 80}}/>

                </View>
            )
        }
    }

    render() {
        if (this.state.isLaunchImg) {
            return (
                <View style={{backgroundColor: 'white', flex: 1}}>
                    <Image source={{uri: 'splash13'}} style={{flex: 1,}}/>
                    {this.loadLaunchImage()}
                    <TouchableOpacity activeOpacity={0.9} style={{
                        position: 'absolute',
                        top: 40,
                        right: 20,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        width: 80,
                        height: 36,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 18
                    }} onPress={() => {
                        this.setState({isLaunchImg: false});
                    }}>
                        <Text style={{color: 'white', fontSize: 14}}>{this.state.secondNumber} 跳过</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style={{backgroundColor: 'white', flex: 1}}>
                    <Navigation isNewFeature={this.state.isNewFeature}/>
                </View>
            )
        }
    }
}

