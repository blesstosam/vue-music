<template>
  <div id="app">
    <MHeader></MHeader>

    <Tab></Tab>

    <keep-alive>                   <!-- 将子路由组件缓存起来 -->
      <router-view></router-view>
    </keep-alive>

    <Player></Player>
  </div>
</template>

<script>
import MHeader from '@/components/m-header/m-header.vue';
import Tab from '@/components/tab/tab.vue';
import Player from '@/components/player/player.vue';


export default {
  name: 'app',
  mounted(){
    console.log('app mounted...')
  },
  computed: {

  },
  components:{MHeader,Tab,Player}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
