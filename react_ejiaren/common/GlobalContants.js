/**
 * Created by ljunb on 2017/2/25.
 */

import { Dimensions, Platform, PixelRatio,StatusBar } from 'react-native'
import {isIphoneX} from 'react-native-iphone-x-helper'

global.params = {

    //威久留学
    // backgroundColor: "#1A3E69",
    // OgnzId:'163',

    //优越留学
    // backgroundColor: "#527eec",
    // OgnzId:'286',

    //留学荟
    // backgroundColor: "#00539f",
    // OgnzId:'287',

    //艾芯留学
    // backgroundColor: "#ab4e48",
    // OgnzId:'288',

    //易学优
    backgroundColor: "#ab4e48",
    OgnzId:'275',

    //莘远留学
    // backgroundColor: "#243589",
    // OgnzId:'289',

    //独课教育
    // backgroundColor: "#DF455D",
    // OgnzId:'290',

    //------------------------------  这段不需要修改  -----------------------------------
    iPhoneXHeight: isIphoneX() ? 34 : 0,
    CellHeight : 44,
    CellTitleColor:'rgb(88,88,88)',
    CellTitleFontSize:15 ,
    CellRightTitleFontSize:13 ,
    CellLineViewHight:0.5,
    CellRightTitleColor:'rgb(188,188,188)',
    StatusBarHight:Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    AppLaunchPic:'appLaunch',
    //-----------------------------------------------------------------------------------
}

//威久客服参数
/*
global.kefuInfo = {
    kefuName:'Lind Chen',
    kefuPhone:'021-61984772'
}
*/

//客服参数
global.kefuInfo = {
    kefuName:'Lind Chen',
    kefuPhone:'021-61984772'
}

//威久留学微信支付参数
global.payParams = {
    wx_appid:'wx86c58bd2870e4ee4',
    wx_secrt:'e0a11d7f16f450b1699fa420506fcd29',
    wx_mchid:'1464377802',
    wx_secretid:'weijiuprojectlxsbanbanproject123'
}

//优越留学微信支付参数
// global.payParams = {
//     wx_appid:'wx8aeed5b18b3837af',
//     wx_secrt:'5aef138703281dd5cfb1192dd4a34933',
//     wx_mchid:'1499180052',
//     wx_secretid:'youyueprojectlxsbanbanproject123'
// }


//莘远留学微信支付参数
// global.payParams = {
//     wx_appid:'wx62bd3dd35b39f4da',
//     wx_secrt:'8f2e3a6e0c50657caed86c54d3cd2d22',
//     wx_mchid:'1499178322',
//     wx_secretid:'shenyuanprojectlxsbanbanproject1'
// }

//独课教育微信支付参数
// global.payParams = {
//     wx_appid:'wxf0c5fdef8a79c4b1',
//     wx_secrt:'abc2a8ec9ea4cf41337328f6d8e5691f',
//     wx_mchid:'1499178322',
//     wx_secretid:'shenyuanprojectlxsbanbanproject1'
// }

//留学荟
// global.payParams = {
//     wx_appid:'wxfb8da62b8480e092',
//     wx_secrt:'a66946f14c73d622070e1014ef31e997',
//     wx_mchid:'1500167372',
//     wx_secretid:'liuxhprojectlxsbanbanproject1234'
// }

//艾芯留学
// global.payParams = {
//     wx_appid:'wx4e190d43ae651593',
//     wx_secrt:'315bef42bf04fb30d053ad2ca524a5a7',
//     wx_mchid:'1500112772',
//     wx_secretid:'aixinprojectlxsbanbanproject1234'
// }



//------------------ 以上参数需要根据机构进行修改 ------------------------------

//支付宝支付参数
global.alipayParams = {
    app_id:"2016021801149723",
    method: "mobile.securitypay.pay",
    charset: "utf-8",
    sign_type: "RSA",
    version:"1.0",
    notify_url: 'http://api1.ejiarens.com:8080/alipay/notify_url',
}


global.gScreen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    onePix: 1 / PixelRatio.get(),
}

global.gColors = {
    theme: 'rgb(217, 51, 58)',
    background: '#f5f5f5',
    border: '#d5d5d5',
    healthGreen: '#8ED507',
    healthYellow: '#FED20A',
    healthRed: 'rgb(251, 25, 8)'
}

global.publicData = {
    'app_id': 'mobile',
    'app_key': 'XDcsk*zXjdcF53465',
    'ognz_id': global.params.OgnzId,
    'from' : Platform.OS === 'ios' ? 0 : 3,
}