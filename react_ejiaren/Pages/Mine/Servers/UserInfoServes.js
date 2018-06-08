const UPLOADPROFILEIMG = 'user/upload_profile_image_base64_orgin';
const UPLOADNIKENAME = 'user/update_user_info';
const GETSCHOOLS = 'resource/schools';
const GETSCHOOLSBYCOUNTRYID = 'resource/schools_by_countryid';


const GETINFO = 'user/user_common_data_view/?'
const SAVEINFO = 'user/update_user_common_data'
const GetRechargeMoneyList = 'serve/recharge_serve_list'
const GetPaySource = 'serve/done_order_by_rechage_serve'
const GetOrderSignServer = 'alipay/payBodyBuild'

const Tixian = 'cashpay/withdraw_cash'
const GetTeacherCode = 'resource/get_partner_by_invitecode'
const ChangeTeacherCode = 'user/update_user_invite_code'
const GetMyCollectList = 'user/list_favorite_by_article'
const GetTeacherType = 'resource/teacherPositions?access_token='
const GetMyCoupon = 'keycode/code_list_by_user'

const GetUserAmount = 'user/getUserAmountByToken?access_token='

const UserNotificationBadge = 'user/userNotificationBadge?access_token='
const MyMessageDetailList = 'user/my_user_notification_list?access_token='
const MyMessageReaded = 'user/update_user_notification_readed_status?access_token='
const SenderAppInfo = 'statistics/eventTrig'


const MyMessageDelete = 'user/del_user_notification'

import DeviceInfo from 'react-native-device-info'


import FetchRequst from '../../Service/FetchRequest';
import shar1 from 'crypto-js/sha1'
import _ from 'lodash'


const publicData = {
    'app_id': 'mobile',
    'app_key': 'XDcsk*zXjdcF53465',
}

//排序（按value值进行排序后生成arr，再转成str，进行shar1加密）
function sort(arys) {
    var valueString = Object.values(arys).sort().join('');
    var shaString = shar1(valueString);
    return shaString + '';
}

