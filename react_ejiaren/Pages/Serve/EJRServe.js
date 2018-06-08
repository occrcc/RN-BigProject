import React, {Component} from 'react'
import {
    View,
} from 'react-native'



import ServeHome from './ServeGeneral/ServeHome'
// import ServeHome from './ServeGeneral/Serve290'


export default class EJRServe extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {navigator} = this.props;
        return (
            <View style={{flex: 1, backgroundColor: "white",}}>
                <ServeHome navigator={navigator} />
            </View>
        )
    }
}