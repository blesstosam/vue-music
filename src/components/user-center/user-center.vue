<template>
    <transition name="slide">
        <div class="user-center">
            <div class="back" @click="back">
                <i class="icon-back"></i>
            </div>
            <div class="switches-wrapper">
                <Switches v-bind="{'currentIndex':currentIndex,'switches':switches}"
                    @switch="switchItem"></Switches>
            </div>
            <div class="play-btn" ref="playBtn" @click="random">
                <i class="icon-play"></i>
                <span class="text">随机播放全部</span>
            </div>
            <div class="list-wrapper" ref="listWrapper">
                <Scroll ref="favoriteList" class="list-scroll" v-if="currentIndex===0"
                        :data="favoriteList">
                    <div class="list-inner">
                        <SongList :songs="favoriteList" @select="selectSong"></SongList>
                    </div>
                </Scroll>
                <Scroll ref="playHistoryList" class="list-scroll" v-if="currentIndex===1"
                        :data="playHistory">
                    <div class="list-inner">
                        <SongList @select="selectSong" :songs="playHistory"></SongList>
                    </div>
                </Scroll>
            </div>
            <div class="no-result-wrapper" v-show="showNoResult">
                <NoResult :title="noResultText"></NoResult>
            </div>
        </div>
    </transition>
</template>

<script>
import Switches from '@/base/switches/switches'
import Scroll from '@/base/scroll/scroll'
import SongList from '@/base/song-list/song-list'
import Song from '@/assets/js/Song'
import NoResult from '@/base/no-result/no-result'
import {mapGetters,mapActions} from 'vuex'
import {playListMixin} from '@/assets/js/mixin'

export default {
    name: 'user-center',
    mixins: [playListMixin],
    data() {
        return {
            currentIndex: 0,
            switches: [
                {name: '我喜欢的'},
                {name: '最近播放'}
            ]
        }
    },
    created() {

    },
    computed: {
        showNoResult() {

            return !this.favoriteList.length && this.currentIndex === 0 ||
                !this.playHistory.length && this.currentIndex === 1

        },
        noResultText() {
            return this.currentIndex === 0 ? '你还没有收藏歌曲' : '你还没有播放过歌曲';
        },
        ...mapGetters([
            'favoriteList',
            'playHistory'
        ])
    },
    components: {Switches, Scroll, SongList, NoResult},
    methods: {
        handlePlayList(playlist) {
            const bottom = playlist.length > 0 ? '60px' : '';
            this.$refs.listWrapper.style.bottom = bottom;
            this.$refs.favoriteList && this.$refs.favoriteList.refresh();
            this.$refs.playHistoryList && this.$refs.playHistoryList.refresh();
        },
        switchItem(index) {
            this.currentIndex = index;
        },
        back() {
            this.$router.back();
        },
        selectSong(song, index) {
            if (this.currentIndex === 0) {
                this.insertSong(new Song(song));
            }else {
                if (index !== 0) {
                    this.insertSong(new Song(song));
                }
            }
        },
        random() {
            let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
            if (!list.length) {
                return;
            }
            list = list.map((item) => {
                return new Song(item);
            });
            this.randomPlay({
                list
            });
        },
        ...mapActions([
            'insertSong',
            'randomPlay'
        ])
    }
};

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "../../assets/stylus/variable"

    .user-center
        position: fixed
        top: 0
        bottom: 0
        z-index: 100
        width: 100%
        background: $color-background
        &.slide-enter-active, &.slide-leave-active
            transition: all 0.3s
        &.slide-enter, &.slide-leave-to
            transform: translate3d(100%, 0, 0)
        .back
            position absolute
            top: 0
            left: 6px
            z-index: 50
            .icon-back
                display: block
                padding: 10px
                font-size: $font-size-large-x
                color: $color-theme
        .switches-wrapper
            margin: 10px 0 30px 0
        .play-btn
            box-sizing: border-box
            width: 135px
            padding: 7px 0
            margin: 0 auto
            text-align: center
            border: 1px solid  $color-text-l
            color: $color-text-l
            border-radius: 100px
            font-size: 0
            .icon-play
                display: inline-block
                vertical-align: middle
                margin-right: 6px
                font-size: $font-size-medium-x
            .text
                display: inline-block
                vertical-align: middle
                font-size: $font-size-small
        .list-wrapper
            position: absolute
            top: 110px
            bottom: 0
            width: 100%
            .list-scroll
                height: 100%
                overflow: hidden
                .list-inner
                    padding: 20px 30px
        .no-result-wrapper
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)

</style>

