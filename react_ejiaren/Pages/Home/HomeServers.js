const GetNavigatorBadge = 'user/getReddotTips'
const GetHomeServers = 'article/article_list_by_app_index'
const GetHomeArticleList = 'ognz/serveItemList?ognz_id='
const GetHomeCountrys = 'company/company_countrys'

const GetHomeTimeList = 'resource/time_abroadList'
const GradationList = 'resource/gradationList'
const StudyAbroadCompay = 'company/post_requirement'
const SenderIosDeviceToken = 'user/update_ios_device_token'
const SenderAndroidDeviceToken = 'user/update_android_device_token'
const SubmitDem  = 'company/post_course_req'
const SubmitZixun  = 'company/post_language_req'



import FetchRequst from '../Service/FetchRequest';
import shar1 from 'crypto-js/sha1'
import _ from 'lodash'


//排序（按value值进行排序后生成arr，再转成str，进行shar1加密）
function sort(arys) {
    var valueString = Object.values(arys).sort().join('');
    var shaString = shar1(valueString);
    return shaString + '';
}



//获取底部通知栏角标
export function getNavigatorBadge (token) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(global.publicData);
        values['access_token'] = token;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(GetNavigatorBadge,'GET',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//获取首页内容
export function getHomeData () {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(global.publicData);
        values['ognz_id'] = global.params.OgnzId;
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(GetHomeServers,'GET',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//获取首页中间列表
export function getHomeArticleList () {
    return new Promise((resolve,reject) => {
        FetchRequst(GetHomeArticleList + global.params.OgnzId,'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取首页留学申请意向国家
export function getHomeCountrys () {
    return new Promise((resolve,reject) => {
        FetchRequst(GetHomeCountrys + '?ognzid=' + global.params.OgnzId  ,'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//获取首页留学申请出国时间
export function getHomeTimeList () {
    return new Promise((resolve,reject) => {
        FetchRequst(GetHomeTimeList ,'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//获取首页留学申请当前状态
export function gradationList () {
    return new Promise((resolve,reject) => {
        FetchRequst(GradationList ,'GET').then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//获取首页内容
export function studyAbroadCompay (values) {
    return new Promise((resolve,reject) => {
        values['app_id'] = 'mobile';
        values['app_key'] = 'XDcsk*zXjdcF53465';
        values['company_id'] = global.params.OgnzId;
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(StudyAbroadCompay,'POST',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取底部通知栏角标
export function senderIosDeviceToken (userToken,deviceToken) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(global.publicData);
        values['access_token'] = userToken;
        values['device_token'] = deviceToken;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(SenderIosDeviceToken,'POST',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取底部通知栏角标
export function senderAndroidDeviceToken (userToken,deviceToken) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(global.publicData);
        values['access_token'] = userToken;
        values['device_token'] = deviceToken;
        values['appid'] = 'rD9DKTrjmw620iG2Mv4wC4';
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(SenderAndroidDeviceToken,'POST',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//提交申请表单
export function submitDem (values) {
    return new Promise((resolve,reject) => {
        values['app_id'] = 'mobile';
        values['app_key'] = 'XDcsk*zXjdcF53465';
        values['ognzId'] = global.params.OgnzId;
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(SubmitDem,'POST',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//提交申请表单
export function submitZixun (values) {
    return new Promise((resolve,reject) => {
        values['app_id'] = 'mobile';
        values['app_key'] = 'XDcsk*zXjdcF53465';
        values['ognzId'] = global.params.OgnzId;
        values['sign'] = sort(values);
        delete(values['app_key']);
        FetchRequst(SubmitZixun,'POST',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//请求dem数据
export function getSubmitZixun (kexq) {
    let url = kexq ? 'http://m.ejiarens.com/app/json/kcxq.json' : 'http://m.ejiarens.com/app/json/yypx.json';
    return new Promise((resolve,reject) => {
        FetchRequst(url,'get',null,true).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}
