<template>
    <Scroll class="listview"
            :data="data"
            ref="listView"
            :listenScroll="listenScroll"
            @scroll="handleScroll"
            :probeType="probeType">
        <ul>
            <li v-for="group in data" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li @click="selectItem(i,$event)" v-for="i in group.items" class="list-group-item">
                        <img class="avatar" v-lazy="i.avatar" />
                        <span class="name">{{i.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut"
             @touchstart="onShortcutTouchStart"
             @touchmove.stopprevent="onShortcutTouchMove">
            <ul>
                <li v-for="(i,index) in shortcutList" class="item"
                    :data-index="index"
                    :class="{current:currentIndex==index}">{{i}}</li>
            </ul>
        </div>

        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
            <h1 class="fixed-title">{{fixedTitle}}</h1>
        </div>

        <div v-show="!data.length" class="loading-container">
            <Loading></Loading>
        </div>
    </Scroll>

</template>

<script>

    import Scroll from '../scroll/scroll.vue';
    import Loading from '@/base/loading/loading';
    import {getData} from '@/assets/js/dom.js';

    const ANCHOR_HEIGHT = 18;  //字母dom的高度
    const TITLE_HEIGHT = 30;  //fixed的高度

    export default {
        name:'listview',
        components:{Scroll,Loading},
        created() {
            this.touch={};
            this.listenScroll=true;
            this.listHeight = [];
            this.probeType=3;
        },
        mounted() {

        },
        data() {
            return {
                scrollY:-1,
                currentIndex:0,
                diff:-1
            }
        },
        watch:{
            data() {
                setTimeout(() => {
                    this.calHeight();
                }, 20)
            },
            scrollY(newY) {
                let listHeight = this.listHeight;

                //当滚动到顶部，newY>0
                if(newY>0){
                    this.currentIndex = 0;
                    return;
                }

                //当滚动到中部
                for(let i = 0; i<listHeight.length-1; i++){
                    let height1 = listHeight[i];
                    let height2 = listHeight[i+1];
                    if(-newY >= height1 && -newY < height2){
                        this.currentIndex = i;
                        this.diff = height2 + newY;
                        return;
                    }
                }

                //滚动到底部，且-newY大于最后一个元素的上限
                this.currentIndex = listHeight.length-2;
            },
            diff(newVal) {
                let fixedTop = (newVal>0 && newVal<TITLE_HEIGHT)?newVal-TITLE_HEIGHT:0;
                if (this.fixedTop === fixedTop){
                    return;
                }
                this.fixedTop = fixedTop;

                //dom操作
                this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
            }
        },
        computed: {
            shortcutList() {
                return this.data.map((group) => {
                    return group.title.substr(0, 1);
                })
            },
            fixedTitle() {
                if (this.scrollY > 0) {
                    return '';
                }
                return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
            }
        },
        props:{
            data:{
                type:Array,
                default:[]
            }
        },
        methods:{
            refresh() {
                this.$refs.listView.refresh();
            },
            selectItem(item) {
                this.$emit('select',item);
            },
            onShortcutTouchStart(e) {
                let anchorIndex = getData(e.target, 'index');
                let firstTouch = e.touches[0];
                this.touch.y1 = firstTouch.pageY;
                this.touch.anchorIndex = anchorIndex;

                this.scrollTo(anchorIndex);
            },
            onShortcutTouchMove(e) {
                let firstTouch = e.touches[0];
                this.touch.y2 = firstTouch.pageY;
                let delta = (this.touch.y2-this.touch.y1)/ANCHOR_HEIGHT | 0;   //y轴方向的位移了几个字母
                let anchorIndex=parseInt(this.touch.anchorIndex)+delta;

                this.scrollTo(anchorIndex);
            },
            handleScroll(pos) {
                this.scrollY=pos.y;
            },
            scrollTo(index) {
                if(!index && index!==0){
                    return;
                }

                if (index < 0){
                    index = 0;
                } else if (index>this.listHeight.length-2){
                    index = this.lineHeight.length-2;
                }

                this.scrollY=-this.listHeight[index];
                this.$refs.listView.scrollToElement(this.$refs.listGroup[index],0);
            },
            calHeight() {                //获取每个字母的posY值
                this.listHeight = [];
                let list=this.$refs.listGroup;
                let height = 0;
                this.listHeight.push(height);
                for(let i=0; i<list.length; i++){
                    let item =list[i];
                    height+=item.clientHeight;
                    this.listHeight.push(height);
                }
            }
        }
    }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "../../assets/stylus/variable"

    .listview
        position: relative
        width: 100%
        height: 100%
        overflow: hidden
        background: $color-background
        .list-group
            padding-bottom: 30px
        .list-group-title
            height: 30px
            line-height: 30px
            padding-left: 20px
            font-size: $font-size-small
            color: $color-text-l
            background: $color-highlight-background
        .list-group-item
            display: flex
            align-items: center
            padding: 20px 0 0 30px
            .avatar
                width: 50px
                height: 50px
                border-radius: 50%
            .name
                margin-left: 20px
                color: $color-text-l
                font-size: $font-size-medium
        .list-shortcut
            position: absolute
            z-index: 30
            right: 0
            top: 50%
            transform: translateY(-50%)
            width: 20px
            padding: 20px 0
            border-radius: 10px
            text-align: center
            background: $color-background-d
            font-family: Helvetica
            .item
                padding: 3px
                line-height: 1
                color: $color-text-l
                font-size: $font-size-small
                &.current
                    color: $color-theme

        .list-fixed
            position: absolute
            top: -1px
            left: 0
            width: 100%
        .fixed-title
            height: 30px
            line-height: 30px
            padding-left: 20px
            font-size: $font-size-small
            color: $color-text-l
            background: $color-highlight-background
        .loading-container
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>

