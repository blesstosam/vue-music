<template>
    <div class="singer" ref="singer">
        <ListView @select="selectSinger" :data="singers" ref="list"></ListView>
        <router-view></router-view>
    </div>
</template>

<script>
import {getSingerList} from '@/api/index'
import Singer from '@/assets/js/Singer'
import ListView from '@/base/listview/listview';
import {mapMutations} from 'vuex'
import TYPES from '../../store/mutation-type';
import {playListMixin} from '@/assets/js/mixin.js'

const HOT_NAME='热门';
const HOT_SINGER_LEN=10;

export default {
    name:'singer',
    data: function () {
        return {
            singers:[]
        }
    },
    mixins:[playListMixin],
    created() {
        console.log('singer created...');
        this.reqSinger();
    },
    mounted() {

    },
    components: {ListView},
    methods: {
        //进入歌手详情页
        selectSinger(singer) {
            this.$router.push({
                path:`/singer/${singer.id}`
            });

            //将歌手更新到Vuex
            this.setSinger(singer);

        },
        reqSinger(){
            getSingerList((res)=>{
                this.singers = this.formatSinger(res.data.list);
            })
        },
        formatSinger(list) {
            let map = {
                hot:{
                    title:HOT_NAME,
                    items:[]
                }
            };

            list.forEach(function (item,index) {

                //取前十条数据作为热门
                if(index<HOT_SINGER_LEN){
                    map.hot.items.push(new Singer(
                        item.Fsinger_mid,
                        item.Fsinger_name,
                        item.Fsinger_id
                    ))
                }

                const key = item.Findex;
                if(!map[key]){
                    map[key]={
                        title:key,
                        items:[]
                    }
                }

                map[key].items.push(new Singer(
                    item.Fsinger_mid,
                    item.Fsinger_name,
                    item.Fsinger_id
                ))
            });

            //将map处理成数组
            let hot = [], ret = [];
            for (let key in map){
                let val=map[key];
                if(val.title.match(/[a-zA-Z]/)){
                    ret.push(val)
                }else if(val.title===HOT_NAME){
                    hot.push(val);
                }
            }

            //按字母升序排列
            ret.sort((a,b)=>{
                return a.title.charCodeAt(0)-b.title.charCodeAt(0)
            });

            return hot.concat(ret);

        },
        handlePlayList(playlist) {
            let bottom = playlist.length > 0 ? '60px' : '';
            this.$refs.singer.style.bottom = bottom;
            this.$refs.list.refresh();
        },
        ...mapMutations({
            setSinger:TYPES.SET_SINGER    //'SET_SINGER'
        })
    }
};

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "../../assets/stylus/variable"

    .singer
        position :fixed;
        top:88px;
        bottom:0;
        width:100%;




</style>

