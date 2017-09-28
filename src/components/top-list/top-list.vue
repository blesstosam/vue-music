<template>
    <transition name="slide">
        <MusicList
            v-bind="{'title':topList.topTitle,'bgImg':bgImg,'songs':songs}"
            rank="rank">
        </MusicList>
    </transition>
</template>

<script>
import MusicList from '@/components/music-list/music-list'
import {mapGetters} from 'vuex';
import {getSingleTopList} from '@/api/index'
import {createSong} from '@/assets/js/Song'


export default {
    name: 'top-list',
    data() {
        return {
            songs: [],
            rank: true
        }
    },
    created() {
        this.reqSingleTop();
    },
    computed: {
        bgImg() {
            if(this.songs.length) {
                return this.songs[0].image;
            }
            return '';
        },
        ...mapGetters([
            'topList'
        ])
    },
    components: {MusicList},
    methods: {
        reqSingleTop() {
            if(!this.topList.id){
                this.$router.push({path: '/rank'});
                return;
            }

            getSingleTopList((res) => {
                this.songs = this.formatSong(res.songlist);
                console.log(this.songs)
            }, this.topList.id)
        },
        formatSong(list) {
            let ret = [];
            list.forEach((v) => {
                let musicData = v.data;
                if(musicData.songid && musicData.albumid) {
                    ret.push(createSong(musicData));
                }
            });

            return ret;
        }
    }
};

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s

    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)

</style>

