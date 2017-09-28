<template>
    <!--动画效果-->
    <transition name="slide">
        <MusicList v-bind="{'title':title,'bgImg':bgImg,'songs':songs}"></MusicList>
    </transition>
</template>

<script>
import {mapGetters} from 'vuex';
import {getSongs} from '@/api/index';
import {createSong} from '@/assets/js/Song.js';
import MusicList from '../music-list/music-list';

export default {
    name:'singer-detail',
    data() {
        return {
            songs:[]
        }
    },
    created() {
        this.reqSongs();
    },
    computed:{
        title() {
            return this.singer.name;
        },
        bgImg() {
            return this.singer.avatar;
        },
        ...mapGetters([
            'singer'
        ])
    },
    components: {MusicList},
    methods: {
        reqSongs() {
            if(!this.singer.singerId){
                this.$router.push({
                    path:'/singer'
                })
            }
            getSongs((res) => {
                this.songs = this.formatSongs(res.data.list);
            },this.singer.singerId);
        },
        formatSongs(list) {
            let ret = [];
            list.forEach((item) => {
                let {musicData} = item;
                if(musicData.songid && musicData.albummid) {
                    ret.push(createSong(musicData));
                }
            });
            return  ret;   
        },
    }
};

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "../../assets/stylus/variable.styl";

    /* 动画效果 */
    .slide-enter-active,.slide-leave-active
        transition :all 0.3s;
    .slide-enter,.slide-leave-to
        transform:translate3d(100%,0,0);

</style>

