import Vue from 'vue';
import {commonParams, options, ERR_OK} from './config';
import myjsonp from '../assets/js/myjsonp';
import {RECOMMEND, SINGERLIST, SONGS, SONGSLIST, TOPLIST, SINGLE_TOP_LIST, HOT_KEY, SUGGEST} from './UrlType';



/**
 * jsonp获取qq音乐轮播图数据
 * @param _cb
 */
export function getRecommend(_cb) {

    //Object.assign():将多个对象合并为一个
    const _data=Object.assign({},commonParams,{
        uin:0,
        platform:'h5',
        needNewCode:1
    });

    req(RECOMMEND,_cb,_data);
}


/**
 * jsonp获取歌手列表
 * @param _cb
 */
export function getSingerList(_cb) {

    const _data=Object.assign({},commonParams,{
        channel:'singer',
        page:'list',
        key:'all_all_all',
        pagesize:100,
        pagenum:1,
        loginUin:0,
        hostUin:0,
        format:'jsonp',
        needNewCode:0,
        platform:'yqq',
    });

    req(SINGERLIST,_cb,_data);
}


/**
 * 获取对应歌手歌曲
 * @param _cb
 * @param _singerId
 */
export function getSongs(_cb,_singerId) {

    const _data=Object.assign({},commonParams,{
        order:'listen',
        begin:0,
        num:100,
        singerid:_singerId,
        uin:0,
        from:'h5',
        format:'jsonp',
        needNewCode:1,
        platform:'h5page',
    });

    req(SONGS,_cb,_data);
}


/**
 * 获取歌单的歌曲
 * @param _cb
 * @param _disstId
 */
export function getSongList(_cb, _disstId) {

    const _data = Object.assign({}, commonParams, {
        type: 1,
        json: 1,
        utf8: 1,
        format: 'jsonp',
        onlysong: 0,
        loginUin: 0,
        hostUin: 0,
        disstid: _disstId,
        needNewCode: 0,
        platform: 'yqq',
    });

    //这个比较特殊，如果不加prefix参数，返回的回调函数名为jp,和__jp对应不上，无法解析
    const options = {
        param: 'jsonpCallback',
        prefix: 'playlistinfoCallback'
    };

    myjsonp(SONGSLIST, _data, options).then(function (res) {
        if (_cb && res.code === ERR_OK) {
            _cb(res);
        }
    }).catch(function (err) {
        console.log(err);
    })
}


/**
 * 获取各大排行榜
 * @param _cb
 */
export function getTopList(_cb) {

    const _data = Object.assign({}, commonParams, {
        uin: 0,
        _: +new Date(),
        needNewCode: 1,
        platform: 'h5',
        format: 'jsonp'
    });

    req(TOPLIST, _cb, _data);
}


/**
 * 获取单个排行榜
 * @param _cb
 * @param _topid
 */
export function getSingleTopList(_cb, _topid) {

    const _data = Object.assign({}, commonParams, {
        uin: 0,
        _: +new Date(),
        needNewCode: 1,
        platform: 'h5',
        format: 'jsonp',
        tpl: 3,
        page: 'detail',
        type: 'top',
        topid: _topid,
    });

    req(SINGLE_TOP_LIST, _cb, _data);
}


/**
 * 获取关键词
 * @param _cb
 */
export function getHotKey(_cb) {

    const _data = Object.assign({}, commonParams, {
        uin: 0,
        _: +new Date(),
        needNewCode: 1,
        platform: 'h5',
        format: 'jsonp'
    });

    req(HOT_KEY, _cb, _data);
}


/**
 * 搜索关键字
 * @param _cb
 * @param _query
 * @param _zhida
 * @param _page
 */
export function getSuggest(_cb, _query, _zhida, _page, _perpage) {

    const _data = Object.assign({}, commonParams, {
        uin: 0,
        _: +new Date(),
        needNewCode: 1,
        platform: 'h5',
        format: 'jsonp',
        w: _query,
        zhidaqu: 1,
        catZhida: _zhida,            //要不要获取歌手的信息，1表示获取
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage: _perpage,
        n: _perpage,
        p: _page,                       //页数
        remoteplace: 'txt.mqq.all'

    });

    req(SUGGEST, _cb, _data);
}




/**
 * jsonp获取数据底层封装
 * @param _cb
 * @param _data
 * @param _url
 */
export function req(_url, _cb, _data) {

    myjsonp(_url, _data, options).then(function (res) {
        if (_cb && res.code === ERR_OK) {
            _cb(res);
        }
    }).catch(function (err) {
        console.log(err);
    })

}



/**
 * 通过nodeJs代理获取歌单
 * @param _cb
 */
export function getPlayList(_cb) {

    const data=Object.assign({},commonParams,{
        loginUin:0,
        hostUin:0,
        platform:'yqq',
        needNewCode:0,
        sin:0,
        ein:29,
        sortId:5,
        categoryId:10000000,
        rnd:Math.random()
    });

    Vue.axios.get('/api/getplaylist', {
        params:data
    }).then(function (res) {
        if(_cb && res.status === 200){
            _cb(res.data);
        }
    }).catch(function (err) {
        console.log(err);
    })

}


/**
 * 获取歌词
 * @param _mid
 * @param _cb
 */
export function getLyric(_mid, _cb) {

    const data=Object.assign({},commonParams,{
        callback: 'MusicJsonCallback_lrc',
        pcachetime: +new Date(),
        songmid: _mid,
        loginUin:0,
        hostUin:0,
        platform:'yqq',
        needNewCode:0,
    });

    Vue.axios.get('/api/getlyric', {
        params: data
    }).then(function (res) {
        if(_cb && res.status === 200){
            _cb(res.data);
        }
    }).catch(function (err) {
        console.log(err);
    })

}








