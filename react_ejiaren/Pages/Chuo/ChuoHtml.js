import React, {Component} from 'react'
import {
    View,
    StatusBar,
    WebView,
} from 'react-native'

import NavBar from '../Componnet/NavBar'
export default class ChuoHtml extends Component {

    constructor(props) {
        super(props)
        this.state={
            webUrl:'',
            title:''
        }
    }

    back() {
        this.props.navigator.pop()
    }

    componentDidMount() {
        this.setState({
            webUrl:this.props.webUrl,
            title:this.props.title,
        });
    }

    getWebView(){
        return(
            <WebView
                source={{uri:this.state.webUrl}}
                startInLoadingState={true}
                domStorageEnabled={true}
                javaScriptEnabled={true}
            >
            </WebView>
        )
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
                {this.getWebView()}
            </View>
        )
    }
}

