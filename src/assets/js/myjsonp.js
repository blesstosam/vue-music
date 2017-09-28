import originJsonp from 'jsonp';

export default function (url, data, option) {

    url += url.indexOf('?') < 0 ? '?' : '&';
    url += param(data);

    return new Promise((resolve, reject) => {
        originJsonp(url, option, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        })

    })

}


function param(data) {
    let url = '';
    for (let key in data) {
        let value = data[key] !== undefined ? data[key] : '';
        url += `&${key}=${encodeURIComponent(value)}`;        //参数要编码？
    }
    return url ? url.substring(1) : '';
}