import React, {Component} from 'react'
import {
    View,

} from 'react-native'

import MineGeneral from "./MineOtherOgna/MineGeneral";
// import MineGeneral from "./MineOtherOgna/Mine290";

export default class EJRMine extends Component {
    constructor(props) {
        super(props)

    }



    render() {
        const {navigator} = this.props;
        return (
            <View style={{flex: 1, backgroundColor: "#f5f5f5",}}>
                <MineGeneral navigator={navigator}/>
            </View>
        )
    }
}