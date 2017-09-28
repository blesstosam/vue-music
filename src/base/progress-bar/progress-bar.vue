<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress">

            </div>
            <div class="progress-btn-wrapper" ref="progressBtn"
                 @touchstart="progressTouchStart"
                 @touchmove="progressTouchMove"
                 @touchend="progressTouchEnd">
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
import {prefixStyle} from '@/assets/js/dom.js';

const progressBtnWidth = 16;
const transform = prefixStyle('transform');

export default {
    name:'process-bar',
    data: function () {
        return {}
    },
    props: {
        percent: {
            type : Number,
            default : 0
        },

    },
    watch: {
        percent(newPercent) {
            if (newPercent >= 0 && !this.touch.init) {
                const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
                let offsetWidth = newPercent * barWidth;
                this.offset(offsetWidth);
            }
        }
    },
    created() {
        this.touch = {};            //保存touch的一些属性
    },
    components: {},
    methods: {
        offset(offsetWidth) {       //控制进度条函数封装
            this.$refs.progress.style.width = `${offsetWidth}px`;
            this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
        },
        progressTouchStart(e) {
            console.log('start...')
            this.touch.init = true;
            this.touch.startX = e.touches[0].pageX;
            this.touch.left = this.$refs.progress.clientWidth;
        },
        progressTouchMove(e) {
            console.log('move...')
            if(!this.touch.init) {
                return;
            }
            let deltaX = e.touches[0].pageX - this.touch.startX;
            const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
            let offsetWidth = Math.min(barWidth, Math.max(0, deltaX + this.touch.left));
            this.offset(offsetWidth);
        },
        progressTouchEnd(e) {
            console.log('end...')
            this.touch.init = false;

            //要将音乐的已播放时间改对
            //将进度条的百分比传递给父组件
            this.triggerPercent();
        },
        triggerPercent() {
            const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
            let percent = this.$refs.progress.clientWidth / barWidth;
            this.$emit('percentChange', percent);
        },
        progressClick(e) {
            //获取当前dom的边距
            let rect = this.$refs.progressBar.getBoundingClientRect();
            let offsetWidth = e.pageX - rect.left;
            this.offset(offsetWidth);
            this.triggerPercent();
        }
    }
};

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "../../assets/stylus/variable"

    .progress-bar
        height: 30px
        .bar-inner
            position: relative
            top: 13px
            height: 4px
            background: rgba(0, 0, 0, 0.3)
            .progress
                position: absolute
                height: 100%
                background: $color-theme
            .progress-btn-wrapper
                position: absolute
                left: -8px
                top: -13px
                width: 30px
                height: 30px
                .progress-btn
                    position: relative
                    top: 7px
                    left: 7px
                    box-sizing: border-box
                    width: 16px
                    height: 16px
                    border: 3px solid $color-text
                    border-radius: 50%
                    background: $color-theme

</style>

