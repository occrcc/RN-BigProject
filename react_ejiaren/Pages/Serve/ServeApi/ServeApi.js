const GetServeListItems = 'ognz/serve_panel_data'
const GetServeListData = 'serve/v2/search_serve'

const GetMyOrders = 'serve/my_order_list'
const FirendPay = 'serve/setOrderFirendPayFlag'
const SubmitZufangInfo = 'serve/done_order_by_activity'
const GetCountryList = 'serve/select_country_by_college'
const GetCollegeType = 'resource/college_fee_type'

const YuerPay = 'cashpay/notify_url'
const GetPicType = 'resource/upload_pic'

const SubmitFeeNeed = 'serve/submit_fee_need'

const SubmitUNionPayOrler = 'serve/done_order_by_college_fee_new'

import FetchRequst from '../../Service/FetchRequest';
import shar1 from 'crypto-js/sha1'
import _ from 'lodash'
const GetCheckUserCode = 'serve/check_user_code'
const TransferNotifyServe = 'transfer_account/notify_url'

const SubmitVisaPayOrler = 'serve/done_order_by_visa'
const GetFillPrice = 'serve/v2/search_serve_by_condition'


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

//根据id获取List内容
export function getTopImage() {
    return new Promise((resolve, reject) => {
        let url = 'company/company_view_simply/' + global.params.OgnzId;
        FetchRequst(url, 'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//根据服务首页列表内容
export function getServeListItems(token) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['ognz_id'] = global.params.OgnzId;
        values['access_token'] = token;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(GetServeListItems, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//获取服务版块html页面下单详情
export function getServeHtmlData(webid, token) {
    return new Promise((resolve, reject) => {
        let url = 'serve/show/' + webid;
        var values = _.cloneDeep(publicData);
        values['ognz_id'] = global.params.OgnzId;
        //values['access_token'] = token;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(url, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取其它服务版块List列表
export function getServeListData(categoryid, token,) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['ognz_id'] = global.params.OgnzId;
        // values['index'] = index;
        // values['size'] = size;
        values['categoryid'] = categoryid;
        values['access_token'] = token;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(GetServeListData, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//补差价
export function getFillPrice(categoryid, token,) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['key'] = '补差价';
        values['classid'] = '6';
        values['access_token'] = token;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(GetFillPrice, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}



//获取租房选择城市的列表
export function getCityList(searchKey) {
    return new Promise((resolve, reject) => {
        let url = 'http://exapi.uhouzz.com/index.php/wechatapp/HouseSearch/keySearch?cid=ejiarens&searchkey='
        if (searchKey){
            url += searchKey;
        }
        FetchRequst(url, 'GET', null, true).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取我的全部订单
export function getMyOrders(status, index, size, token,) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['index'] = index;
        values['size'] = size;
        values['status'] = status;
        values['access_token'] = token;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(GetMyOrders, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取支付前订单详情
export function getPayBeforOrderDetail(url, token,) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['access_token'] = token;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(url, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//好友代付
export function firendPay(sn, token,) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['sn'] = sn;
        values['access_token'] = token;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(FirendPay, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//
export function zufangList(getRid, schoolId) {
    return new Promise((resolve, reject) => {
        let zufangUrl =
            'http://exapi.uhouzz.com/index.php/wechatapp/house/houseList?cid=ejiarens&sortType=1&typeId=3&'
            + getRid + '=' + schoolId;
        FetchRequst(zufangUrl, 'GET', null, true).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//点击租房列表时获取详情
export function zuFangDidSelectList(serveID, schoolId) {
    return new Promise((resolve, reject) => {
        let zufangUrl =
            'http://exapi.uhouzz.com/index.php/wechatapp/House/houseDetail?cid=ejiarens&src=pc&hid='
            + serveID + '&schoolId=' + schoolId;
        FetchRequst(zufangUrl, 'GET', null, true).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//提交租房订单
export function submitZufangInfo(submitDic) {

    return new Promise((resolve, reject) => {
        submitDic['app_id'] = 'mobile';
        submitDic['app_key'] = 'XDcsk*zXjdcF53465';
        submitDic['ognz_id'] = global.params.OgnzId;
        submitDic['sign'] = sort(submitDic);
        delete(submitDic['app_key']);
        console.log(submitDic);
        FetchRequst(SubmitZufangInfo, 'POST', submitDic).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//获取银联转账国家列表
export function getCountryList() {
    return new Promise((resolve, reject) => {
        FetchRequst(GetCountryList, 'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//获取银联转账类型
export function getCollegeType() {
    return new Promise((resolve, reject) => {
        FetchRequst(GetCollegeType, 'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//转账根据学校io跳转不同界面
export function getSchoolType(schoolid) {
    let url = 'serve/check_has_school_account?schoolid=' + schoolid;
    return new Promise((resolve, reject) => {
        FetchRequst(url, 'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//提交租房订单
export function yuerPay(token,sn) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['access_token'] = token;
        values['out_trade_no'] = sn;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(YuerPay, 'POST', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//银联汇款上传护照等照片
export function getPicType(values) {
    return new Promise((resolve, reject) => {
        FetchRequst(GetPicType, 'POST', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//提交银联汇款订单
export function submitUNionPayOrler(submitDic) {

    return new Promise((resolve, reject) => {
        submitDic['app_id'] = 'mobile';
        submitDic['app_key'] = 'XDcsk*zXjdcF53465';
        submitDic['ognz_id'] = global.params.OgnzId;
        submitDic['sign'] = sort(submitDic);
        delete(submitDic['app_key']);
        console.log(submitDic);
        FetchRequst(SubmitUNionPayOrler, 'POST', submitDic).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//提交银联汇款订单
export function visaPaySearchCity(key) {
    return new Promise((resolve, reject) => {
        let url = 'resource/searchSchoolOrCountry?key=' + key;
        FetchRequst(url, 'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//Visa获取国家货币
export function getListCurrency(key) {
    return new Promise((resolve, reject) => {
        let url = 'resource/listCurrencyByCountryId?countryId=' + key;
        FetchRequst(url, 'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//Visa获取国家货币
export function visaGetPrice(currencyId,amount) {

    return new Promise((resolve, reject) => {
        let url = 'serve/cal_serve_price_by_visa?currencyId=' + currencyId + '&amount=' + amount;
        FetchRequst(url, 'GET').then(res => {
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



//提交Visa订单
export function submitVisaPayOrler(submitDic) {
    return new Promise((resolve, reject) => {
        submitDic['app_id'] = 'mobile';
        submitDic['app_key'] = 'XDcsk*zXjdcF53465';
        submitDic['ognz_id'] = global.params.OgnzId;
        submitDic['sign'] = sort(submitDic);
        delete(submitDic['app_key']);
        console.log(submitDic);
        FetchRequst(SubmitVisaPayOrler, 'POST', submitDic).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//提交银联汇款未找到学校需求单
export function submitUnionNoSchool(submitDic) {
    return new Promise((resolve, reject) => {
        submitDic['app_id'] = 'mobile';
        submitDic['app_key'] = 'XDcsk*zXjdcF53465';
        submitDic['sign'] = sort(submitDic);
        delete(submitDic['app_key']);
        console.log(submitDic);
        FetchRequst(SubmitFeeNeed, 'POST', submitDic).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//转账支付通知服务端
export function transferNotifyServe(submitDic) {
    return new Promise((resolve, reject) => {
        submitDic['app_id'] = 'mobile';
        submitDic['app_key'] = 'XDcsk*zXjdcF53465';
        submitDic['sign'] = sort(submitDic);
        delete(submitDic['app_key']);
        console.log(submitDic);
        FetchRequst(TransferNotifyServe, 'POST', submitDic).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


