const GETHEADERITEM = 'resource/article_type';
const ARTICLE_SEARCH = 'article/v3/search_article'


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

//根据id获取List内容
export function getArticleListById(step, index, size) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['step'] = step;
        values['index'] = index;
        values['size'] = size;
        values['sign'] = sort(values);
        delete(values['app_key']);

        console.log(values);
        FetchRequst(ARTICLE_SEARCH, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//根据id获取资讯详情
export function getZixunDetail(webId, token) {
    return new Promise((resolve, reject) => {
        let zixunUrl = 'finder/article_view/' + webId

        var values = _.cloneDeep(publicData);
        values['access_token'] = token;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);

        FetchRequst(zixunUrl, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取喜欢收藏等信息
export function getZixunDetailInfo(webId, token) {
    return new Promise((resolve, reject) => {
        let zixunUrl = 'article/article_info'

        var values = _.cloneDeep(publicData);
        values['id'] = webId,
            values['access_token'] = token;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);

        FetchRequst(zixunUrl, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//资讯操作
export function zixunLikeOrFav(webId, method, token) {

    return new Promise((resolve, reject) => {
        var zixunUrl = 'article/article_favorite'
        if (method === 'like') {
            zixunUrl = 'article/like_article'
        } else if (method === 'unfav') {
            zixunUrl = 'article/article_remove_favorite'
        }
        var values = _.cloneDeep(publicData);
        values['id'] = webId,
            values['access_token'] = token;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(zixunUrl, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取头部按钮组
export function getHeadItems() {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['sign'] = sort(values);
        values['ognz_id'] = global.params.OgnzId
        delete(values['app_key']);
        console.log(values);
        FetchRequst(GETHEADERITEM, 'POST', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}
