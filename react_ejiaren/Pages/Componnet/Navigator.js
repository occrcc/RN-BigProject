/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */
'use strict';

import React, { Component } from 'react'
import { View, StatusBar, Platform } from 'react-native'
import Wrapper from './Wrapper'
//import Events from './util/event'
import {Navigator} from 'react-native-deprecated-custom-components';

export default class Navigation extends Component{
    constructor(props){
      super(props)
    }

    componentDidMount() {
        console.log('nav new:'+this.props.isNewFeature)
    }

    render(){
        return Platform.OS == "ios"?(
          <Navigator
            initialRoute={{component: Wrapper}}
            renderScene={(route, navigator) => {
                let Component = route.component;
                if(route.component) {
                    return <Component {...route.params} navigator={navigator} isNewFeature={this.props.isNewFeature}/>
                }
            }}
            configureScene={(route) => {
                if (route.sceneConfig) {
                    return route.sceneConfig;
                }
                return Navigator.SceneConfigs.PushFromRight;
            }}
          />
        ):(
          <View style={{flex: 1}}>
            <StatusBar
             backgroundColor={global.params.backgroundColor}
             barStyle="light-content"
             animated={true}
             hidden={false}
           />
              <Navigator
                  initialRoute={{component: Wrapper}}
                  renderScene={(route, navigator) => {
                      let Component = route.component;
                      if(route.component) {
                          return <Component {...route.params} navigator={navigator} isNewFeature={this.props.isNewFeature} />
                      }
                  }}
                  configureScene={(route) => {
                      if (route.sceneConfig) {
                          return route.sceneConfig;
                      }
                      return Navigator.SceneConfigs.PushFromRight;
                  }}
              />
          </View>
        )
    }
}
