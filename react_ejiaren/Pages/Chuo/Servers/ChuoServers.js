
const GetChuoListItemsSource = 'teacher/getGroupInfo';
const GetChuoListItemsSourcePaged = 'teacher/listMessagesByGroupId';
const GetMyFilesUrl = 'teacher/listMessagesReplyByParentId'
const SenderMesage = 'teacher/replyMessage'
const GetImageType = 'resource/upload_file'
const SaveImgs = 'teacher/feebackMessage'
const ReadMessage = 'teacher/readMessage'
const GetNavigatorBadge = 'user/getReddotTips';

const GetMyAllFiles =  'teacher/listUploadFilesGroupByByGroupId'
const ListNotesPageByGroupId = 'teacher/listNotesPageByGroupId'
const UpdateNotesReadStatus  = 'teacher/updateNotesReadStatus'
const GetNotesUnReadCount  = 'teacher/getNotesUnReadCount'

import FetchRequst from '../../Service/FetchRequest';
import shar1 from 'crypto-js/sha1'
import _ from 'lodash'


//排序（按value值进行排序后生成arr，再转成str，进行shar1加密）
function sort(arys) {
    var valueString = Object.values(arys).sort().join('');
    var shaString = shar1(valueString);
    return shaString + '';
}

//获取学生文件列表
export function getMyFileList (parentId,token) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(global.publicData);
        values['access_token'] = token;
        values['parentId'] = parentId;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(GetMyFilesUrl,'GET',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//根据id获取List内容
export function getChuoList (token,id,index,size) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(global.publicData);
        values['access_token'] = token;
        values['id'] = id;
        values['index'] = index;
        values['size'] = size;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(GetChuoListItemsSource,'GET',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


export function getChuoListPages (token,id,index,size) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(global.publicData);
        values['access_token'] = token;
        values['id'] = id;
        values['index'] = index;
        values['size'] = size;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);

        FetchRequst(GetChuoListItemsSourcePaged,'GET',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//发送回复信息
export function replyMessage (token,id,message) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(global.publicData);
        values['access_token'] = token;
        values['id'] = id;
        values['body'] = message;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(SenderMesage,'GET',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取图片信息
export function getImgType (pciBase64) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(global.publicData);
        values['pic'] = pciBase64;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(GetImageType,'POST',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取图片信息
export function saveImgs (imgInfo,id,token) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(global.publicData);
        values['access_token'] = token;
        values['url'] = imgInfo.url;
        values['fileName'] = imgInfo.name;
        values['fileSize'] = imgInfo.size;
        values['fileType'] = imgInfo.type;
        values['id'] = id;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(SaveImgs,'POST',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//获取我的所有文件及回复内容
export function getMyfiles (token,userId) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(global.publicData);
        values['access_token'] = token;
        values['groupid'] = userId;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(GetMyAllFiles,'GET',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//消息已读
export function readMessage (token,id) {
    return new Promise((resolve,reject) => {
        var values = _.cloneDeep(global.publicData);
        values['access_token'] = token;
        values['id'] = id;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(ReadMessage,'GET',values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
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




//根据id获取进度列表
export function listNotesPageByGroupId(groupId, index, size,token) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['groupId'] = groupId;
        values['index'] = index;
        values['size'] = size;
        values['access_token'] = token;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(ListNotesPageByGroupId, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}


//更新进度内容阅读状态
export function updateNotesReadStatus(token) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['access_token'] = token;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(UpdateNotesReadStatus, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

//更新进度内容阅读状态
export function getNotesUnReadCount(token) {
    return new Promise((resolve, reject) => {
        var values = _.cloneDeep(publicData);
        values['access_token'] = token;
        values['sign'] = sort(values);
        delete(values['app_key']);
        console.log(values);
        FetchRequst(GetNotesUnReadCount, 'GET', values).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}



