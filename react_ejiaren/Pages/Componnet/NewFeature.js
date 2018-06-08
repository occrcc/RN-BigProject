import React, {Component} from 'react'
import {
    View,
    StatusBar,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity,
    Text,
    Platform
} from 'react-native'

import Main from '../Main/Main'

let {width, height} = Dimensions.get('window')

var imageIndex = global.params.OgnzId === '290' ? 1 : 3;

export default class NewFeature extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loadMainView: false,
            arr_img:[],
        }
    }


    componentWillMount() {

        let imgs = [];
        for (let i = 0; i < imageIndex; i++) {
            let imgName = 'yindao_' + global.params.OgnzId + '_' + i;
            imgs.push(imgName);
        }

        this.setState({
            arr_img: imgs,
        });
    }

    start(i) {
        let top = Platform.OS === 'ios' ? 0.84 : 0.84;

        if (i === (imageIndex - 1)) {
            return (
                <TouchableOpacity activeOpacity={0.8} style={{
                    position: 'absolute',
                    top: height * top,
                    backgroundColor: global.params.backgroundColor,
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 140,
                    height: 44,
                }} onPress={() => {
                    this.setState({
                        loadMainView: true,
                    })
                }}>
                    <Text style={{color: 'white', fontSize: 15}}>立即开启</Text>
                </TouchableOpacity>
            )
        }
    }

    loadMainView() {

        console.log(this.state.arr_img);

        return (
            <ScrollView horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false} style={{width: width, height: height,backgroundColor:'white'}}>
                {this.state.arr_img.map((name, i) => {
                    return (
                        <View key={i} style={{justifyContent: 'center', alignItems: 'center',width: width, height: height,backgroundColor:'black'}}>
                            <Image source={{uri: name}} style={{resizeMode:'contain', flex: 1, width: width, height: height}}/>
                            {this.start(i)}
                        </View>
                    )
                })}
            </ScrollView>
        )
    }

    render() {
        if (this.state.loadMainView) {
            return (
                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                    <Main navigator={this.props.navigator}/>
                </View>
            )
        } else {
            return (
                <View style={{flex: 1, backgroundColor: "white"}}>
                    <StatusBar
                        barStyle='light-content'
                        animated={true}
                        hidden={true}
                        backgroundColor={global.params.backgroundColor}
                    />
                    {this.loadMainView()}
                </View>
            )
        }
    }
}
