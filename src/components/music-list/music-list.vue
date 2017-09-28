<template>
  <div class="music-list">
    <div class='back' @click="back">
      <i class='icon-back'></i>
    </div>
    <h1 class='title' v-html='title'></h1>
    <div class=bg-image :style='bgStyle' ref='bgImg'>
      <div class="play-wrapper">
        <div class="play" v-show="songs.length!==0" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text" @click="random">随机播放所有歌曲</span>
        </div>
      </div>
      <div class='filter' ref="filter"></div>
    </div>

    <div class="bg-layer" ref="layer"></div>

    <Scroll @scroll="scroll" :probeType="probeType" :listenScroll="listenScroll"
            :data="songs" class="list" ref='list'>
      <div class='song-list-wrapper'>
        <SongList :rank="rank" @select="handleSelectSong" v-bind="{'songs':songs}"></SongList>
      </div>

      <div v-show="!songs.length" class="loading-container">
        <Loading></Loading>
      </div>
    </Scroll>
  </div>
</template>

<script>
import SongList from '@/base/song-list/song-list.vue';
import Loading from '@/base/loading/loading.vue';
import Scroll from '@/base/scroll/scroll.vue';
import {prefixStyle} from '@/assets/js/dom.js';
import {mapActions} from 'vuex';
import TYPES from '../../store/mutation-type';
import {playListMixin} from '@/assets/js/mixin.js'

const transform = prefixStyle('transform');
const backdrop = prefixStyle('backdrop-filter');

export default {
  name: 'music-list',
  data() {
    return {
        scrollY : 0
    }
  },
  mixins:[playListMixin],
  watch: {
      scrollY(newY) {
          let translateY = Math.max(this.minTranslateY,newY);
          let zIndex = 0;
          let scale = 1;      //歌手图片放大比例
          let blur = 0;       //歌手图片模糊程度,只有ios有效果
          this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
          const percent = Math.abs(newY / this.imgHeight);
          if(newY > 0) {
              scale = 1 + percent;
              zIndex = 10
          }else {
              blur = Math.min(20 * percent, 20);
          }
          this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
          if (newY < translateY){
            zIndex = 10;
            this.$refs.bgImg.style.paddingTop = 0;
            this.$refs.bgImg.style.height = '40px';
            this.$refs.playBtn.style.display = 'none';  //滚动播放列表到顶部播放按钮消失
          } else {
            this.$refs.bgImg.style.paddingTop = '70%';
            this.$refs.bgImg.style.height = 0;
            this.$refs.playBtn.style.display = '';
          }
          this.$refs.bgImg.style[transform] = `scale(${scale})`;
          this.$refs.bgImg.style.zIndex = zIndex;

      }
  },
  props: {
    bgImg : {
      type : String,
      default : ''
    },
    songs : {
      type : Array,
      default : []
    },
    title : {
      type : String,
      default : ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImg})`;
    }
  },
  created() {
      this.probeType = 3;
      this.listenScroll = true;
  },
  mounted(){
    console.log('music-list mounted...');
    this.imgHeight = this.$refs.bgImg.clientHeight;
    this.minTranslateY = -this.imgHeight + 40;
    this.$refs.list.$el.style.top=`${this.imgHeight}px`;
  },
  components:{SongList,Scroll,Loading},
  methods: {
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    handleSelectSong(song, index) {
      this.selectPlay({
          list : this.songs,
          index :index
      });
    },
    random() {
      this.randomPlay({
          list: this.songs
      });
    },
    handlePlayList(playlist) {
        let bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.list.$el.style.bottom = bottom;
        this.$refs.list.refresh();
    },
    ...mapActions([
        'selectPlay',
        'randomPlay'
    ])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/variable"
  @import "../../assets/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
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
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
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
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)  
</style>
