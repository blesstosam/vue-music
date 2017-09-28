<template>
    <div class="recommend" ref="recommend">
        <Scroll ref="scroll" class="recommend-content" :data="discList">
            <div>
                <!-- 确保有数据才渲染该dom插入到slot -->
                <div v-if="slider.length" class="slider-wrapper">
                    <Slider>
                        <div v-for="i in slider">
                            <a :href="i.linkUrl">
                                <!--挂一个needsclick的class钩子，让其触发原生事件-->
                                <img class="needsclick" @load="loadImage" :src="i.picUrl" />
                            </a>
                        </div>
                    </Slider>
                </div>

                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul>
                        <li class="item"
                            v-for="item in discList"
                            @click="selectItem(item)">
                            <div class="icon">
                                <img width="60" height="60" v-lazy="item.imgurl" />
                            </div>
                            <div class="text">
                                <h2 class="name" v-html="item.creator.name"></h2>
                                <p class="desc" v-html="item.dissname"></p>
                            </div>
                        </li >
                    </ul>
                </div>
            </div>

            <div class="loading" v-show="!discList.length">
                <Loading></Loading>
            </div>
        </Scroll>

        <router-view></router-view>
    </div>
</template>

<script>
import {getRecommend,getPlayList} from '@/api/index';
import Slider from '@/base/slider/slider';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading'
import {playListMixin} from '@/assets/js/mixin.js'
import {mapMutations} from 'vuex'
import TYPES from '@/store/mutation-type.js';

export default {
    name:'recommend',
    mixins: [playListMixin],
    components:{Slider,Scroll,Loading},
    data: function () {
        return {
            slider:[],
            discList:[]
        }
    },
    created () {},
    mounted () {
        console.log('recommend mounted...');
        this.reqData();
    },
    destroyed () {
        console.log('recommend destroyed...')
    },
    methods: {
        selectItem(item) {
            this.$router.push({path: `/recommend/${item.dissid}`});
            this.setDisc(item);
        },
        handlePlayList(playlist) {
            let bottom = playlist.length > 0 ? '60px' : '';
            this.$refs.recommend.style.bottom = bottom;
            this.$refs.scroll.refresh();
        },
        reqData(){
            getRecommend( (res) => {
                this.slider=res.data.slider;

            });
            getPlayList((res)=>{
                this.discList=res.data.list;
            })
        },
        loadImage() {
            //确保只刷新一次
            if (!this.checkLoaded){
                this.$refs.scroll.refresh();
                this.checkLoaded=true;
            }
        },
        ...mapMutations({
            setDisc: TYPES.SET_DISC
        })
    }
};

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "../../assets/stylus/variable"

    .recommend
        position: fixed
        width: 100%
        top: 88px
        bottom: 0
        .recommend-content
            height: 100%
            overflow: hidden
            .slider-wrapper
                position: relative
                width: 100%
                overflow: hidden
            .recommend-list
                .list-title
                    height: 65px
                    line-height: 65px
                    text-align: center
                    font-size: $font-size-medium
                    color: $color-theme
                .item
                    display: flex
                    box-sizing: border-box
                    align-items: center
                    padding: 0 20px 20px 20px
                    .icon
                        flex: 0 0 60px
                        width: 60px
                        padding-right: 20px
                    .text
                        display: flex
                        flex-direction: column
                        justify-content: center
                        flex: 1
                        line-height: 20px
                        overflow: hidden
                        font-size: $font-size-medium
                        .name
                            margin-bottom: 10px
                            color: $color-text
                        .desc
                            color: $color-text-d
        .loading
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)




</style>

