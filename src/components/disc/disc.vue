<template>
    <transition name="slide">
        <MusicList v-bind="{'title':title,'bgImg':bgImg,'songs':songs}"></MusicList>
    </transition>
</template>

<script>
    import MusicList from '@/components/music-list/music-list'
    import {getSongList} from '@/api/index.js'
    import {mapGetters} from 'vuex';
    import {createSong} from '@/assets/js/Song'

    export default {
        name: 'disc',
        data() {
            return {
                songs: []
            }
        },
        created() {

        },
        mounted() {
            this.reqSongList();
        },
        computed: {
            title() {
                return this.disc.dissname;
            },
            bgImg() {
                return this.disc.imgurl;
            },
            ...mapGetters ([
                'disc'
            ])
        },
        components: {MusicList},
        methods: {
            reqSongList() {
                if(!this.disc.dissid){
                    this.$router.push({path: '/recommend'});
                    return;
                }
                getSongList((res) => {
                    this.songs = this.formatSongs(res.cdlist[0].songlist);
                    console.log(this.songs)
                }, this.disc.dissid);
            },
            formatSongs(list) {
                let ret = [];

                list.forEach((v) => {
                    if(v.songid && v.albumid) {
                        ret.push(createSong(v));
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

