const GetJiejiAirports = 'resource/v2/airports'
const GetJiejiSearchList = 'serve/getCarModelsByCondition'
const JiejiSubmit = 'serve/search_mg_service'
const GetListType = 'serve/get_mg_serve_form?ver=1'
const GetJpjiPrice = 'serve/get_mg_price'
const JiejiSubmitOrder = 'serve/done_order_by_mg'

const SubmitZufangDemand = 'serve/done_order_by_activity'

import FetchRequst from '../../../Service/FetchRequest';
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

//获取接机机场列表
export function getJiejiAirports() {
    return new Promise((resolve, reject) => {
        FetchRequst(GetJiejiAirports, 'GET',).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//获取接机搜索列表
export function getJiejiSearchList(submitDic) {

    return new Promise((resolve, reject) => {
        submitDic['app_id'] = 'mobile';
        submitDic['app_key'] = 'XDcsk*zXjdcF53465';
        submitDic['ognz_id'] = global.params.OgnzId;
        submitDic['sign'] = sort(submitDic);
        delete(submitDic['app_key']);
        console.log(submitDic);
        FetchRequst(GetJiejiSearchList, 'POST', submitDic).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//获取接机搜索列表
export function jiejiSubmit(submitDic) {

    return new Promise((resolve, reject) => {
        submitDic['app_id'] = 'mobile';
        submitDic['app_key'] = 'XDcsk*zXjdcF53465';
        submitDic['ognz_id'] = global.params.OgnzId;
        submitDic['sign'] = sort(submitDic);
        delete(submitDic['app_key']);
        console.log(submitDic);
        FetchRequst(JiejiSubmit, 'POST', submitDic).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//获取接机搜索列表
export function getListType(submitDic) {

    return new Promise((resolve, reject) => {
        submitDic['app_id'] = 'mobile';
        submitDic['app_key'] = 'XDcsk*zXjdcF53465';
        submitDic['ognz_id'] = global.params.OgnzId;
        submitDic['sign'] = sort(submitDic);
        delete(submitDic['app_key']);
        console.log(submitDic);
        FetchRequst(GetListType, 'POST', submitDic).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取举牌接机价格
export function getJpjiPrice(submitDic) {

    return new Promise((resolve, reject) => {
        submitDic['app_id'] = 'mobile';
        submitDic['app_key'] = 'XDcsk*zXjdcF53465';
        submitDic['ognz_id'] = global.params.OgnzId;
        submitDic['sign'] = sort(submitDic);
        delete(submitDic['app_key']);
        console.log(submitDic);
        FetchRequst(GetJpjiPrice, 'POST', submitDic).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//提交租房需求
export function submitZufangDemand(submitDic) {

    return new Promise((resolve, reject) => {
        submitDic['app_id'] = 'mobile';
        submitDic['app_key'] = 'XDcsk*zXjdcF53465';
        submitDic['ognz_id'] = global.params.OgnzId;
        submitDic['sign'] = sort(submitDic);
        delete(submitDic['app_key']);
        console.log(submitDic);
        FetchRequst(SubmitZufangDemand, 'POST', submitDic).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//提交接机订单
export function jiejiSubmitOrder(submitDic) {
    return new Promise((resolve, reject) => {
        submitDic['app_id'] = 'mobile';
        submitDic['app_key'] = 'XDcsk*zXjdcF53465';
        submitDic['ognz_id'] = global.params.OgnzId;
        submitDic['sign'] = sort(submitDic);
        delete(submitDic['app_key']);
        console.log(submitDic);
        FetchRequst(JiejiSubmitOrder, 'POST', submitDic).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


