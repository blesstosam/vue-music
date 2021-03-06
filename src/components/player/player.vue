<template>
    <div class="player" v-show="playList.length">
        <!--大播放器-->
        <transition name="normal"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterLeave"
        >
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img width="100%" height="100%" :src="currentSong.image"/>
                </div>

                <div class="top">
                    <div class="back" @click="back">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>

                <div class="middle"
                     @touchstart.prevent="middleTouchStart"
                     @touchmove.prevent="middleTouchMove"
                     @touchend="middleTouchEnd">
                    <div class="middle-l" ref="middleLeft">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" :class="cdCls">
                                <img class="image" :src="currentSong.image"/>
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{playingLyric}}</div>
                        </div>
                    </div>
                    <Scroll :data="currentLyric && currentLyric.lines" class="middle-r" ref='lyricList'>
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">       <!-- 防止数据未返回就渲染 -->
                                <p class="text" :class="{current:currentLineNum == index}"
                                   ref="lyricLine"
                                   v-for="(line,index) in currentLyric.lines">
                                    {{line.txt}}
                                </p>
                            </div>
                        </div>
                    </Scroll>

                </div>


                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{active:currentShow === 'cd'}"></span>
                        <span class="dot" :class="{active:currentShow === 'lyric'}"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{currentTime | time}}</span>
                        <div class="progress-bar-wrapper">
                            <ProgressBar :percent="percent" @percentChange="onProgressBarChange"></ProgressBar>
                        </div>
                        <span class="time time-r">{{currentSong.duration | time}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="changeMode">
                            <i :class="iconMode"></i>
                        </div>
                        <div @click="prev" class="icon i-left" :class="disableCls">
                            <i class="icon-prev"></i>
                        </div>
                        <div @click="togglePlaying" class="icon i-center" :class="disableCls">
                            <i :class="playIcon"></i>
                        </div>
                        <div @click="next" class="icon i-right" :class="disableCls">
                            <i class="icon-next"></i>
                        </div>
                        <div class="icon i-right" @click="toggleFavorite(currentSong)">
                            <i class="icon" :class="getFavoriteIcon(currentSong)"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!--小播放器-->
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <img :class="cdCls" widt="40" height="40" :src="currentSong.image"/>
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <ProgressCircle :radius="radius" :percent="percent">
                        <i :class="miniIcon" class="icon-mini" @click.stop="togglePlaying"></i>
                    </ProgressCircle>
                </div>
                <div class="control" @click.stop="showPlayList">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>

        <PlayList ref="playList"></PlayList>

        <audio ref="audio" :src="currentSong.url"
               @play="ready" @error="error"
               @timeupdate="updateTime"
               @ended="endPlay">
        </audio>
    </div>
</template>

<script>
    import {mapGetters, mapMutations,mapActions} from 'vuex'
    import TYPES from '../../store/mutation-type'
    import animations from 'create-keyframe-animation'
    import {prefixStyle} from '@/assets/js/dom.js'
    import ProgressBar from '@/base/progress-bar/progress-bar'
    import ProgressCircle from '@/base/progress-circle/progress-circle'
    import {getLyric} from '@/api/index.js'
    import Lyric from 'lyric-parser'
    import Scroll from '@/base/scroll/scroll'
    import PlayList from '@/components/playlist/playlist'
    import {playerMixin} from '@/assets/js/mixin'
    import {playMode} from '@/assets/js/config'


    const transform = prefixStyle('transform');
    const transitionDuration = prefixStyle('transitionDuration');

    export default {
        name: 'player',
        mixins: [playerMixin],
        data: function () {
            return {
                init: true,
                songReady: false,
                currentTime: 0,             //当前歌曲播放的时长
                radius: 32,
                currentLyric: null,
                currentLineNum: 0,             //当前歌词在第几行
                currentShow: 'cd',
                playingLyric: ''
            }
        },
        created() {
            this.touch = {};                    //存放touch事件的坐标等参数
        },
        mounted() {

        },
        filters: {
            time(value) {
                value = Math.floor(value);
                let _s = value - Math.floor(value / 60) * 60;
                _s = _s < 10 ? '0' + _s : _s;
                return `${Math.floor(value / 60)}:${_s}`
            }
        },
        computed: {
            cdCls() {    //控制cd旋转
                return this.playing ? 'play' : 'play pause'
            },
            disableCls() {
                return this.songReady ? '' : 'disable'
            },
            playIcon() {
                return this.playing ? 'icon-pause' : 'icon-play';
            },
            miniIcon() {
                return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
            },
            percent() {
                return this.currentTime / this.currentSong.duration;
            },
            ...mapGetters([
                'playing',
                'fullScreen',
                'currentIndex',
            ])
        },
        components: {ProgressBar, ProgressCircle, Scroll, PlayList},
        watch: {
            currentSong(newSong, oldSong) {
                //如果歌曲列表为空
                if (!newSong.id) {
                    return;
                }

                if (newSong.id === oldSong.id) {
                    return;
                }

                //切换歌曲时先停止播放歌词
                if(this.currentLyric){
                    this.currentLyric.stop();
                }
                clearTimeout(this.timer);
                this.timer = window.setTimeout(() => {
                    this.$refs.audio.play();
                    this.init = false;
                    this.reqLyric();        //播放歌曲后马上获取歌词并播放歌词
                }, 1000);
            },
            playing(newPlaying) {
                if (!this.init) {
                    console.log('watch playing');
                    let audio = this.$refs.audio;
                    newPlaying ? audio.play() : audio.pause();
                }
            }
        },
        methods: {
            back() {
                this.setFullScreen(false);
            },
            open() {
                this.setFullScreen(true);
            },
            enter(el, done) {
                const {x, y, scale} = this.getPosAndScale();

                let animation = {
                    0: {
                        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                    },
                    60: {
                        transform: `translate3d(0,0,0) scale(1.1)`
                    },
                    100: {
                        transform: `translate3d(0,0,0) scale(1)`
                    },
                };

                animations.registerAnimation({
                    name: 'move',
                    animation: animation,
                    presets: {
                        duration: 400,
                        easing: 'linear'
                    }
                });

                animations.runAnimation(this.$refs.cdWrapper, 'move', done);
            },
            afterEnter() {
                animations.unregisterAnimation('move');
                this.$refs.cdWrapper.style.animation = '';
            },
            leave(el, done) {
                this.$refs.cdWrapper.style.transition = 'all 0.4s';
                const {x, y, scale} = this.getPosAndScale();
                this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
                this.$refs.cdWrapper.addEventListener('transitionend', done);
            },
            afterLeave() {
                this.$refs.cdWrapper.style.transition = '';
                this.$refs.cdWrapper.style[transform] = '';
            },
            getPosAndScale() {
                const targetWith = 40;
                const paddingLeft = 40;
                const paddingBottom = 80;
                const paddingTop = 80;

                const width = window.innerWidth * 0.8;
                const scale = targetWith / width;

                const x = -(window.innerWidth / 2 - paddingLeft);
                const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;

                return {
                    x, y, scale
                }
            },
            ready() {
                this.songReady = true;    //当前歌曲加载好了

                this.savePlayHistory(this.currentSong);
            },
            error() {
                this.songReady = true;    //当前歌曲加载不了，也可以播放别的歌曲
            },
            endPlay() {
                //根据播放模式来判断播放结束触发什么
                if (this.mode !== playMode.loop) {
                    this.next();
                } else {
                    this.loop();
                }
            },
            loop() {
                this.$refs.audio.currentTime = 0;
                this.$refs.audio.play();

                if(this.currentLyric){
                    this.currentLyric.seek(0);     //如果是单曲循环结束，歌词重新定位到顶部
                }
            },
            togglePlaying() {
                if (!this.songReady) {
                    return;
                }
                this.setPlayingState(!this.playing);

                if (this.currentLyric) {
                    this.currentLyric.togglePlay();
                }
            },
            next() {
                if (!this.songReady) {           //切换太快时不让歌曲切换
                    return;
                }

                //如果列表只有一条歌曲，当做loop处理
                if (this.playList.length === 1) {
                    this.loop();
                    return;
                } else {
                    let _index = this.currentIndex == this.playList.length - 1 ? 0 : ++this.currentIndex;
                    this.setCurrentIndex(_index);    //下一曲
                    if (!this.playing) {
                        this.togglePlaying();        //上下切换歌曲要将状态改为播放
                    }
                }

                this.songReady = false;
            },
            prev() {
                if (!this.songReady) {
                    return;
                }

                if (this.playList.length === 1) {
                    this.loop();
                    return;
                } else {
                    let _index = this.currentIndex == 0 ? this.playList.length - 1 : --this.currentIndex;
                    this.setCurrentIndex(_index);    //上一曲
                    if (!this.playing) {
                        this.togglePlaying();
                    }
                }

                this.songReady = false;
            },
            updateTime(e) {
                this.currentTime = e.target.currentTime;    //实时改变当前播放的时间
            },
            onProgressBarChange(percent) {

                //currentTime为audio的可读写属性，用来控制歌曲的播放时长
                let currentTime = this.currentSong.duration * percent;
                this.$refs.audio.currentTime = currentTime;
                if (!this.playing) {
                    this.togglePlaying();
                }

                //改变进度条后改变歌词进度
                if (this.currentLyric) {
                    this.currentLyric.seek(currentTime * 1000);
                }
            },
            reqLyric() {
                this.currentSong.getLyric().then((lyric) => {
                    if (this.currentSong.lyric !== lyric) {
                        return;
                    }
                    this.currentLyric = new Lyric(lyric, this.handleLyric);
                    if (this.playing) {
                        this.currentLyric.play();
                    }
                }).catch(() => {                  //获取歌词失败
                    this.currentLyric = null;
                    this.playingLyric = '';
                    this.currentLineNum = 0;
                });

            },
            handleLyric({lineNum, txt}) {
                this.currentLineNum = lineNum;

                //歌词跟随进度滚动，并且高亮一行始终在屏幕中间
                if (lineNum > 5) {
                    let lineEl = this.$refs.lyricLine[lineNum - 5];  //v-for出来的dom被封装为一个数组
                    this.$refs.lyricList.scrollToElement(lineEl, 1000);
                } else {
                    this.$refs.lyricList.scrollTo(0, 0, 1000);
                }

                this.playingLyric = txt;

            },
            middleTouchStart(e) {
                const touch = e.touches[0];
                this.touch = {
                    init: true,
                    startX: touch.pageX,
                    startY: touch.pageY
                };
            },
            middleTouchMove(e) {
                if (!this.touch.init) {
                    return;
                }

                const touch = e.touches[0];
                let deltaX = touch.pageX - this.touch.startX;
                let deltaY = touch.pageY - this.touch.startY;
                if (Math.abs(deltaX) < Math.abs(deltaY)) {
                    return;
                }

                let left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
                let offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));

                this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
                this.$refs.lyricList.$el.style[transitionDuration] = 0;
                this.$refs.middleLeft.style.opacity = 1 - this.touch.percent;
                this.$refs.middleLeft.style[transitionDuration] = 0;
            },
            middleTouchEnd() {
                let offsetWidth;
                let opacity;

                if(this.currentShow==='cd'){
                    if(this.touch.percent >0.1){
                        offsetWidth = -window.innerWidth;
                        this.currentShow = 'lyric';
                        opacity = 0;
                    }else {
                        offsetWidth=0;
                        opacity =1;
                    }
                }else {
                    if(this.touch.percent<0.9){
                        offsetWidth=0;
                        this.currentShow='cd';
                        opacity = 1;
                    }else {
                        offsetWidth=-window.innerWidth;
                        opacity = 0;
                    }
                }

                const time = 300;
                this.$refs.lyricList.$el.style[transform]=`translate3d(${offsetWidth}px,0,0)`;
                this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
                this.$refs.middleLeft.style.opacity = opacity;
                this.$refs.middleLeft.style[transitionDuration] = `${time}ms`;
            },
            showPlayList() {
                this.$refs.playList.show();
            },
            ...mapMutations({
                setFullScreen: TYPES.SET_FULL_SCREEN,
            }),
            ...mapActions([
                'savePlayHistory'
            ])
        }
    };

