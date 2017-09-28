
import TYPES from './mutation-type';
import {playMode} from '@/assets/js/config';
import {shuffle} from '@/assets/js/util';
import {saveSearch,
        deleteSearch,
        clearSearch,
        savePlay,
        saveFavorite,
        deleteFavorite} from '@/assets/js/cache'


function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id;
    })
}

export default {

    /**
     * 选择播放
     * @param commit
     * @param state
     * @param list
     * @param index
     */
    selectPlay: ({commit,state}, {list, index}) => {


        commit(TYPES.SET_SEQUENCE_LIST, list);

        if (state.mode === playMode.random) {
            let randomList = shuffle(list);
            commit(TYPES.SET_PLAYLIST, randomList);
            index = findIndex(list, list[index]);
        } else {
            commit(TYPES.SET_PLAYLIST, list)
        }

        commit(TYPES.SET_CURRENT_INDEX, index);
        commit(TYPES.SET_FULL_SCREEN, true);
        commit(TYPES.SET_PLAYING_STATE, true);

    },

    /**
     * 随机播放
     * @param commit
     * @param list
     */
    randomPlay: ({commit}, {list}) => {

        commit(TYPES.SET_PLAY_MODE, playMode.random);
        commit(TYPES.SET_PLAYING_STATE, true);
        commit(TYPES.SET_SEQUENCE_LIST, list);
        let randomList = shuffle(list);
        commit(TYPES.SET_PLAYLIST, randomList);
        commit(TYPES.SET_CURRENT_INDEX, 0);
        commit(TYPES.SET_FULL_SCREEN, true);
    },

    /**
     * 添加一首歌曲
     * @param commit
     * @param state
     * @param song
     */
    insertSong: ({commit, state}, song) => {

        let playList = state.playList.slice();        //拷贝一份副本，避免直接修改state
        let sequenceList = state.sequenceList.slice();
        let currentIndex = state.currentIndex;

        //获取当前播放的歌曲
        let currentSong = playList[currentIndex];

        //获取当前歌曲在列表中的索引
        let fpIndex = findIndex(playList, song);

        //在当前播放歌曲之后插入
        currentIndex++;
        playList.splice(currentIndex, 0, song);

        //如果已经包含这首歌还要删除这首歌
        if (fpIndex > -1) {
            if (currentIndex > fpIndex) {
                playList.splice(fpIndex, 1);
                currentIndex--;
            } else {
                playList.splice(fpIndex + 1, 1);
            }
        }


        let currentSIndex = findIndex(sequenceList, currentSong) + 1;

        let fsIndex = findIndex(sequenceList, song);

        sequenceList.splice(currentSIndex, 0, song);

        if (fsIndex > -1) {
            if (currentSIndex > fsIndex) {
                sequenceList.splice(fsIndex, 1);
            } else {
                sequenceList.splice(fsIndex + 1, 1);
            }
        }


        commit(TYPES.SET_PLAYLIST, playList);
        commit(TYPES.SET_SEQUENCE_LIST, sequenceList);
        commit(TYPES.SET_CURRENT_INDEX, currentIndex);
        commit(TYPES.SET_FULL_SCREEN, true);
        commit(TYPES.SET_PLAYING_STATE, true);

    },


    /**
     * 删除一首歌
     * @param commit
     * @param state
     * @param song
     */
    deleteSong: ({commit, state}, song) => {

        let playList = state.playList.slice();
        let sequenceList = state.sequenceList.slice();
        let currentIndex = state.currentIndex;

        let pIndex = findIndex(playList, song);
        playList.splice(pIndex,1);
        let sIndex = findIndex(sequenceList, song);
        sequenceList.splice(sIndex, 1);

        if (currentIndex > pIndex || currentIndex === playList.length) {
            currentIndex--;
        }

        commit(TYPES.SET_PLAYLIST, playList);
        commit(TYPES.SET_SEQUENCE_LIST, sequenceList);
        commit(TYPES.SET_CURRENT_INDEX, currentIndex);

        //如果列表被删除为0，强播放状态状态设置为false
        const _state = playList.length > 0;
        commit(TYPES.SET_PLAYING_STATE, _state);

    },


    /**
     * 清空歌曲列表
     * @param commit
     * @param state
     */
    deleteSongList: ({commit}) => {

        commit(TYPES.SET_PLAYLIST, []);
        commit(TYPES.SET_SEQUENCE_LIST, []);
        commit(TYPES.SET_CURRENT_INDEX, -1);
        commit(TYPES.SET_PLAYING_STATE, false);

    },



    /**
     * 保存搜索记录到localhistory并且更新到vuex
     * @param commit
     * @param query
     */
    saveSearchHistory: ({commit}, query) => {

        commit(TYPES.SET_SEARCH_HISTORY, saveSearch(query));

    },

    /**
     * 删除一条搜索记录
     * @param commit
     * @param query
     */
    deleteSearchHistory: ({commit}, query) => {

        commit(TYPES.SET_SEARCH_HISTORY, deleteSearch(query));

    },


    /**
     * 删除所有历史记录
     * @param commit
     */
    clearSearchHistory: ({commit}) => {

        commit(TYPES.SET_SEARCH_HISTORY, clearSearch());

    },


    /**
     * 保存一首播放记录并保存在localStorage
     * @param commit
     * @param song
     */
    savePlayHistory: ({commit}, song) => {

        commit(TYPES.SET_PLAY_HISTORY, savePlay(song));

    },


    saveFavoriteList: ({commit}, song) => {

        commit(TYPES.SET_FAVORITE_LIST, saveFavorite(song));

    },


    deleteFavoriteList: ({commit}, song) => {

        commit(TYPES.SET_FAVORITE_LIST, deleteFavorite(song));

    }

}