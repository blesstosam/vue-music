

export default {
    singer: _s => _s.singer,

    playing: _s => _s.playing,
    fullScreen: _s => _s.fullScreen,
    playList: _s => _s.playList,
    sequenceList: _s => _s.sequenceList,
    currentIndex: _s => _s.currentIndex,
    mode: _s => _s.mode,
    currentSong: (_s) => {
        return _s.playList[_s.currentIndex] || {}
    },

    disc: _s => _s.disc,

    topList: _s => _s.topList,

    searchHistory: _s => _s.searchHistory,

    playHistory: _s => _s.playHistory,

    favoriteList: _s => _s.favoriteList,
}