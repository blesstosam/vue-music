<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot></slot>
        </div>
        <div class="dots">
            <span class="dot" :class="{active:currentPageIndex==index}" v-for="(i,index) in 5"></span>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll';
import {addClass} from '@/assets/js/dom';

export default {
    name:'slider',
    props: {       //外部传参来控制轮播图的效果
        loop: {
            type:Boolean,
            default:true
        },
        autoPlay: {
            type:Boolean,
            default:true
        },
        interval: {
            type:Number,
            default:3000
        }
    },
    created () {},
    mounted () {
        //为了保证在mounted的时候<slot>的dom已经渲染，需要在其父组件的外层加上v-if
        setTimeout(()=>{
            this.setSliderWidth();
            this.initSlider();

            if(this.autoPlay){
                this.Play();
            }
        },20);       //20毫秒是等待浏览器刷新

        window.addEventListener('resize',()=>{
            if(!this.slider){
                return;
            }
            this.setSliderWidth(true);
            this.slider.refresh();
        })
    },
    destroyed () {
        clearTimeout(this.timer);
    },
    data: function () {
        return {
            currentPageIndex:0
        }
    },

    components: {},
    methods: {
        setSliderWidth(isResize){
            //slider下的所有子元素
            //children 属性没有在data里注册，不会被watch
            //children不是数组,但是有length属性
            this.children=this.$refs.sliderGroup.children;

            let  width=0;
            let sliderWidth = this.$refs.slider.clientWidth;

            for (let i=0;i<this.children.length;i++){
                let child = this.children[i];
                addClass(child, 'slider-item');
                child.style.width = sliderWidth+'px';
                width+=sliderWidth;
            }

            if(this.loop && !isResize){
                width+=2*sliderWidth;
            }
            this.$refs.sliderGroup.style.width=width+'px';
        },
        initSlider(){
            this.slider = new BScroll(this.$refs.slider,{
                scrollX:true,
                scrollY:false,
                momentum:false,
                snap:true,
                snapLoop:this.loop,
                snapThreshold:0.3,
                snapSpeed:400
            });

            //每次滚动一次获取一次当前页数
            this.slider.on('scrollEnd',()=>{
                let pageIndex = this.slider.getCurrentPage().pageX;
                if(this.loop){
                    pageIndex -= 1;
                }
                this.currentPageIndex = pageIndex;

                clearTimeout(this.timer);
                this.Play();
            })
        },
        Play(){
            let pageIndex = this.currentPageIndex+1;
            if(this.loop){
                pageIndex+=1;
            }
            this.timer = setTimeout(()=>{
                this.slider.goToPage(pageIndex, 0, 400);
            },this.interval);
        }
    }
};

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "../../assets/stylus/variable.styl";

    .slider
        position :relative;
        min-height :1px;
        .slider-group
            position :relative;
            overflow :hidden;
            white-space :nowrap;         /* 文本不换行 */
            .slider-item
                float :left;
                box-sizing :border-box;
                overflow :hidden;
                text-align:center;
                a
                    display :block;
                    width:100%;
                    overflow :hidden;
                    text-decoration :none;
                img
                    display :block;
                    width:100%;
        .dots
            position :absolute;
            right:0;
            left:0;
            bottom 12px;
            text-align :center;
            font-size:0;
            .dot
                display :inline-block;
                margin:0 4px;
                width:8px;
                height:8px;
                border-radius :50%;
                background :$color-text-l;
                &.active
                    width:20px;
                    border-radius :5px;
                    background :$color-text-ll;


</style>