//获取学校列表
export function getSchools(countryId) {

    var values = _.cloneDeep(publicData);
    let url = GETSCHOOLS;
    if (countryId) {
        url = GETSCHOOLSBYCOUNTRYID;
        values['countryid'] = countryId;
    }
    values['sign'] = sort(values);
    delete(values['app_key']);
    return new Promise((resolve, reject) => {
        FetchRequst(url, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取充值订单信息（alipay）
export function GetOrderSign(values) {
    return new Promise((resolve, reject) => {
        FetchRequst(GetOrderSignServer, 'POST', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取充值订单信息（wxpay）
export function goWxPay(orderSn) {
    let wxPayUrl = "http://api1.ejiarens.com:8080/wxmppay/createLink?orderId=" + orderSn
        + "&ognz_id=" + global.params.OgnzId;
    console.log(wxPayUrl);
    return new Promise(function (resolve, reject) {
        fetch(wxPayUrl, {
            method: "get",
        }).then(response =>
            resolve(response.json()))
            .catch((err) => {
                reject(err);
            });
    });
}


//获取充值订单信息（alipay）
export function goAliPay(orderSn) {
    let aliPayUrl = "http://api1.ejiarens.com:8080/alipay/createLink?orderId=" + orderSn;
    return new Promise(function (resolve, reject) {
        fetch(aliPayUrl, {
            method: "get",
        }).then(response =>
            resolve(response.text()))
            .catch((err) => {
                reject(err);
            });
    });
}


//获取充值订单信息
export function getPayBackOrderInfo(token, id) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['access_token'] = token + '';
        values['id'] = id;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(GetPaySource, 'POST', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//获取充值金额
export function getRechargeMoneyList(token) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['access_token'] = token + '';
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(GetRechargeMoneyList, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取常用信息
export function getRegInfo(token) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['access_token'] = token + '';
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(GETINFO, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//保存常用信息
export function saveInfo(key, value, token) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values[key] = value + '';
        values['access_token'] = token + '';
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(SAVEINFO, 'POST', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//修改其它资料
export function uploadOtherInfo(key, value, token) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values[key] = value + '';
        values['access_token'] = token + '';
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(UPLOADNIKENAME, 'POST', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//修改用户头像
export function uploadProfileImg(imgBase64Str, token) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['pic'] = imgBase64Str + '';
        values['access_token'] = token + '';
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(UPLOADPROFILEIMG, 'POST', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//修改所在地获取的所有地址
export function getAllAddress() {
    return new Promise((resolve, reject) => {
        let url = 'resource/v2/countrys';
        FetchRequst(url, 'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取我的钱包收支明细List
export function getMyWalletDetailList(token) {
    return new Promise((resolve, reject) => {
        let url = 'user/getUserCashIncomeStatementByToken?access_token=' + token;
        FetchRequst(url, 'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//获取用户信息是否完善
export function isUserInfoPerfect(token) {
    return new Promise((resolve, reject) => {
        let url = 'user/user_common_data_view?access_token=' + token;
        FetchRequst(url, 'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//发起提现
export function tiXian(token) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['access_token'] = token + '';
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(Tixian, 'POST', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//提现后重新获取用户信息
export function getUserForToken(token) {
    return new Promise((resolve, reject) => {
        let url = 'user/getuser_token?access_token=' + token;
        FetchRequst(url, 'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//获取老师邀请码
export function getTeacherCode(token, code) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['access_token'] = token + '';
        values['code'] = code + '';
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(GetTeacherCode, 'POST', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//修改老师邀请码
export function changeTeacherCode(token, invite_code) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['access_token'] = token + '';
        values['invite_code'] = invite_code + '';
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(ChangeTeacherCode, 'POST', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//修改老师邀请码
export function getMyCollectList(token) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['access_token'] = token + '';
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(GetMyCollectList, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取老师类型
export function getTeacherType(token) {
    return new Promise((resolve, reject) => {
        let url = GetTeacherType + token;
        FetchRequst(url, 'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//获取我的优惠券
export function getCouponList(values) {
    return new Promise((resolve, reject) => {
        values['app_id'] = 'mobile';
        values['app_key'] = 'XDcsk*zXjdcF53465';
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(GetMyCoupon, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//根据token获取用户余额
export function getUserAmount(token) {
    return new Promise((resolve, reject) => {
        let url = GetUserAmount + token;
        FetchRequst(url, 'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//获取消息列表
export function userNotificationBadge(token) {
    return new Promise((resolve, reject) => {
        let url = UserNotificationBadge + token;
        FetchRequst(url, 'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//获取消息列表详情
export function myMessageDetailList(token, type, index) {
    return new Promise((resolve, reject) => {
        let url = MyMessageDetailList + token + '&type=' + type + '&index=' + index + '&size=999';
        FetchRequst(url, 'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//删除消息
export function myMessageDelete(token, id) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['access_token'] = token;
        values['id'] = id;
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(MyMessageDelete, 'POST',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}



//点击消息列表通知为已读状态
export function myMessageReaded(token, type) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['access_token'] = token;
        values['type'] = type;
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(MyMessageReaded, 'POST', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//发送设备信息
export function sendAppInfo(userId, type, eventName,ipAddress) {
    return new Promise((resolve, reject) => {

        // console.log("Device Unique ID", DeviceInfo.getUniqueID());  // e.g. FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9
        // console.log("Device Model", DeviceInfo.getModel());  // e.g. iPhone 6
        // console.log("Bundle Id", DeviceInfo.getBundleId());  // e.g. com.learnium.mobile
        // console.log("App Version", DeviceInfo.getVersion());  // e.g. 1.1.0
        // console.log("Device Name", DeviceInfo.getDeviceName());  // e.g. Becca's iPhone 6


        var values = _.cloneDeep(publicData);
        values['userId'] = userId;
        values['type'] = type;
        values['ognzId'] = global.params.OgnzId;
        values['unitype'] = DeviceInfo.getModel() ;
        values['eventName'] = eventName;
        values['clientIp'] = ipAddress;
        values['appVer'] = DeviceInfo.getVersion();
        values['drivenToken'] = DeviceInfo.getUniqueID() ;
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(SenderAppInfo, 'POST', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}