</script>

<style scoped rel="stylesheet/stylus" lang="stylus">
    @import "../../assets/stylus/variable.styl";
    @import "../../assets/stylus/mixin.styl";

    .player
        .normal-player
            position: fixed
            left: 0
            right: 0
            top: 0
            bottom: 0
            z-index: 150
            background: $color-background
        .background
            position: absolute
            left: 0
            top: 0
            width: 100%
            height: 100%
            z-index: -1
            opacity: 0.6
            filter: blur(20px)
        .top
            position: relative
            margin-bottom: 25px
            .back
                position absolute
                top: 0
                left: 6px
                z-index: 50
                .icon-back
                    display: block
                    padding: 9px
                    font-size: $font-size-large-x
                    color: $color-theme
                    transform: rotate(-90deg)
            .title
                width: 70%
                margin: 0 auto
                line-height: 40px
                text-align: center
                no-wrap()
                font-size: $font-size-large
                color: $color-text
            .subtitle
                line-height: 20px
                text-align: center
                font-size: $font-size-medium
                color: $color-text
        .middle
            position: fixed
            width: 100%
            top: 80px
            bottom: 170px
            white-space: nowrap
            font-size: 0
            .middle-l
                display: inline-block
                vertical-align: top
                position: relative
                width: 100%
                height: 0
                padding-top: 80%
                .cd-wrapper
                    position: absolute
                    left: 10%
                    top: 0
                    width: 80%
                    height: 100%
                    .cd
                        width: 100%
                        height: 100%
                        box-sizing: border-box
                        border: 10px solid rgba(255, 255, 255, 0.1)
                        border-radius: 50%
                        &.play
                            animation: rotate 20s linear infinite
                        &.pause
                            animation-play-state: paused
                        .image
                            position: absolute
                            left: 0
                            top: 0
                            width: 100%
                            height: 100%
                            border-radius: 50%

                .playing-lyric-wrapper
                    width: 80%
                    margin: 30px auto 0 auto
                    overflow: hidden
                    text-align: center
                    .playing-lyric
                        height: 20px
                        line-height: 20px
                        font-size: $font-size-medium
                        color: $color-text-l
            .middle-r
                display: inline-block
                vertical-align: top
                width: 100%
                height: 100%
                overflow: hidden
                .lyric-wrapper
                    width: 80%
                    margin: 0 auto
                    overflow: hidden
                    text-align: center
                    .text
                        line-height: 32px
                        color: $color-text-l
                        font-size: $font-size-medium
                        &.current
                            color: $color-text
        .bottom
            position: absolute
            bottom: 50px
            width: 100%
            .dot-wrapper
                text-align: center
                font-size: 0
                .dot
                    display: inline-block
                    vertical-align: middle
                    margin: 0 4px
                    width: 8px
                    height: 8px
                    border-radius: 50%
                    background: $color-text-l
                    &.active
                        width: 20px
                        border-radius: 5px
                        background: $color-text-ll
            .progress-wrapper
                display: flex
                align-items: center
                width: 80%
                margin: 0 auto
                padding: 10px 0
                .time
                    color: $color-text
                    font-size: $font-size-small
                    flex: 0 0 30px
                    line-height: 30px
                    width: 30px
                    &.time-l
                        text-align: left
                    &.time-r
                        text-align: right
                .progress-bar-wrapper
                    flex: 1
            .operators
                display: flex
                align-items: center
                .icon
                    flex: 1
                    color: $color-theme
                    &.disable
                        color: $color-theme-d
                    i
                        font-size: 30px
                .i-left
                    text-align: right
                .i-center
                    padding: 0 20px
                    text-align: center
                    i
                        font-size: 40px
                .i-right
                    text-align: left
                .icon-favorite
                    color: $color-sub-theme
        &.normal-enter-active, &.normal-leave-active
            transition: all 0.4s
            .top, .bottom
                transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
        &.normal-enter, &.normal-leave-to
            opacity: 0
            .top
                transform: translate3d(0, -100px, 0)
            .bottom
                transform: translate3d(0, 100px, 0)

    .mini-player
        display: flex
        align-items: center
        position: fixed
        left: 0
        bottom: 0
        z-index: 180
        width: 100%
        height: 60px
        background: $color-highlight-background
        &.mini-enter-active, &.mini-leave-active
            transition: all 0.4s
        &.mini-enter, &.mini-leave-to
            opacity: 0
        .icon
            flex: 0 0 40px
            width: 40px
            padding: 0 10px 0 20px
            img
                border-radius: 50%
                &.play
                    animation: rotate 10s linear infinite
                &.pause
                    animation-play-state: paused
        .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            .name
                margin-bottom: 2px
                no-wrap()
                font-size: $font-size-medium
                color: $color-text
            .desc
                no-wrap()
                font-size: $font-size-small
                color: $color-text-d
        .control
            flex: 0 0 30px
            width: 30px
            padding: 0 10px
            .icon-play-mini, .icon-pause-mini, .icon-playlist
                font-size: 30px
                color: $color-theme-d
            .icon-mini
                font-size: 32px
                position: absolute
                left: 0
                top: 0

    @keyframes rotate
        0%
            transform: rotate(0)
        100%
            transform: rotate(360deg)
</style>

