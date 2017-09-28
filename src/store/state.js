
import {playMode} from '../assets/js/config';
import {loadSearch, loadPlay, loadFavorite} from '../assets/js/cache'

export default {
    singer : {},

    //播放歌曲状态
    playing : false,
    fullScreen : false,
    playList : [],             //实际播放列表
    sequenceList : [],         //顺序播放列表
    mode : playMode.sequence,  //默认顺序播放
    currentIndex : -1,          //当前播放歌曲索引

    disc: {},                   //歌单
    topList: {},

    searchHistory: loadSearch(),          //搜索历史,初始值为localStorage里读取的

    playHistory: loadPlay(),

    favoriteList: loadFavorite()

}