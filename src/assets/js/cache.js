import storage from 'good-storage'


const SEARCH_KEY = '__search__';
const SEARCH_MAX_LENGTH = 15;


const PLAY_KEY = '__play__';
const PLAY_MAX_LENGTH = 200;


const FAVORITE_KEY = '__favorite__';
const FAVORITE_MAX_LENGTH = 200;


/**
 * 插入一条搜索记录
 * @param arr
 * @param val
 * @param compare
 * @param maxLen
 */
function insertArray(arr, val, compare, maxLen) {

    const index = arr.findIndex(compare);

    //如果搜索词是第一个，不用任何操作
    if (index === 0) {
        return;
    }

    //如果搜索词不是第一个，删除那个元素
    if (index > 0) {
        arr.splice(index, 1);
    }

    //添加到第一个
    arr.unshift(val);

    if (maxLen && arr.length > maxLen) {
        arr.pop();
    }

}


/**
 * 删除一条搜索记录
 * @param arr
 * @param compare
 */
export function deleteFromArray(arr, compare) {

    const index = arr.findIndex(compare);

    if (index > -1) {
        arr.splice(index, 1);
    }

}


/**
 * 保存单条搜索记录
 * @param query
 * @returns {Object|*|Node}
 */
export function saveSearch(query) {

    let searches = storage.get(SEARCH_KEY, []);

    insertArray(searches, query, (item) => {
        return item === query;
    }, SEARCH_MAX_LENGTH);

    storage.set(SEARCH_KEY, searches);

    return searches;

}


/**
 * 返回所有搜索记录
 * @returns {Object|*|Node}
 */
export function loadSearch() {

    return storage.get(SEARCH_KEY, []);

}


/**
 * 删除单条记录
 * @param query
 * @returns {Object|*|Node}
 */
export function deleteSearch(query) {

    let searches = storage.get(SEARCH_KEY, []);

    deleteFromArray(searches, (item) => {
        return item === query;
    });

    storage.set(SEARCH_KEY, searches);

    return searches;

}


/**
 * 删除所有搜索记录
 * @param query
 * @returns {Array}
 */
export function clearSearch() {

   storage.remove(SEARCH_KEY);

   return [];

}


/**
 * 保存播放历史
 * @param song
 * @returns {Node|Object|*}
 */
export function savePlay(song) {

    let songs = storage.get(PLAY_KEY, []);

    insertArray(songs, song, (item) => {
        return item.id === song.id;
    }, PLAY_MAX_LENGTH);

    storage.set(PLAY_KEY, songs);

    return songs;

}


/**
 * 加载播放历史
 * @returns {Node|Object|*}
 */
export function loadPlay() {

    return storage.get(PLAY_KEY, []);

}


export function saveFavorite(song) {

    let songs = storage.get(FAVORITE_KEY, []);

    insertArray(songs, song, (item) => {
        return item.id === song.id;
    }, FAVORITE_MAX_LENGTH);

    storage.set(FAVORITE_KEY, songs);

    return songs;

}


export function deleteFavorite(song) {

    let songs = storage.get(FAVORITE_KEY, []);

    deleteFromArray(songs, (item) => {
        return item.id === song.id;
    });

    storage.set(FAVORITE_KEY, songs);

    return songs;

}

export function loadFavorite() {

    return storage.get(FAVORITE_KEY, []);

}










