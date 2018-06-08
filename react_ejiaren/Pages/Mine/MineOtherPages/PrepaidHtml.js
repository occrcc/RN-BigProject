import React, {Component} from 'react'
import {
    View,
    StatusBar,
    WebView,
    InteractionManager
} from 'react-native'


import NavBar from '../../Componnet/NavBar'

export default class PrepaidHtml extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(()=>{
        });
    }

    back() {
        this.props.navigator.pop()
    }

    getWebView(){
        let url = 'http://m.ejiarens.com/banban/cash_agreement?ognz_id=' + global.params.OgnzId;
        return(
            <WebView
                source={{uri:url}}
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
                    title={'钱包充值协议'}
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                {this.getWebView()}

            </View>
        )
    }
}

