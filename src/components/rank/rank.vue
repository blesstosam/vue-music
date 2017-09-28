<template>
    <div class="rank" ref="rank">
        <Scroll :data="topList" class="toplist" ref="toplist">
            <ul>
                <li class="item" v-for="item in topList" @click="selectItem(item)">
                    <div class="icon">
                        <img v-lazy="item.picUrl" width="100" height="100" />
                    </div>
                    <ul class="songlist" >
                        <li class="song" v-for="(song,index) in item.songList">
                            <span>{{index+1}}</span>
                            <span>{{song.songname}} - {{song.singername}}</span>
                        </li>
                    </ul>

                </li>
            </ul>
            <div class="loading-container" v-show="!topList.length">
                <Loading></Loading>
            </div>
        </Scroll>
        <router-view></router-view>
    </div>
</template>

<script>

import {getTopList} from '@/api/index'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import {playListMixin} from '@/assets/js/mixin'
import {mapMutations} from 'vuex'
import TYPES from '@/store/mutation-type';

export default {
    name:'rank',
    mixins: [playListMixin],
    data: function () {
        return {
            topList: []
        }
    },
    created: function () {
        this.reqTopList();
    },
    mounted() {

    },
    components: {Scroll, Loading},
    methods: {
        selectItem(item) {
            this.$router.push({path: `/rank/${item.id}`});
            this.setTopList(item);
        },
        handlePlayList(playlist) {
            let bottom = playlist.length ? '60px' : '';
            this.$refs.rank.style.bottom = bottom;
            this.$refs.toplist.refresh();
        },
        reqTopList() {
            getTopList((res) => {
                this.topList = res.data.topList;
            })
        },
        ...mapMutations({
            setTopList: TYPES.SET_TOP_LIST
        })
    }
};

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "../../assets/stylus/variable"
    @import "../../assets/stylus/mixin"

    .rank
        position: fixed
        width: 100%
        top: 88px
        bottom: 0
        .toplist
            height: 100%
            overflow: hidden
            .item
                display: flex
                margin: 0 20px
                padding-top: 20px
                height: 100px
                &:last-child
                    padding-bottom: 20px
                .icon
                    flex: 0 0 100px
                    width: 100px
                    height: 100px
                .songlist
                    flex: 1
                    display: flex
                    flex-direction: column
                    justify-content: center
                    padding: 0 20px
                    height: 100px
                    overflow: hidden
                    background: $color-highlight-background
                    color: $color-text-d
                    font-size: $font-size-small
                    .song
                        no-wrap()
                        line-height: 26px
            .loading-container
                position: absolute
                width: 100%
                top: 50%
                transform: translateY(-50%)

</style>

