
import {playMode} from '@/assets/js/config'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import TYPES from '@/store/mutation-type'
import {shuffle} from '@/assets/js/util.js'


export const playListMixin = {

    computed: {
        ...mapGetters([
            'playList'
        ])
    },
    mounted() {
        console.log('from mixin')
        this.handlePlayList(this.playList);
    },
    activated() {
        this.handlePlayList(this.playList);
    },
    watch: {
        playList(newVal) {
            this.handlePlayList(newVal);
        }
    },
    methods: {
        handlePlayList() {

            //告知当前组件要重写该方法
            throw new Error('component must implement handlePlayList method');

        }

    }

};



export const playerMixin = {

    computed: {
        iconMode() {
            return this.mode === playMode.sequence ? 'icon-sequence' : this.mode ===
            playMode.loop ? 'icon-loop' : 'icon-random';
        },
        ...mapGetters([
            'sequenceList',
            'currentSong',
            'playList',
            'mode',
            'favoriteList'
        ])
    },
    methods: {
        changeMode() {
            let _mode = this.mode !== playMode.random ? ++this.mode : playMode.sequence;
            this.setMode(_mode);

            //打乱播放列表顺序
            let _list = null;
            if (this.mode === playMode.random) {
                _list = shuffle(this.sequenceList);
            } else {
                _list = this.sequenceList;
            }

            this.resetCurrentIndex(_list);
            this.setPlayList(_list);
        },
        resetCurrentIndex(_list) {
            let _index = _list.findIndex((item) => {
                return item.id === this.currentSong.id;    //找到当前歌曲在playList中的index
            });
            this.setCurrentIndex(_index);               //保证当前歌曲不变
        },
        getFavoriteIcon(song) {
            if (this.isFavorite(song)) {
                return 'icon-favorite';
            }
            return 'icon-not-favorite';
        },
        toggleFavorite(song) {
            if (this.isFavorite(song)) {
                this.deleteFavoriteList(song);
            }else {
                this.saveFavoriteList(song);
            }
        },
        isFavorite(song) {
            let index= this.favoriteList.findIndex((item) => {
                return item.id === song.id
            });
            return index > -1;
        },
        ...mapMutations({
            setPlayingState: TYPES.SET_PLAYING_STATE,
            setCurrentIndex: TYPES.SET_CURRENT_INDEX,
            setMode: TYPES.SET_PLAY_MODE,
            setPlayList: TYPES.SET_PLAYLIST
        }),
        ...mapActions([
            'saveFavoriteList',
            'deleteFavoriteList'
        ])

    }

};



export const searchMixin = {
    data() {
        return {
            query: ''
        }
    },
    computed: {
        ...mapGetters([
            'searchHistory'
        ])
    },
    methods: {
        blurInput() {
            this.$refs.searchBox.blur();
        },
        saveSearch() {
            this.saveSearchHistory(this.query);
        },
        getQuery(val) {
            this.query = val;
        },
        addQuery(query) {
            this.$refs.searchBox.setQuery(query);
        },
        //相当于在methods里添加以下方法
        ...mapActions([
            'saveSearchHistory',
            'deleteSearchHistory'
        ])
    }

};