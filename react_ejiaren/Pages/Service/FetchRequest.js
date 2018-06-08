let common_url = 'http://api1.ejiarens.com:8080/';  //服务器地址
let token = '';
var HTTPUtil = {};

/**
 * @param {string} url 接口地址
 * @param {string} method 请求方法：GET、POST，只能大写
 * @param {JSON} [params=''] body的请求参数，默认为空
 * @return 返回Promise
 */

HTTPUtil = function fetchRequest(url, method, params = '', is3Rdparty) {
    let header = {
        "Content-Type": "application/json,text/plain,text/json,text/html,text/javascript;charset=UTF-8",
        "accesstoken": token,  //用户登陆后返回的token，某些涉及用户数据的接口需要在header中加上token
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;',
    };
    console.log('request url:', common_url + url, params);  //打印请求参数

    if (method.toLowerCase() == 'get') {   //GET
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        var new_url = is3Rdparty ? url : common_url + url;

        console.log(new_url);
        return new Promise(function (resolve, reject) {
            fetch(new_url, {
                method: method,
                // headers: header
            }).then(
                (response) => response.json()
            ).then((responseData) => {
                    if (responseData.desc && responseData.state) {
                        reject(responseData.desc);
                    } else if (responseData.result === false && responseData.t.length > 0) {
                        reject(responseData.t);
                    } else {
                        resolve(responseData);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    } else {   //POST
        return new Promise(function (resolve, reject) {
            let formData = new FormData();
            for (var key in params) {
                formData.append(key, params[key]);
            }
            var new_url = is3Rdparty ? url : common_url + url;
            fetch(new_url, {
                method: method,
                headers: {},
                body: formData   //body参数，通常需要转换成字符串后服务器才能解析
            }).then(
                (response) => response.json())
                .then((responseData) => {
                    if (responseData.desc) {
                        reject(responseData.desc);
                    } else if (responseData.result === false) {
                        reject(responseData.t);
                    } else {
                        resolve(responseData);
                    }
                })
                .catch((err) => {
                    console.log('postErr:', url, err);   //网络请求失败返回的数据
                    reject(err);
                });
        });
    }
}

export default HTTPUtil;
