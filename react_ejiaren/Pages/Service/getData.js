const LOGIN = 'user/login';
const GETMESCODE = 'user/send_sms_code/';
const REGDONE = 'user/regist';
const iSVALIDITY = 'user/validate_reg_name'
const CHANGEPWD = 'user/change_password'

const GetSubmitOrderList = 'serve/get_serve_form'
const GetYqm = 'resource/get_partner_by_invitecode'
const GetOrderKefuPhone = 'serve/getKfPhone'

const GetCheckUserCode = 'serve/check_user_code'
const GetSubmitOrderDetail = 'serve/cal_serve_price'
const ChangePassword = 'user/change_password_by_mobile'



import FetchRequst from './FetchRequest';
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



//修改用户密码
export function changePwd (ordPwd,newPws,token) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(publicData);
        values['old_password'] = ordPwd + '';
        values['new_password'] = newPws + '';
        values['access_token'] = token + '';
        values['ognz_id'] = global.params.OgnzId;
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(CHANGEPWD,'POST',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//登陆
export function doLogin (username,paswword) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(publicData);
        values['name'] = username + '';
        values['password'] = paswword + '';
        values['sign'] = sort(values);
        values['ognz_id'] = global.params.OgnzId;
        delete(values['app_key']);
        console.log(values);
        FetchRequst(LOGIN,'POST',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//找回密码输入新密码
export function changePassword (account,code,new_password) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(publicData);
        values['new_password'] = new_password;
        values['account'] = account;
        values['code'] = code;
        values['ognz_id'] = global.params.OgnzId;
        values['sign'] = sort(values);
        FetchRequst(ChangePassword,'POST',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}



//获取验证码
export function getMesCodeForForgetPwd (phoneNumber) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(publicData);
        values['m'] = phoneNumber + '';
        var sign = sort(values);
        var getCodeNumberStr = GETMESCODE + phoneNumber + '?app_id=mobile&type=1&ver=2&ognz_id='
            + global.params.OgnzId + '&sign='+ sign;
        FetchRequst(getCodeNumberStr,'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}



//获取验证码
export function getMesCode (phoneNumber) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(publicData);
        values['m'] = phoneNumber + '';
        var sign = sort(values);
        var getCodeNumberStr = GETMESCODE + phoneNumber + '?app_id=mobile&ver=2&ognz_id='
            + global.params.OgnzId + '&sign='+ sign;
        FetchRequst(getCodeNumberStr,'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//判断手机是否注册
export function isValidity (phoneNumber) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(publicData);
        values['accountName'] = phoneNumber + '';
        values['ognz_id'] = global.params.OgnzId;
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(iSVALIDITY,'POST',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//注册账号
export function regDone (values) {
    return new Promise((resolve,reject) => {
        values['app_id'] = 'mobile';
        values['app_key'] = 'XDcsk*zXjdcF53465';
        values['ognz_id'] = global.params.OgnzId;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(REGDONE,'POST',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取订单列表的格式
export function getSubmitOrderList (id,access_token,) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(publicData);
        values['id'] = id;
        values['ver'] = '3';
        values['access_token'] = access_token;
        values['ognz_id'] = global.params.OgnzId;
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(GetSubmitOrderList,'GET',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取邀请码信息
export function getYqm (code,access_token,) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(publicData);
        values['code'] = code;
        values['access_token'] = access_token;
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(GetYqm,'POST',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}



//获取订单客服电话
export function getOrderKefuPhone (id,access_token,) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(publicData);
        values['id'] = id;
        values['access_token'] = access_token;
        values['ognz_id'] = global.params.OgnzId;
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(GetOrderKefuPhone,'POST',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}



//获取提交订单页面明细
export function getSubmitOrderDetail (id,access_token,num,sending_country) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(publicData);
        if (sending_country){
            values['sending_country'] = sending_country;
        }
        values['id'] = id;
        values['access_token'] = access_token;
        values['num'] = num;
        values['ognz_id'] = global.params.OgnzId;
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(GetSubmitOrderDetail,'POST',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//提交订单前获取是否有优惠券可以使用
export function getCheckUserCode (serveType,price,access_token,) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(publicData);
        values['serveType'] = serveType;
        values['access_token'] = access_token;
        values['price'] = price;
        values['ognz_id'] = global.params.OgnzId;
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(GetCheckUserCode,'POST',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//提交订单
export function submitOrder (submitDic,orderId) {
    return new Promise((resolve,reject) => {
        submitDic['app_id'] = 'mobile';
        submitDic['app_key'] = 'XDcsk*zXjdcF53465';
        submitDic['ognz_id'] = global.params.OgnzId;
        submitDic['sign'] = sort(submitDic);
        delete(submitDic['app_key']);
        console.log(submitDic);
        let url = parseInt(orderId) === 462 ? 'serve/done_order_by_dhl' : 'serve/done_order_by_activity';
        FetchRequst(url,'POST',submitDic).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}




/*

class Services {
    static  doLogin(username: string, paswword: string):Object {
        return new Promise((resolve, reject) => {
            var values = publicData;
            values['name'] = username + '';
            values['password'] = paswword + '';
            values['sign'] = this.sort(values);
            delete(values['app_key']);
            FetchRequst(LOGIN, 'POST', values).then(res => {
                console.log('res:' + JSON.stringify(res));
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

    static sort(arys:Object): Object {
        var valueString = Object.values(arys).sort().join('');
        var shaString = shar1(valueString);
        return shaString + '';
    }
}

exports = Services;*/