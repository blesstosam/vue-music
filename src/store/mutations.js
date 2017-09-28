import TYPES from './mutation-type';

export default {

   
    [TYPES.SET_SINGER](_s, _singer) {
        _s.singer = _singer;
    },

    [TYPES.SET_PLAYING_STATE](_s, _flag) {
        _s.playing = _flag;
    },

    [TYPES.SET_FULL_SCREEN](_s, _flag) {
        _s.fullScreen = _flag;
    },

    [TYPES.SET_PLAYLIST](_s, _list) {
        _s.playList = _list;
    },

    [TYPES.SET_SEQUENCE_LIST](_s, _list) {
        _s.sequenceList = _list;
    },

    [TYPES.SET_PLAY_MODE](_s, _flag) {
        _s.mode = _flag;
    },

    [TYPES.SET_CURRENT_INDEX](_s, _index) {
        _s.currentIndex = _index;
    },

    [TYPES.SET_DISC](_s, _disc) {
        _s.disc = _disc;
    },

    [TYPES.SET_TOP_LIST](_s, _topList) {
        _s.topList = _topList;
    },

    [TYPES.SET_SEARCH_HISTORY](_s, _history) {
        _s.searchHistory = _history;
    },

    [TYPES.SET_PLAY_HISTORY](_s, _history) {
        _s.playHistory = _history;
    },

    [TYPES.SET_FAVORITE_LIST](_s, _list) {
        _s.favoriteList = _list;
    }

}