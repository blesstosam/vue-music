<template>
    <Scroll :beforeScroll="beforeScroll"
            :pullup="pullup" class="suggest" :data="result"
            @scrollToEnd="searchMore" ref="suggest"
            @beforeScroll="listScroll">
        <ul class="suggest-list">
            <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
                <div class="icon" >
                    <i :class="item | getIconCls"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDiscName(item)"></p>
                </div>
            </li>

            <Loading v-show="hasMore" title=""></Loading>

        </ul>

        <div v-show="!hasMore && !result.length" class="no-result-wrapper">
            <NoResult title="暂无结果" ></NoResult>
        </div>

    </Scroll>
</template>

<script>
import {getSuggest} from '@/api/index'
import {createSong} from '@/assets/js/Song'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import Singer from '@/assets/js/Singer'
import {mapMutations, mapActions} from 'vuex'
import TYPES from '@/store/mutation-type'
import NoResult from '@/base/no-result/no-result'

const TYPE_SINGER = 'singer';
const perPage = 20;

export default {
    name: 'suggest',
    props: {
        query: {
            type: String,
            default: ''
        },
        showSinger: {
            type: Number,
            default: 1       //1表示true,但是传参不能用true
        }
    },
    watch: {
        query(newVal) {
            this.search(newVal);
        }
    },
    data() {
        return {
            page: 1,
            result: [],
            pullup: true,         //将该值传递给滑动组件，告知其监听下拉到底事件并派发出来
            hasMore: true,
            beforeScroll: true
        }
    },
    created() {},
    computed: {

    },
    filters: {
        getIconCls(item) {
            if(item.type === TYPE_SINGER) {
                return 'icon-mine';
            }else {
                return 'icon-music';
            }
        },

    },
    components: {Scroll, Loading, NoResult},
    methods: {
        refresh() {
            this.$refs.suggest.refresh();
        },
        listScroll() {
            this.$emit('scrollList');
        },
        selectItem(item) {
            if(item.type === TYPE_SINGER) {
                const singer = new Singer(
                    item.singermid,
                    item.singername,
                    item.singerid
                );
                this.$router.push({path: `/singer/${singer.id}`});
                this.setSinger(singer);
            }else {
                this.insertSong(item)
            }

            this.$emit('select');
        },
        getDiscName(item) {
            if(item.type === TYPE_SINGER) {
                return item.singername;
            }else {
                return `${item.name} - ${item.singer}`;
            }
        },
        search() {

            //该方法只有在第一次触发
            this.page = 1;
            this.hasMore = true;
            this.$refs.suggest.scrollTo(0, 0);
            getSuggest((res) => {
                this.result = this.formatResult(res.data);
                console.log(this.result);
                this.checkMore(res.data);
            }, this.query, this.showSinger, this.page, perPage);
        },
        searchMore() {
            if(!this.hasMore) {
                return;
            }

            this.page++;
            getSuggest((res) => {
                this.result = this.result.concat(this.formatResult(res.data));
                this.checkMore(res.data);
            }, this.query, this.showSinger, this.page, perPage);
        },
        checkMore(data) {
            let song = data.song;
            if (!song.list.length || (song.curnum + song.curpage * perPage) >= song.totalnum) {
                this.hasMore = false;
            }
        },
        formatResult(data) {
            let ret = [];
            if (data.zhida && data.zhida.singerid) {
                ret.push({...data.zhida, ...{type: TYPE_SINGER}})
            }

            if(data.song) {
                ret = ret.concat(this.formatSong(data.song.list));
            }

            return ret;
        },
        formatSong(list) {
            let ret = [];
            list.forEach((item) => {
                if(item.songid && item.albumid) {
                    ret.push(createSong(item));
                }
            });

            return ret;
        },
        ...mapMutations({
            setSinger: TYPES.SET_SINGER
        }),
        ...mapActions([
            'insertSong'
        ])
    }
};

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "../../assets/stylus/variable"
    @import "../../assets/stylus/mixin"

    .suggest
        height: 100%
        overflow: hidden
        .suggest-list
            padding: 0 30px
            .suggest-item
                display: flex
                align-items: center
                padding-bottom: 20px
            .icon
                flex: 0 0 30px
                width: 30px
                [class^="icon-"]
                    font-size: 14px
                    color: $color-text-d
            .name
                flex: 1
                font-size: $font-size-medium
                color: $color-text-d
                overflow: hidden
                .text
                    no-wrap()
        .no-result-wrapper
            position: absolute
            width: 100%
            left: 0
            top: 50%
            transform: translateY(-50%)

</style>

