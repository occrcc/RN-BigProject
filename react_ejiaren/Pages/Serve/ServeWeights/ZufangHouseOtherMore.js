import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    StatusBar,
    ScrollView,
    Text,
    TouchableOpacity
} from 'react-native'

import NavBar from '../../Componnet/NavBar'
import {CachedImage} from 'react-native-img-cache'
let {width} = Dimensions.get('window')

export default class ZufangHouseOtherMore extends Component {
    constructor(props) {
        super(props)
        this.state = {
            headerArr: [],
        }
    }

    back() {
        this.props.navigator.pop();
    }

    componentWillMount() {
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
                    title="配套设施"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <ScrollView style={{backgroundColor: '#f5f5f5'}}>
                    <View style={{flexDirection:'row',
                        flexWrap:'wrap'}}>
                        {
                            this.props.houseMore.map((item, i) => {
                                return (
                                    <View key={i}
                                          style={styles.mainListItemStyle}
                                    >
                                        <CachedImage source={{uri: item.url}}
                                                     style={styles.mainListImageStyle}/>
                                        <Text style={styles.mainListTitleStyle}>{item.iconname}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainListItemStyle: {
        width: width / 4,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRightWidth: 1,
        borderRightColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },

    mainListImageStyle: {
        width: 32,
        height: 32,
    },
    mainListTitleStyle: {
        marginTop: 8,
        color: '#4a4a4a',
        fontSize: 13,
    }
})